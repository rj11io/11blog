export const renderingModel = `
# How pages are rendered

Every page on this blog is built before anyone visits it. Nothing is assembled per request, no database is queried, and almost none of the code that produces a page is sent to the browser. This post explains how that works, which parts are exceptions, and what the approach costs.

## Everything is built ahead of time

The three routes that vary by content each declare their addresses at build time and refuse anything else:

~~~tsx
export const dynamicParams = false

export function generateStaticParams() {
  return allPosts.map((post) => ({
    pubId: post.publicationId,
    postId: post.slug ?? String(post.postId),
  }))
}
~~~

The publication and author pages do the same with their own lists. dynamicParams set to false means an address that was not listed is a 404 rather than something rendered on demand. See [URLs, slugs, and redirects](/blog-platform/urls-and-redirects).

This is possible because the content is imported code, not fetched data. The registry has already assembled and validated everything by the time any page function runs, so a page is a function from data that is already in memory to markup.

The trade is simple and worth stating plainly: publishing requires a build. There is no way to add a post to a running site.

## Server by default

Components run on the server unless they say otherwise. A component becomes a browser component only by starting its file with "use client", and that pulls it, and everything it imports, into the code sent to the browser.

Ten files opt in. Each has a reason:

| File | Why it runs in the browser |
| --- | --- |
| browse.tsx | Search text, tag filters, sort, and layout state |
| publication-browser.tsx | The same controls, plus tabs |
| content-index.tsx | Tracks the reading position to highlight the active heading |
| copy-code-button.tsx | Writes to the clipboard |
| markdown-image.tsx | Opens the fullscreen viewer |
| cover-image.tsx | Tracks whether a photo loaded, and opens the viewer |
| image-lightbox.tsx | Zoom, pan, swipe, and keyboard navigation |
| multi-image-list.tsx | Selection state for a gallery, and focus return |
| theme-provider.tsx | Reads and sets the colour mode |
| media/index.ts | Re-exports the components above |

Everything else, including the whole Markdown renderer and every page, runs only on the server.

The pattern to notice: the interactive parts are small and pushed to the leaves. A page is a server component that renders mostly server components, with a handful of interactive islands inside it. The post page sends no JavaScript of its own; it sends the sidebar, the copy button, and the image viewer.

### One consequence to watch for

A function exported from a file marked "use client" cannot be called on the server. It can be rendered, or passed as a prop, but not invoked.

This is why the helper that turns a title into initials sits in its own file, v0/www/components/media/cover-monogram.ts, with a comment explaining it. Server pages call it directly to compute a value; it could not live in cover-image.tsx alongside the component that uses the result.

If you find yourself needing to call a helper from both sides, move it to a file with no "use client" marker.

## Code highlighting never reaches the browser

The code block is an async server component:

~~~tsx
export async function CodeBlock({ code, language }) {
  const html = await highlight(code, language)
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
~~~

Shiki, the highlighter, runs during the build. Its themes and language grammars are large, and none of it is sent to the browser: the reader receives already-coloured markup.

The markup carries both a light and a dark colour on every token, and the stylesheet picks between them, so switching mode recolours code without re-highlighting anything. See [Design tokens and theming](/blog-platform/design-tokens).

Unknown languages fall back to plain text rather than failing, so a fenced block labelled with something Shiki does not recognise still renders.

## The image viewer loads on first click

The fullscreen viewer is the largest interactive component in the codebase, and most pages that could open it never do. So it is not part of the initial download:

~~~tsx
const ImageLightbox = dynamic(
  () => import("./image-lightbox").then((module) => module.ImageLightbox),
  { ssr: false }
)
~~~

It is fetched when a reader first clicks a zoomable image. The comment in the file notes the reason: list and card surfaces are never zoomable, so they should not carry the dialog at all.

ssr set to false means it is not rendered on the server either, which is correct for something that only exists in response to a click.

## Plain image elements, on purpose

Next.js has an image component that optimises and resizes images. The blog does not use it for content images. Cover art, post images, and gallery items are all plain image elements, and the linting rule that objects is switched off at each of those lines.

The reason is stated in a comment in cover-image.tsx: content can point at any host, and the optimising component requires every host to be listed in configuration up front. Content that needs a configuration change before it can reference an image would break the boundary between content and website. See [The content contract](/blog-platform/content-contract).

Author photographs, which live in the site's own public directory and are known ahead of time, do use the optimising component.

The cost of that choice is that three things become manual.

**Dimensions.** Post images carry width and height in their configuration, which is why those fields are required and validated. Without them the page would jump as each image arrives.

**Thumbnails.** An image can carry a separate smaller source for its inline or gallery appearance, with the full-size file loaded only in the viewer. There is no automatic resizing, so both files are prepared by hand.

**Load state.** The generated cover art sits behind every cover, and the photograph fades in over it. That needs the component to know whether the photograph loaded, failed, or is still arriving.

### The cached-image problem

That last point has a subtlety worth knowing, because it is the kind of bug that only appears on a second visit.

A cached image can finish loading before React has attached its handlers. The load event fires into nothing, and the component waits forever for news that has already happened. The fix is to read the element as it attaches:

~~~tsx
function readOnAttach(image: HTMLImageElement | null) {
  if (!image?.complete) return
  report(image.naturalWidth > 0 ? "loaded" : "failed")
}
~~~

An element that is already complete has finished, one way or the other, and a natural width of zero means it failed. Checking the width distinguishes the two.

A related trick sits in the same component: the photograph is given a key set to its source. Changing the key makes React treat it as a new element, so the pending state restarts on its own and no reset logic is needed.

## Browse needs a boundary

The browse page keeps its selected content type in the address, so the choice can be linked and shared. Reading the address requires a hook that suspends, so the component is wrapped:

~~~tsx
<Suspense>
  <Browse authors={authorPreviews} posts={postPreviews} publications={publicationPreviews} />
</Suspense>
~~~

Without the boundary the build refuses to prerender the page. The rest of the browse state, meaning search text, sort, and layout, is ordinary component state and is not in the address.

Note what is passed in: previews, not full posts. Everything handed to a browser component is serialised and sent over the network, so the preview types keep every post body out of that payload.

## Markdown is parsed twice

The post page parses each body twice, on purpose.

Once to collect the headings for the sidebar, in markdown-headings.ts. Once to render, in markdown.tsx.

Doing it in one pass would mean the renderer collecting headings as a side effect and the sidebar waiting for it, which puts a data dependency between two components that are otherwise independent. Two passes over a body that is already in memory, during a build, costs nothing worth optimising.

The important part is that both passes generate heading identifiers with the same factory:

~~~ts
export function createHeadingIdFactory() {
  const occurrences = new Map<string, number>()

  return (label: string) => {
    /* slugify, then number any repeat */
  }
}
~~~

It strips accents, lowercases, replaces anything that is not a letter or digit with a hyphen, and appends a number to repeats so two identical headings get distinct identifiers. Because the sidebar and the renderer both use it, and both walk the document in the same order, the links and the targets always agree.

If you ever change how identifiers are made, both callers change together, and old links to old anchors break. It is the same problem as renaming a slug, one level down.

## What this buys, and what it costs

What it buys: pages that are files, no server work per request, almost no JavaScript on a reading page, and a build that fails loudly when content is wrong.

What it costs: publishing needs a build, content cannot change at request time, and image handling is manual work at authoring time.

Both lists are short, which is the point. If you are considering this approach for another blog, the deciding question is whether you are willing to run a build to publish. If yes, most of the rest follows.
`

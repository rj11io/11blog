export const renderingModel = `
# How pages are rendered

Every page on this blog is built before anyone visits it. Nothing is assembled per request, no database is queried, and almost none of the code that produces a page is sent to the browser. This post explains how that works, which parts are exceptions, and what the approach costs.

## Everything is built ahead of time

The four routes that vary by content each declare their addresses at build time and refuse anything else:

~~~tsx
export const dynamicParams = false

export function generateStaticParams() {
  return allPosts.map((post) => ({
    pubId: post.publicationId,
    postId: post.slug ?? String(post.postId),
  }))
}
~~~

The publication, author, and browse routes do the same with their own lists. dynamicParams set to false means an address that was not listed is a 404 rather than something rendered on demand. See [URLs, slugs, and redirects](/blog-platform-docs/urls-and-redirects). Each of these routes also exports generateMetadata, which builds the page title, description, and link-preview tags from the same registry data at the same time.

This is possible because the content is imported code, not fetched data. The registry has already assembled and validated everything by the time any page function runs, so a page is a function from data that is already in memory to markup.

The trade is simple and worth stating plainly: publishing requires a build. There is no way to add a post to a running site.

## Server by default

Components run on the server unless they say otherwise. A component becomes a browser component only by starting its file with "use client", and that pulls it, and everything it imports, into the code sent to the browser.

Eighteen hand-written entries opt in. Each has a reason:

| File | Why it runs in the browser |
| --- | --- |
| browse.tsx | Search text, tag filters, sort, and layout state |
| publication-browser.tsx | The same controls, plus tabs |
| content-index.tsx | Tracks the reading position to highlight the active heading |
| copy-code-button.tsx | Writes to the clipboard |
| copy-link-button.tsx | Writes to the clipboard, in the share row |
| native-share-button.tsx | Opens the device share sheet, where there is one |
| markdown-image.tsx | Opens the fullscreen viewer |
| cover-image.tsx | Tracks whether a photo loaded, and opens the viewer |
| image-lightbox.tsx | Zoom, pan, swipe, and keyboard navigation |
| multi-image-list.tsx | Selection state for a gallery, and focus return |
| masonry-image-list.tsx | Opens the viewer from a masonry gallery |
| quilted-image-list.tsx | Opens the viewer from a quilted gallery |
| theme-provider.tsx | Reads and sets the colour mode |
| theme-toggle.tsx | The button that switches mode |
| hooks/use-persisted-preference.ts | Builds the store behind each remembered preference |
| hooks/use-view-mode.ts | The list-or-cards choice |
| hooks/use-sort-order.ts | The content and author sort choices |
| hooks/use-mounted.ts | Answers whether the first render is over |

The vendored components under components/ui carry the same directive, because that is how they arrive from their generator. Most are never imported and so never ship; one genuinely does — the dialog, which the image viewer is built on, reaches the browser with it. See [Design tokens and theming](/blog-platform-docs/design-tokens) for what that directory is.

Everything else, including the Markdown renderer itself and every page, runs only on the server. The renderer still emits interactive islands — an inline image, a gallery — but those are the client components in the table, imported at the leaves; the parsing and the component map never ship.

The pattern to notice: the interactive parts are small and pushed to the leaves. A page is a server component that renders mostly server components, with a handful of interactive islands inside it. The post page sends no JavaScript of its own; what ships is the sidebar, the cover image, a copy button per fenced code block, the copy-link and share-sheet buttons in the share row, and the image components for any post that has images.

### The share row is a worked example

The share actions at the foot of a post are the clearest case of pushing interaction to the leaves, because they are a mixture.

Six of the eight controls are links to a page a social network owns. A link needs no JavaScript, so the component that renders them, v0/www/app/components/share-actions.tsx, is an ordinary server component. Two controls do need the browser: one writes the address to the clipboard, the other opens the device's share sheet. Each is a separate file, each marked "use client", and each is small.

Written the obvious way, as one browser component wrapping everything, the whole row would have shipped as JavaScript and the six links would have stopped working for anyone whose scripts had not loaded yet. Split this way, the row renders and works from the prerendered markup, and the two buttons arrive later.

The share sheet button is worth a second look, because it is the one control on the site whose existence depends on the device. Most desktop browsers have no share sheet, so it renders nothing there. That test cannot run during the build, which means it cannot run during the first render either: the server would guess one answer and the browser might have another, and the two sets of markup would disagree. So it renders nothing at first and appears after hydration, using v0/www/hooks/use-mounted.ts to know when that has happened. The colour theme toggle solves the same problem the same way.

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

Shiki, the highlighter, runs during the build. Its themes and language grammars are large, and none of it is sent to the browser: the reader receives already-coloured markup. The block does ship two small things of its own — the header bar's language label and the copy button, which is a client component — but the highlighting itself never does.

The markup carries both a light and a dark colour on every token, and the stylesheet picks between them, so switching mode recolours code without re-highlighting anything. See [Design tokens and theming](/blog-platform-docs/design-tokens).

Unknown languages fall back to plain text rather than failing, so a fenced block labelled with something Shiki does not recognise still renders.

## The image viewer loads on first click

The fullscreen viewer is the largest interactive component in the codebase, and most pages that could open it never do. So it is not part of the initial download. The same wrapper appears in every component that can open it — the cover image, the inline post image, and the galleries — and each renders the viewer only once it has been opened:

~~~tsx
const ImageLightbox = dynamic(
  () => import("./image-lightbox").then((module) => module.ImageLightbox),
  { ssr: false }
)
~~~

It is fetched when a reader first clicks a zoomable image. The comment in each file notes the reason: a reader who never enlarges an image should never download the dialog.

ssr set to false means it is not rendered on the server either, which is correct for something that only exists in response to a click.

## Plain image elements, on purpose

Next.js has an image component that optimises and resizes images. The blog does not use it for content images. Cover art, post images, and gallery items are all plain image elements, and the linting rule that objects is switched off at each of those lines.

The reason is stated in a comment in cover-image.tsx: content can point at any host, and the optimising component requires every host to be listed in configuration up front. Content that needs a configuration change before it can reference an image would break the boundary between content and website. See [The content contract](/blog-platform-docs/content-contract).

Author photographs, which live in the site's own public directory and are known ahead of time, do use the optimising component.

The cost of that choice is that three things become manual.

**Dimensions.** Post images carry width and height in their configuration, which is why those fields are required and validated. Without them the page would jump as each image arrives. That protection covers configured images only: a plain Markdown image written as ![alt](url) passes no dimensions through, so it can still shift the page as it loads — one more reason the named-image form is preferred.

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

## The browse page reads its state from the route

The browse page shows one of three content types, and which one is a path segment: /browse/posts, /browse/publications, /browse/authors. The route resolves the segment on the server and passes it down as an ordinary prop:

~~~tsx
<Browse
  contentType={content}
  authors={authorPreviews}
  posts={postPreviews}
  publications={publicationPreviews}
/>
~~~

This is worth knowing because it used to work the other way. The content type was a query parameter, and the browser component read it with a hook that suspends, which meant the page needed a Suspense boundary around it or the build refused to prerender. Moving the choice into the path removed the hook, and the boundary went with it. A value the server already knows should be resolved on the server and handed down.

The rest of the browse state, meaning search text, selected tags, and sort, is ordinary component state and is not in the address.

## A reader preference the server cannot know

Three pieces of view state outlive the page: the card-or-list layout, how posts and publications are sorted, and how authors are sorted. Each lives in the browser's local storage and is read through the same small store, built by v0/www/hooks/use-persisted-preference.ts and configured in use-view-mode.ts and use-sort-order.ts.

Each is shared by every list on the page, so choosing a layout or an order on the browse page also applies inside a publication. Authors keep their own sort because none of its options mean anything for a post.

It is worth walking through why they work this way, because the same reasoning applies to any preference added next.

The obvious alternative is a cookie. A cookie arrives with the request, so the server could read it and render the right layout and order immediately, with no correction afterwards. That option is closed here: reading a cookie in a server component makes the page dynamic, and these pages are prerendered. One preference would cost the whole static-generation model.

So the value is read in the browser, which means the server renders the default. The store is read with useSyncExternalStore, and its third argument is what the server renders and what hydration compares against:

~~~tsx
const value = React.useSyncExternalStore(
  subscribe,
  read,
  () => defaultValue
)
~~~

Passing the default there is what keeps the markup identical on both sides, so there is no hydration mismatch. React then reads the real value immediately after hydrating and re-renders if it differs.

The visible cost is a flash: a reader who prefers list sees cards for one frame. Cards and list produce genuinely different markup rather than the same markup styled differently, so no amount of CSS can fix that ahead of hydration. The alternative would be a blocking script in the document head, as the colour theme uses, and that is not worth it for a layout toggle.

Three smaller details in that store, and the reason it is worth having one rather than three copies. The stored value is validated against the list of allowed values on the way in, so a hand-edited or stale entry falls back to the default instead of rendering nothing. Both the read and the write are wrapped in try blocks, because storage throws outright in some privacy modes; a blocked browser loses the memory but keeps a working page. And the store listens for the browser's storage event, so changing a preference in one tab updates every other open tab. Getting those right once is the whole argument for the factory.

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

It strips accents, lowercases, replaces anything that is not a letter or digit with a hyphen, trims stray hyphens from the ends, falls back to the word section when nothing survives, and appends a number to repeats so two identical headings get distinct identifiers. Because the sidebar and the renderer both use it, and both walk the document in the same order, the links and the targets always agree. Keeping the two walks in step has one subtlety: both passes skip the inside of container directives, so a heading inside an accordion neither gets an anchor nor advances the duplicate counter. [Extending the renderer](/blog-platform-docs/extending-the-renderer) explains the machinery.

If you ever change how identifiers are made, both callers change together, and old links to old anchors break. It is the same problem as renaming a slug, one level down.

## What this buys, and what it costs

What it buys: pages that are files, no server work per request, almost no JavaScript on a reading page, and a build that fails loudly when content is wrong.

What it costs: publishing needs a build, content cannot change at request time, and image handling is manual work at authoring time.

Both lists are short, which is the point. If you are considering this approach for another blog, the deciding question is whether you are willing to run a build to publish. If yes, most of the rest follows.
`

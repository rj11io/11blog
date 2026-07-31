export const extendingTheRenderer = `
# Extending the renderer

The blog understands three pieces of syntax that ordinary Markdown does not: a named image, an image list, and a YouTube embed. All three are written the same way, and all three are built the same way. This post explains that shape so you can add a fourth.

If you only want to use the existing three, read [Markdown reference](/blog-platform-docs/markdown-reference) instead. This post is for changing the renderer.

## The shape of a shortcode

A shortcode is a paragraph containing nothing but an at sign, a name in square brackets, and an argument in round brackets:

~~~md
@[image](workspace-overview)
@[image-list](quilted:title-below)
@[youtube](dQw4w9WgXcQ)
~~~

The trick is that this is already valid Markdown. A Markdown parser reads it as two things sitting next to each other: the plain text "@", then a link whose visible label is "image" and whose address is "workspace-overview". No parser changes are needed. All the work is in recognising that pair and swapping it for something else.

Recognising it happens in a remark plugin. Remark is the Markdown parser the blog uses, and a plugin is a function that walks the parsed document and edits it before it becomes HTML. The blog's plugins live in one file: v0/www/app/(blog)/components/markdown-utils.ts.

## The five steps

Adding a component means touching two files. The plugin goes in markdown-utils.ts, and the component that draws the result goes in markdown.tsx. Neither file is long.

We will add a callout: a short highlighted note, written as @[callout](note) followed by the text.

### Step 1: write the plugin

A plugin visits every paragraph, checks whether it matches the shortcode shape, and rewrites it if so:

~~~ts
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

const calloutTonePattern = /^(?:note|warning)$/

export const remarkCallout: Plugin = () => (tree) => {
  visit(tree, "paragraph", (node) => {
    const paragraph = node as MarkdownNode
    const [prefix, link, ...rest] = paragraph.children ?? []

    if (
      prefix?.type !== "text" ||
      prefix.value !== "@" ||
      link?.type !== "link" ||
      markdownText(link).toLocaleLowerCase() !== "callout" ||
      !link.url ||
      !calloutTonePattern.test(link.url)
    ) {
      return
    }

    paragraph.data = {
      hName: "callout-block",
      hProperties: { tone: link.url },
    }
    paragraph.children = rest
  })
}
~~~

Four things in there matter.

**The guard is deliberately fussy.** It checks that the first child is the exact text "@", that the second is a link, that the link's label is the shortcode name, and that the address is present and valid. Anything else is left alone. Being strict means a paragraph that merely mentions an email address or a bracketed word is never mistaken for a shortcode.

**The argument is validated before use.** The three existing plugins each test the link address against a pattern before accepting it: an eleven-character video ID for YouTube, a lowercase key for images and lists. Do the same. It stops a typo from turning into a broken element, and for anything embedded from elsewhere it stops arbitrary text reaching an attribute.

**hName replaces the element.** Setting data.hName tells remark to render this paragraph as an element with that name instead of as a paragraph. The name is yours to choose, but keep it hyphenated so it cannot collide with a real HTML tag.

**Children decide whether text survives.** The image and YouTube plugins set children to an empty array, because the shortcode is the whole content. Our callout keeps the rest of the paragraph, because the note's text follows the shortcode. Choose whichever suits the component.

### Step 2: keep property names lowercase

Property names set through hProperties reach the component as lowercase, always. This is why the existing components take videoid, imagekey, and listkey rather than videoId, imageKey, or listKey.

Write the property lowercase in the plugin, and read it lowercase in the component. If you write hProperties with a capital letter in the middle, the component receives nothing and renders nothing, with no error to explain why. This is the single most common way to lose an afternoon here.

### Step 3: register the plugin

Add the plugin to the list inside the Markdown component in markdown.tsx:

~~~tsx
<ReactMarkdown
  remarkPlugins={[
    remarkGfm,
    remarkYouTube,
    remarkPostImage,
    remarkImageList,
    remarkCallout,
  ]}
  components={components as Components}
>
  {content}
</ReactMarkdown>
~~~

Order matters only if two plugins could match the same paragraph. The existing four cannot, because each requires a different link label.

### Step 4: write the component

Add an entry to the components object, keyed by the exact name you used for hName:

~~~tsx
function CalloutBlock({ tone, children }: MarkdownElementProps) {
  return (
    <div
      className={
        tone === "warning"
          ? "my-8 border-l-2 border-destructive bg-destructive/5 py-4 pl-5"
          : "my-8 border-l-2 border-primary bg-muted/40 py-4 pl-5"
      }
    >
      <p className="leading-8 text-muted-foreground">{children}</p>
    </div>
  )
}
~~~

Then register it alongside the others:

~~~tsx
const components = {
  // ...existing entries
  "youtube-embed": YouTubeEmbed,
  "post-image": (props: MarkdownElementProps) => (
    <ConfiguredPostImage {...props} images={images} />
  ),
  "image-list": (props: MarkdownElementProps) => (
    <PostImageList {...props} imageLists={imageLists} />
  ),
  "callout-block": CalloutBlock,
} satisfies Partial<Components> & {
  "youtube-embed": (props: MarkdownElementProps) => ReactNode
  "post-image": (props: MarkdownElementProps) => ReactNode
  "image-list": (props: MarkdownElementProps) => ReactNode
  "callout-block": (props: MarkdownElementProps) => ReactNode
}
~~~

Two details in that block. Your new property name goes in the type after satisfies, because the renderer's own list of known components does not include invented element names. And the whole object is passed with a cast at the point of use, for the same reason. Add your entry to both places or the typecheck will fail.

You will also want your property on the shared props type at the top of the file:

~~~ts
type MarkdownElementProps = {
  children?: ReactNode
  href?: string
  src?: string
  alt?: string
  className?: string
  videoid?: string
  title?: string
  imagekey?: string
  listkey?: string
  tone?: string
}
~~~

### Step 5: decide what a mistake looks like

If your component takes a key that has to exist somewhere else, copy the pattern the image components use. A missing key shows a visible red box while you are developing, and renders nothing at all on the published site:

~~~tsx
if (!image) {
  return process.env.NODE_ENV === "development" ? (
    <div className="my-8 border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
      Image &quot;{imagekey}&quot; is not configured for this post.
    </div>
  ) : null
}
~~~

The reasoning: an author needs to see the mistake immediately, and a reader should never see a broken component. If the mistake is one a validation rule could catch instead, prefer that. See [Content validation rules](/blog-platform-docs/content-validation) for how to add one.

## Components that need post data

The image and image list components need something the Markdown itself does not contain: the post's configured images. They get it by closure. The components object is built inside the Markdown function, which receives images and imageLists as arguments, so a small wrapper can pass them through:

~~~tsx
"image-list": (props: MarkdownElementProps) => (
  <PostImageList {...props} imageLists={imageLists} />
),
~~~

If your component needs post-level configuration, add a field to the Post type in content/types.ts, a validation rule for it, a parameter on Markdown, and a wrapper like the one above. That is the full path from content file to rendered element.

## What not to do

**Do not add raw HTML support.** The renderer does not enable it, and turning it on would let content inject arbitrary markup. A new component is the supported way to add a new shape.

**Do not reach for MDX.** MDX lets a post import and run components directly. It would collapse the boundary the content layer depends on, and content would no longer be plain data. See [The content contract](/blog-platform-docs/content-contract).

**Do not skip the argument check.** Every existing plugin validates its argument before putting it in an attribute. A YouTube ID goes straight into a URL; an unvalidated one is a hole.

**Do not make the component a client component unless it needs to be.** The renderer runs on the server. A callout, a table, an embed frame: all fine as server components. Only reach for "use client" when you need state or an event handler, and then read [How pages are rendered](/blog-platform-docs/rendering-model) first.

## Checklist

1. Write the plugin in markdown-utils.ts, with a strict guard and a validated argument.
2. Use a hyphenated hName and all-lowercase property names.
3. Add the plugin to the remarkPlugins array in markdown.tsx.
4. Add the property to MarkdownElementProps.
5. Add the component to the components object and to the type after satisfies.
6. Decide how a missing or malformed argument behaves, in development and in production.
7. Document the new syntax in [Markdown reference](/blog-platform-docs/markdown-reference), and add a live example to that post so the reference stays executable.
8. Run typecheck, lint, and build.
`

# Markdown reference

## Prose and inline formatting

This paragraph demonstrates **bold text**, _italic text_, ~~strikethrough text~~, `inline code`, an [internal blog link](/browse/posts), and an [external reference](https://example.com).

### Lists and tasks

- First unordered item
- Second unordered item with nested detail:
  - Nested unordered item
  - Another nested item

1. First ordered item
2. Second ordered item
   1. Nested ordered item
   2. Another nested ordered item

- [x] Publish renderer contract
- [ ] Add more field examples

### Quotes, rules, and images

> Good Markdown rendering keeps authoring simple while preserving a polished reading surface.

---

#### Post-owned local image

This image is configured by the post module and uses a local thumbnail plus a larger local lightbox source.

@[image](workspace-overview)

#### Remote URL image

This standard Markdown image is loaded directly from an external HTTPS URL and uses the same lightbox behavior.

![An open book resting on a wooden surface](https://picsum.photos/id/24/2000/743.webp "Remote image from Lorem Picsum")

### Tables

| Component | Status | Notes |
| --- | --- | --- |
| Tables | Supported | Via remark-gfm |
| Task lists | Supported | Disabled checkboxes |
| Autolinks | Supported | https://example.com/docs |

### Code blocks

#### Inline `code` heading

This heading verifies renderer and TOC IDs stay aligned when heading text contains inline code.

```tsx
type Post = {
  title: string
  authorIds: string[]
}

export function PostTitle({ title }: Pick<Post, "title">) {
  return <h1>{title}</h1>
}
```

~~~bash
npm run typecheck
npm run lint
~~~

### YouTube embeds

@[youtube](dQw4w9WgXcQ)

## Accordions

An accordion collapses a block of content behind a summary line. It is the one
container component: everything between its fences is ordinary Markdown,
rendered by the same components as the rest of the post, so lists, code blocks,
images, and embeds all work inside it.

The syntax is a directive rather than a shortcode, because a shortcode is a
single line and an accordion has a body:

~~~text
:::accordion[The summary line readers click]
Any Markdown, including other components.
:::
~~~

Rendered live, with a configured image inside:

:::accordion[A configured image, inside an accordion]
The body holds ordinary Markdown. **Bold**, `inline code`, and links render as
they do anywhere else, and so do the component shortcodes:

@[image](workspace-overview)
:::

Add `{open}` after the label to start it expanded:

~~~text
:::accordion[Starts expanded]{open}
Useful when the collapse is an invitation to skim, not a wall.
:::
~~~

:::accordion[Starts expanded]{open}
Useful when the collapse is an invitation to skim, not a wall.
:::

Three rules to know:

- A title is required. Use the `[label]` form, or `{title="..."}` if you
  prefer an attribute; the label wins when both are present.
- To nest one accordion inside another, the **outer** block takes four colons
  and the inner keeps three.
- Headings written inside an accordion render, but they get no anchor id and
  stay out of the table of contents, because a copied link would point into
  collapsed content. Keep section headings outside.

The open and close behaviour is the browser's own details element: it needs no
JavaScript, works with the keyboard, and find-in-page can reach into a closed
accordion in most browsers.

## Multi-image lists

Multi-image lists present a related collection as one browsable unit. These demos
combine optimized local WebP assets with one remote image. Select any image to
open the shared fullscreen viewer, then use its carousel, zoom, and pan controls
to explore the complete group.

### Quilted image list

Quilted lists create hierarchy with a dense arrangement of varied tile sizes.

#### Image only

@[image-list](quilted:image-only)

#### Title inside

@[image-list](quilted:title-inside)

#### Title below

@[image-list](quilted:title-below)

### Masonry image list

Masonry lists preserve each image's natural aspect ratio in balanced columns.

#### Image only

@[image-list](masonry:image-only)

#### Title inside

@[image-list](masonry:title-inside)

#### Title below

@[image-list](masonry:title-below)

## Links and line breaks

Use [this hash link](#heading-depth) to jump within the post. Internal paths
such as [the browse page](/browse/posts) stay in the app router, while external
links such as [the project reference](https://example.com) open in a new tab.

This line ends with two spaces  
so the next line becomes an explicit hard break.

## GFM extensions

Autolink literals work for www.example.com, https://example.com, and
contact@example.com without writing link syntax.

Footnotes are supported with a reference[^gfm-note].

[^gfm-note]: Footnotes are parsed by remark-gfm and rendered with backlinks.

### Heading depth

#### H4 detail heading

This section verifies fourth-level headings appear in the table of contents.

##### H5 detail heading

This section verifies fifth-level headings render with stable IDs too.

###### H6 fallback heading

H6 headings are parsed by Markdown but are not included in the table of contents
because the blog applies its custom heading treatment to H2 through H5.

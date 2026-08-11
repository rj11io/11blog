export const addingContent = `
# Adding a publication or post

This guide explains how to add a publication or post to the blog's internal content system. For examples of the Markdown syntax and custom renderer behavior, see the [Markdown reference](/blog-platform-docs/markdown-reference) post. New to the platform entirely? [Working with the platform](/blog-platform-docs/working-with-the-platform) maps all the documentation first.

## Content architecture

Content lives in the repository-level content directory, outside the Next.js application:

~~~text
content/
├── authors.ts
├── drafts.ts
├── markdown.d.ts
├── registry.ts
├── routes.ts
├── types.ts
├── validation.ts
└── publications/
    └── publication-id/
        ├── assets/
        │   ├── publication-cover.png
        │   ├── first-post-cover.png
        │   └── SOURCES.md
        ├── index.ts
        └── posts/
            ├── legacy-post.ts
            └── modular-post/
                ├── assets/
                │   ├── image-thumb.webp
                │   ├── image.webp
                │   └── SOURCES.md
                ├── index.ts
                ├── modular-post.md
                └── modular-post.images.ts
~~~

The registry imports every publication, and each publication imports its posts. The application imports the registry through the content boundary and generates the landing, browse, publication, author, and post pages from it.

Posts support two layouts. Existing posts can remain single TypeScript files, while posts that need dedicated Markdown or related resources can use a directory module. Both layouts use the same extensionless import path:

~~~ts
import { firstPost } from "./posts/first-post"
~~~

TypeScript resolves either posts/first-post.ts or posts/first-post/index.ts, depending on which exists. Do not keep both forms for the same slug because the single file takes precedence during module resolution.

## Publication format

Create a publication module at content/publications/publication-id/index.ts. The directory and pubId use lowercase kebab-case.

~~~ts
import type { Publication } from "../../types"
import { firstPost } from "./posts/first-post"

export const publicationName: Publication = {
  relId: 5,
  pubId: "publication-id",
  title: "Publication title",
  description: "A short description for browse cards and page metadata.",
  created: "2026-07-22",
  updated: "2026-07-22",
  isNSFW: false,
  isNew: true,
  isFeatured: false,
  isDraft: false,
  tags: ["Topic", "Practice"],
  synopsis: "A longer description shown on the publication page.",
  editorNotes: "Optional editorial context for this publication.",
  coverImage: "/static/path/to-cover.png",
  posts: [firstPost],
}
~~~

The required publication fields are relId, pubId, title, description, created, isNSFW, isNew, isFeatured, isDraft, tags, and posts. The relId must be a unique positive integer. The pubId must be unique and URL-safe. Dates use YYYY-MM-DD format, and updated cannot be earlier than created. Set isDraft to true while the publication is unfinished; see Drafts below.

Add the publication to the authoredPublications array in content/registry.ts, in the position it should appear when publications are listed in editorial order:

~~~ts
import { publicationName } from "./publications/publication-id"

const authoredPublications: Publication[] = [
  blogPlatformDocs,
  // …the existing publications, in their editorial order…
  publicationName,
]
~~~

## Post format

### Modular post format

The recommended format for a resource-backed post is a directory at content/publications/publication-id/posts/post-slug. Keep the directory, Markdown filename, and slug in lowercase kebab-case.

The directory's index.ts is the post entry point. It owns the metadata and explicitly imports all resources used by that post:

~~~ts
import type { Post } from "../../../../types"

import content from "./first-post.md"
import { firstPostImageLists, firstPostImages } from "./first-post.images"
import postCover from "./assets/first-post-og-cover.png"

export const firstPost = {
  postId: 501,
  slug: "first-post",
  title: "Post title",
  excerpt: "A short summary for browse cards and metadata.",
  created: "2026-07-22",
  updated: "2026-07-22",
  authorIds: ["rj11io"],
  isNSFW: false,
  isNew: true,
  isFeatured: false,
  isDraft: false,
  tags: ["Topic", "Practice"],
  coverImage: postCover.src,
  content,
  images: firstPostImages,
  imageLists: firstPostImageLists,
} satisfies Post
~~~

Both satisfies Post and a plain Post annotation type-check; the Markdown reference post uses the annotation. The .md file contains only the raw Markdown body, including its leading H1. Raw Markdown imports are typed by content/markdown.d.ts and converted to strings by the application's Markdown loader.

The optional first-post.images.ts file contains the post's named single images and multi-image list configurations. Local files are statically imported from the sibling assets directory. The build gives them hashed URLs, while the content contract remains independent of the rendering application.

~~~ts
import type { PostImageLists, PostImages } from "../../../../types"

import localThumbnail from "./assets/image-thumb.webp"
import localImage from "./assets/image.webp"

export const firstPostImages = {
  "local-example": {
    src: localImage.src,
    thumbnailSrc: localThumbnail.src,
    width: localImage.width,
    height: localImage.height,
    alt: "Descriptive alternative text",
    title: "Local image",
    subtitle: "Post-owned WebP",
  },
  "remote-example": {
    src: "https://images.example.com/photo-2000.webp",
    thumbnailSrc: "https://images.example.com/photo-960.webp",
    width: 2000,
    height: 1333,
    alt: "Descriptive alternative text",
    title: "Remote image",
    subtitle: "External HTTPS URL",
  },
} satisfies PostImages

export const firstPostImageLists = {
  highlights: {
    layout: "quilted",
    variant: "title-inside",
    images: [
      firstPostImages["local-example"],
      firstPostImages["remote-example"],
    ],
  },
} satisfies PostImageLists
~~~

Reference configured single images and lists from the post's Markdown using their keys:

~~~md
@[image](local-example)
@[image](remote-example)
@[image-list](highlights)
~~~

The renderer resolves each key only against the current post. A PostImage uses src for the larger lightbox source and thumbnailSrc for its inline or gallery preview. Width and height reserve the correct aspect ratio before the file loads. Local and remote sources then share the same native img rendering, fullscreen lightbox, zoom, and pan behavior. Content images are plain img elements rather than next/image, which would need every remote host allow-listed up front; author photographs, which always come from the public directory, are the one place the site uses next/image. Put the photographer, original page, and licence for a downloaded image in the SOURCES.md beside it — that file is the attribution record.

Remote image sources must use HTTPS. Prefer explicit thumbnail and full-size CDN URLs over loading an original multi-megabyte file. Because native img elements are used, remote hosts do not need a Next.js image allowlist. Keep a SOURCES.md file beside downloaded assets with the photographer, original page, license, and download date.

Standard Markdown can also reference a remote image URL directly:

~~~md
![Remote image description](https://images.example.com/photo.webp "Optional title")
~~~

Direct Markdown URLs are useful for simple external-image behavior. The named image registry is preferred when dimensions, separate thumbnail and lightbox sources, or reuse inside an image list are important.

The list configuration selects the quilted or masonry layout and one of the image-only, title-inside, or title-below variants. A list can mix local and remote entries, and opening any image uses the shared carousel.

If the post has no configured images or multi-image lists, omit images, imageLists, and the .images.ts file.

### Legacy single-file format

Existing posts can continue storing their body at content/publications/publication-id/posts/post-slug.ts, exporting the Markdown body directly as a TypeScript template string, including its leading H1:

~~~ts
export const firstPost = \`
# Post title

The Markdown body.
\`
~~~

Add its metadata and imported content to the publication's posts array:

~~~ts
{
  postId: 501,
  slug: "post-slug",
  title: "Post title",
  excerpt: "A short summary for browse cards and metadata.",
  created: "2026-07-22",
  updated: "2026-07-22",
  authorIds: ["rj11io"],
  isNSFW: false,
  isNew: true,
  isFeatured: false,
  isDraft: false,
  tags: ["Topic", "Practice"],
  content: firstPost,
}
~~~

Legacy and modular posts can coexist in the same publication. A modular post is added directly to posts, while a legacy Markdown export is assigned to the content field of its publication-owned post object.

The required post fields are postId, title, created, authorIds, isNSFW, isNew, isFeatured, isDraft, and tags. The type marks content optional, but the validator rejects a post without a non-empty body, so in practice content is required as well — the build catches it rather than the compiler. Use a slug whenever possible; it becomes the public URL. The postId must be a unique positive integer within the publication. Every author ID must exist in content/authors.ts, and every post must have at least one author.

Two of the required flags are easy to set and forget. isNew puts a New badge on cards and the post page, and nothing ages it out: clear it by hand when the post stops being new. isNSFW puts an Adult badge on the same surfaces and does nothing else — it hides nothing.

## Drafts

Set isDraft to true on a post or a publication that is not ready to be read. The live site leaves it out entirely: it disappears from the home page, the browse indexes, every count, and the previous and next links, and its address returns 404 rather than an empty page.

The filter runs once, in content/registry.ts, immediately after validation. Both levels are filtered, and a draft publication takes its posts with it whatever those posts say for themselves. Nothing else in the site knows drafts exist, which is why nothing else has to be changed to keep one hidden.

Validation runs before the filter, so a draft is checked by the same rules as a published post. That is the point of the flag rather than the older habit of leaving a publication out of the registry: an unfinished post cannot quietly rot, and its postId and slug are still reserved against a collision with something live.

### Reading a draft

Drafts are served on the dev server and left out of a production build, so npm run dev shows your draft and npm run build never does. Anything rendered from a draft carries a Draft badge, on browse cards and on the publication and post pages, so a draft cannot be mistaken for a published post while you read it locally.

A post inside a draft publication carries the badge too, even with its own isDraft set to false. The registry marks it, because it is not published either. That means a draft publication's posts can be left alone: one edit on the publication reveals the whole thing when it is ready.

To share one, set SHOW_DRAFTS=1 on a Vercel preview environment. That publishes drafts at the preview address, which is enough for someone else to read the post without it appearing on the live site. Never set it on the production environment. The flag itself lives in content/drafts.ts.

### Two rules the validator enforces

A draft cannot also be featured. The two contradict each other, and the symptom is confusing rather than obvious: the featured list is built from content the filter has already removed, so a post explicitly promoted to the home page is simply absent from it.

A published publication needs at least one published post. An empty posts array and a posts array made entirely of drafts both fail, because either would render as a page with no posts and a browse card claiming 0 posts. Set isDraft on the publication as well until one of its posts is ready.

### One thing to check by hand

Nothing validates links written in post prose, so drafting a post that another post links to leaves a link to a 404. Search the content directory for the slug before you draft an already-published post, and remove or reword any link you find. Drafting something that was public also deserves a redirect, which [URLs, slugs, and redirects](/blog-platform-docs/urls-and-redirects) covers.

## Post body rules

Start the body with one H1 matching the post title. The standard post page uses the post title for the page header and removes this leading H1 from the rendered body, so it should not be repeated in the article content.

Use H2 through H5 for article sections. These headings receive stable IDs and appear in the table of contents. Duplicate headings receive numbered IDs. H6 is parsed and rendered by Markdown but is not included in the table of contents. A heading inside an accordion renders as a heading but gets no anchor ID and stays out of the table of contents, because a copied link would point into collapsed content.

Leave a blank line between paragraphs, headings, lists, quotes, tables, and code blocks. Raw .md files can use backticks normally. In a legacy TypeScript template string, escape any literal backticks used inside the post body.

## Supported Markdown components

The renderer supports normal Markdown paragraphs, emphasis, strong text, strikethrough, inline code, headings, links, images, blockquotes, unordered and ordered lists, task-list checkboxes, horizontal rules, tables, fenced code blocks, and hard line breaks.

The remark-gfm plugin additionally supports autolink literals, footnotes, strikethrough, tables, and task lists. Use the [Markdown reference](/blog-platform-docs/markdown-reference) post as the executable reference for each of these forms.

The blog also supports a custom YouTube embed. Use a standalone shortcode with an 11-character video ID:

~~~text
@[youtube](dQw4w9WgXcQ)
~~~

YouTube watch, embed, and youtu.be URLs are also recognized when they form a standalone paragraph, so pasting a video link on its own line embeds the player whether or not you meant it to. Put the link inside a sentence, or write it as a Markdown link, to keep it a plain link.

The blog also supports an accordion, a collapsible section whose body is ordinary Markdown:

~~~text
:::accordion[The visible summary line]
Any Markdown, including the other components.
:::
~~~

The [Markdown reference](/blog-platform-docs/markdown-reference) shows both forms and what belongs inside one.

## Links and images

Use root-relative paths for internal links:

~~~md
[Browse the posts](/browse/posts)
[Jump to a section](#section-heading)
~~~

Internal root-relative links stay inside the Next.js router. Hash links use native anchor navigation. Absolute HTTP and HTTPS links are treated as external and open in a new tab.

Standard Markdown images can use files served by the site itself or external HTTPS URLs:

~~~md
![Descriptive alt text](/static/blog-authors/rj-pic.png)
![Remote image](https://images.example.com/photo.webp)
~~~

### Where an image file belongs

There are three places an image can live, and the difference matters.

**A post's own directory**, at posts/post-slug/assets/. For images used inside one post's body. They sit beside the writing that uses them and are deleted along with it. Reference them from that post's .images.ts file, as shown in the modular post format above.

**The publication's directory**, at publications/publication-id/assets/. For images belonging to the publication as a whole, and for the cover images of posts kept in the legacy single-file format, which have no directory of their own. Import them in the publication's index.ts:

~~~ts
import publicationCover from "./assets/publication-cover.png"
import firstPostCover from "./assets/first-post-cover.png"

export const publicationName: Publication = {
  coverImage: publicationCover.src,
  posts: [
    {
      postId: 501,
      slug: "first-post",
      coverImage: firstPostCover.src,
    },
  ],
}
~~~

**The site's public directory**, at v0/www/public/static/. For files belonging to the site rather than to any publication: author photographs and anything else referenced from content/authors.ts, plus the site-wide link-preview fallback under static/og/. These are addressed root-relative, with the public part of the path dropped, and grouped one directory per purpose:

~~~text
v0/www/public/
└── static/
    └── blog-authors/
        └── rj-pic.png     addressed as /static/blog-authors/rj-pic.png
~~~

Name each new directory under static in lowercase kebab-case.

**Prefer the first two.** An imported file gets a hashed name at build time, and a wrong import is a build error rather than a broken image on a published page. A root-relative string is checked far less: the validator confirms an image source is root-relative or HTTPS, but nothing confirms the file exists. Everything in the public directory is also published whether or not anything references it, so unused files accumulate there unnoticed.

Keep a SOURCES.md beside any assets directory recording where the files came from: the photographer and licence for a photograph, or the generator and version for a generated asset.

### Cover images are also link previews

A coverImage does two jobs. It is the cover shown on the site, and it is the Open Graph image used when the address is shared, because a page takes its Open Graph image straight from that field. There is no separate field for one or the other.

Draw a cover at 1200 by 630 if you can. That is the frame most social networks show, and it is the ratio the banner at the top of a page now uses, so a cover at that size is shown whole rather than cropped.

For a branded cover, post or publication alike, use the 11blog-generate-covers skill under v0/skills/. It generates the source in the separate 11brands checkout configured by the gitignored .env.brand-assets.local file, then copies a new versioned image into the right assets directory: the publication's for a single-file post, the post's own for a directory module. When one change needs several covers in the same style, pass every title in one run: that creates one generation folder and one manifest for the intended set instead of one folder per file. Run the 11blog-verify-covers skill afterwards over the same set; it checks that every consumer is byte-identical to its source, is 1200 by 630, wired into a record, and written down in SOURCES.md. Record the shared run stamp in the nearest SOURCES.md files and keep older versioned covers because shared previews cache image URLs.

Other shapes still appear, and a cover has to survive them: the sixteen-by-nine card in a list, and the square thumbnail beside a row or a previous and next link. Both take a slice out of the middle. So keep anything that has to be readable — a title above all — near the centre, and treat the outer edges as decoration you can afford to lose.

A link preview needs an absolute address. The site supplies one through metadataBase in the root layout, set to the production domain. Without it the framework falls back to localhost and every preview points at a machine that is not on the internet.

A cover is optional, and a page without one is still shareable. The root layout declares a site-wide fallback image, kept at v0/www/public/static/og/, and any page that does not set an image of its own inherits it: the landing page, the browse page, author pages, and any publication or post with no cover. So the choice is between a specific preview and a generic one, never between a preview and nothing.

One caution if you ever edit a page's metadata. The fallback works because a page with no cover leaves the Open Graph block out altogether. Setting it to undefined instead is not the same thing: it replaces the inherited value rather than deferring to it, and the page ends up with no preview image at all. Add the block conditionally, and check the tag afterwards by reading the page source.

Always provide useful alt text unless the image is genuinely decorative. Modular posts should prefer post-owned assets and the @[image](image-key) shortcode when an image needs separate thumbnail and lightbox sources.

## Deliberately unsupported formats

Do not add YAML frontmatter, MDX, or raw HTML to posts. The application does not enable frontmatter parsing, MDX, or raw HTML rendering. Do not rely on single newlines becoming visible line breaks; use two trailing spaces or a new paragraph when a hard break is intended.

## Publishing checklists

Adding a post and adding a publication are different jobs. Use the checklist that matches what you are doing. Adding a post never requires editing content/registry.ts; adding a publication always does.

### Adding a post

1. Choose the legacy single-file format or create a modular post directory with index.ts and a raw .md file.
2. Use a postId that is unique within the publication, a URL-safe slug, valid ISO dates, and existing author IDs.
3. Start the post body with its matching H1.
4. Use H2-H5 for navigable sections.
5. Put body images and their source record in the modular post's assets directory. A legacy post's cover goes in the publication's assets directory instead, since a legacy post has no directory of its own.
6. Put named single-image and image-list configurations in the post's .images.ts file when needed.
7. Give configured images dimensions, useful alt text, and separate thumbnail and lightbox sources where practical.
8. Add a coverImage, imported rather than written as a path, and remember it doubles as the post's link preview.
9. Check component syntax against the [Markdown reference](/blog-platform-docs/markdown-reference).
10. Add the post to its publication's posts array, in the position it should read.
11. Set isDraft to true if the post is not ready to be read, and remember that build will then leave it out. Set isFeatured to false while it is a draft; the two together fail validation.
12. Run typecheck, lint, and build, all from v0/www — the root package.json has none of these scripts. The build is the step that runs the content validator and generates the new route, so a passing typecheck on its own proves nothing about the content.

### Adding a publication

1. Create content/publications/publication-id/index.ts, using a lowercase kebab-case directory name and matching pubId.
2. Use an unused positive relId, a pubId that is not authors, browse, or publications, and valid ISO dates.
3. Write the title, description, and tags. Add the optional synopsis and editorNotes if the publication needs them.
4. Add a coverImage, imported from the publication's assets directory, with a SOURCES.md recording where it came from. The 11blog-generate-covers and 11blog-verify-covers skills under v0/skills/ produce and check one.
5. Add at least one post, following the post checklist above. Validation rejects a published publication with no posts.
6. Import the publication in content/registry.ts and add it to the authoredPublications array.
7. Set isDraft to true if the publication is not ready. Do the same if every post in it is still a draft, which validation requires rather than suggests.
8. Run typecheck, lint, and build from v0/www.

For the rules behind each of these steps, and the exact message thrown when one fails, see [Content validation rules](/blog-platform-docs/content-validation).
`

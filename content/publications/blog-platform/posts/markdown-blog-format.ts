export const markdownBlogFormat = `
# Markdown Blog Format

This guide explains how to add a publication or post to the blog's internal content system. For examples of the Markdown syntax and custom renderer behavior, see the [Markdown Components](/blog-platform/markdown-components) post.

## Content architecture

Content lives in the repository-level content directory, outside the Next.js application:

~~~text
content/
├── authors.ts
├── markdown.d.ts
├── registry.ts
├── routes.ts
├── types.ts
├── validation.ts
└── publications/
    └── publication-id/
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

The registry imports every publication, and each publication imports its posts. The application imports the registry through the content boundary and generates the browse, publication, author, and post pages from it.

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
  tags: ["Topic", "Practice"],
  synopsis: "A longer description shown on the publication page.",
  editorNotes: "Optional editorial context for this publication.",
  coverImage: "/static/path/to-cover.png",
  posts: [firstPost],
}
~~~

The required publication fields are relId, pubId, title, description, created, isNSFW, isNew, isFeatured, tags, and posts. The relId must be a unique positive integer. The pubId must be unique and URL-safe. Dates use YYYY-MM-DD format, and updated cannot be earlier than created.

Add the publication to the publications array in content/registry.ts:

~~~ts
import { publicationName } from "./publications/publication-id"

export const publications: Publication[] = [
  signalPath,
  materialCulture,
  localWeather,
  blogPlatform,
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
  tags: ["Topic", "Practice"],
  content,
  images: firstPostImages,
  imageLists: firstPostImageLists,
} satisfies Post
~~~

The .md file contains only the raw Markdown body, including its leading H1. Raw Markdown imports are typed by content/markdown.d.ts and converted to strings by the application's Markdown loader.

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
    credit: {
      label: "Photographer name",
      href: "https://example.com/original-photo",
    },
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

The renderer resolves each key only against the current post. A PostImage uses src for the larger lightbox source and thumbnailSrc for its inline or gallery preview. Width and height reserve the correct aspect ratio before the file loads. Local and remote sources then share the same native img rendering, fullscreen lightbox, zoom, and pan behavior; the blog intentionally does not use next/image.

Remote image sources must use HTTPS. Prefer explicit thumbnail and full-size CDN URLs over loading an original multi-megabyte file. Because native img elements are used, remote hosts do not need a Next.js image allowlist. Keep a SOURCES.md file beside downloaded assets with the photographer, original page, license, and download date.

Standard Markdown can also reference a remote image URL directly:

~~~md
![Remote image description](https://images.example.com/photo.webp "Optional title")
~~~

Direct Markdown URLs are useful for simple external-image behavior. The named image registry is preferred when dimensions, separate thumbnail and lightbox sources, credits, or reuse inside an image list are important.

The list configuration selects the quilted or masonry layout and one of the image-only, title-inside, or title-below variants. A list can mix local and remote entries, and opening any image uses the shared carousel.

If the post has no configured images or multi-image lists, omit images, imageLists, and the .images.ts file.

### Legacy single-file format

Existing posts can continue storing their body at content/publications/publication-id/posts/post-slug.ts:

~~~ts
export const firstPost = markdownBody
~~~

Define markdownBody as a TypeScript template string containing the Markdown body, including its leading H1. Add its metadata and imported content to the publication's posts array:

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
  tags: ["Topic", "Practice"],
  content: firstPost,
}
~~~

Legacy and modular posts can coexist in the same publication. A modular post is added directly to posts, while a legacy Markdown export is assigned to the content field of its publication-owned post object.

The required post fields are postId, title, created, authorIds, isNSFW, isNew, isFeatured, tags, and content. Use a slug whenever possible; it becomes the public URL. The postId must be a unique positive integer within the publication. Every author ID must exist in content/authors.ts, and every post must have at least one author and non-empty content.

## Post body rules

Start the body with one H1 matching the post title. The standard post page uses the post title for the page header and removes this leading H1 from the rendered body, so it should not be repeated in the article content.

Use H2 through H5 for article sections. These headings receive stable IDs and appear in the table of contents. Duplicate headings receive numbered IDs. H6 is parsed and rendered by Markdown but is not included in the table of contents.

Leave a blank line between paragraphs, headings, lists, quotes, tables, and code blocks. Raw .md files can use backticks normally. In a legacy TypeScript template string, escape any literal backticks used inside the post body.

## Supported Markdown components

The renderer supports normal Markdown paragraphs, emphasis, strong text, strikethrough, inline code, headings, links, images, blockquotes, unordered and ordered lists, task-list checkboxes, horizontal rules, tables, fenced code blocks, and hard line breaks.

The remark-gfm plugin additionally supports autolink literals, footnotes, strikethrough, tables, and task lists. Use the [Markdown Components](/blog-platform/markdown-components) post as the executable reference for each of these forms.

The blog also supports a custom YouTube embed. Use a standalone shortcode with an 11-character video ID:

~~~text
@[youtube](dQw4w9WgXcQ)
~~~

YouTube watch, embed, and youtu.be URLs are also recognized when they form a standalone paragraph.

## Links and images

Use root-relative paths for internal links:

~~~md
[Browse the posts](/browse?content=posts)
[Jump to a section](#section-heading)
~~~

Internal root-relative links stay inside the Next.js router. Hash links use native anchor navigation. Absolute HTTP and HTTPS links are treated as external and open in a new tab.

Standard Markdown images can use files in public or external HTTPS URLs:

~~~md
![Descriptive alt text](/static/blog-authors/rj-pic.png)
![Remote image](https://images.example.com/photo.webp)
~~~

Modular posts should prefer post-owned assets and the @[image](image-key) shortcode when an image needs optimized thumbnail and lightbox sources. Always provide useful alt text unless the image is genuinely decorative.

## Deliberately unsupported formats

Do not add YAML frontmatter, MDX, or raw HTML to posts. The application does not enable frontmatter parsing, MDX, or raw HTML rendering. Do not rely on single newlines becoming visible line breaks; use two trailing spaces or a new paragraph when a hard break is intended.

## Publishing checklist

1. Choose the legacy single-file format or create a modular post directory with index.ts and a raw .md file.
2. Use unique positive IDs, URL-safe slugs, valid ISO dates, and existing author IDs.
3. Start each post body with its matching H1.
4. Use H2-H5 for navigable sections.
5. Put post-owned files and their source record in the modular post's assets directory.
6. Put named single-image and image-list configurations in the post's .images.ts file when needed.
7. Give configured images dimensions, useful alt text, and separate thumbnail and lightbox sources where practical.
8. Check component syntax against the [Markdown Components](/blog-platform/markdown-components) reference.
9. Add the new publication to content/registry.ts.
10. Run typecheck, lint, and build so the content validator and static route generation can verify the new entry.
`

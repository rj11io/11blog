export const markdownBlogFormat = `
# Markdown Blog Format

This guide explains how to add a publication or post to the blog's internal content system. For examples of the Markdown syntax and custom renderer behavior, see the [Markdown Components](/publications/blog-tech/markdown-components) post.

## Content architecture

Content lives in the repository-level content directory, outside the Next.js application:

~~~text
content/
├── authors.ts
├── registry.ts
├── routes.ts
├── types.ts
├── validation.ts
└── publications/
    └── publication-id/
        ├── index.ts
        └── posts/
            └── post-slug.ts
~~~

The registry imports every publication. A publication imports its post content. The application imports the registry through the content boundary and generates the browse, publication, author, and post pages from it.

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
  blogTech,
  publicationName,
]
~~~

## Post format

Create the post body at content/publications/publication-id/posts/post-slug.ts. Keep the filename and slug in lowercase kebab-case.

~~~ts
export const firstPost = markdownBody
~~~

Define markdownBody as a TypeScript template string containing the Markdown body, including its leading H1.

Add the post object to the publication's posts array:

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

The required post fields are postId, title, created, authorIds, isNSFW, isNew, isFeatured, tags, and content. Use a slug whenever possible; it becomes the public URL. The postId must be a unique positive integer within the publication. Every author ID must exist in content/authors.ts, and every post must have at least one author and non-empty content.

## Post body rules

Start the body with one H1 matching the post title. The standard post page uses the post title for the page header and removes this leading H1 from the rendered body, so it should not be repeated in the article content.

Use H2 through H5 for article sections. These headings receive stable IDs and appear in the table of contents. Duplicate headings receive numbered IDs. H6 is parsed and rendered by Markdown but is not included in the table of contents.

Leave a blank line between paragraphs, headings, lists, quotes, tables, and code blocks. The content is stored as a TypeScript template string, so escape any literal backticks if you use them inside the post body.

## Supported Markdown components

The renderer supports normal Markdown paragraphs, emphasis, strong text, strikethrough, inline code, headings, links, images, blockquotes, unordered and ordered lists, task-list checkboxes, horizontal rules, tables, fenced code blocks, and hard line breaks.

The remark-gfm plugin additionally supports autolink literals, footnotes, strikethrough, tables, and task lists. Use the [Markdown Components](/publications/blog-tech/markdown-components) post as the executable reference for each of these forms.

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

Images can use files in public:

~~~md
![Descriptive alt text](/static/blog-authors/rj-pic.png)
~~~

Always provide useful alt text unless the image is genuinely decorative.

## Deliberately unsupported formats

Do not add YAML frontmatter, MDX, or raw HTML to posts. The application does not enable frontmatter parsing, MDX, or raw HTML rendering. Do not rely on single newlines becoming visible line breaks; use two trailing spaces or a new paragraph when a hard break is intended.

## Publishing checklist

1. Create the publication or post module in the repository-level content directory.
2. Use unique positive IDs, URL-safe slugs, valid ISO dates, and existing author IDs.
3. Start each post body with its matching H1.
4. Use H2-H5 for navigable sections.
5. Check component syntax against the [Markdown Components](/publications/blog-tech/markdown-components) reference.
6. Add the new publication to content/registry.ts.
7. Run typecheck, lint, and build so the content validator and static route generation can verify the new entry.
`

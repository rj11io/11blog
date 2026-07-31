# Blog Platform OG and cover set

Version 1 contains one publication image and one image for each of the twelve
posts registered in content/publications/blog-platform-docs/index.ts at the
time. Two covers added later are listed below as well: the entry point from
og-covers-v2.py, and the support post from og-covers-v3.py.

Every asset is 1200 × 630. The central title area is safe when the same image
is center-cropped to 16:9, so one file can serve as both its Open Graph image
and its website cover. The mark and title also survive the publication's wider
banner crop; the bottom keyword line may be omitted by that crop.

The visual system follows the approved line-free OG direction:

- `#0A0A0A` background
- centered extra-large-dot `11` mark
- `#2BC88F` square title signal
- white mono title
- muted `AI / SOFTWARE / PRODUCT / ENGINEERING / TECHNOLOGY` footer
- no borders, grid lines, gradients, rounded corners, or placeholder imagery

## Publication

- `publication-blog-platform-og-cover-v1.png` — Blog Platform Docs

## Posts

- `posts/413-start-here-og-cover-v1.png` — A tour of the platform (og-covers-v2.py)
- `posts/401-markdown-reference-og-cover-v1.png` — Markdown reference
- `posts/402-adding-content-og-cover-v1.png` — Adding a publication or post
- `posts/403-content-validation-og-cover-v1.png` — Content validation rules
- `posts/411-search-and-discovery-og-cover-v1.png` — Search, tags, and discovery
- `posts/412-authors-and-bylines-og-cover-v1.png` — Authors and bylines
- `posts/404-content-contract-og-cover-v1.png` — The content contract
- `posts/405-rendering-model-og-cover-v1.png` — How pages are rendered
- `posts/406-extending-the-renderer-og-cover-v1.png` — Extending the renderer
- `posts/407-design-tokens-og-cover-v1.png` — Design tokens and theming
- `posts/408-accessibility-contract-og-cover-v1.png` — Accessibility contract
- `posts/409-urls-and-redirects-og-cover-v1.png` — URLs, slugs, and redirects
- `posts/410-running-the-blog-og-cover-v1.png` — Running and releasing the blog
- `posts/414-supporting-the-platform-og-cover-v1.png` — Supporting the platform
  (og-covers-v3.py)

## Process files

- `contact-sheet-v1.png` previews the v1 set. It has not been regenerated for
  the two covers added since, so it is missing the entry point and the support
  post.
- `../../generators/blog-platform-og-covers-v1.py` regenerates this exact
  version. Create a new versioned generator and output names for future
  explorations; do not overwrite this set.

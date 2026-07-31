# Blog Platform cover and Open Graph images

Generated brand assets, not photographs. Copied into the content directory on
2026-07-31 from the versioned set of record at
`v0/branding/images/blog-platform/`, which also holds the contact sheet and the
generator that produced them:

- Source set: `v0/branding/images/blog-platform/`
- Generator: `v0/branding/generators/blog-platform-og-covers-v1.py`
- Version: v1

Each file is 1200 × 630 and serves two jobs at once. It is the post's cover on
the site, and it is the Open Graph image used in link previews, because
`generateMetadata` takes the Open Graph image from `coverImage`. The title sits
in a central safe area so the same file survives being cropped to 16:9 for a
card and to the publication's wider banner. The keyword line along the bottom
may be cropped away by the banner; nothing important lives there.

The numeric post ID prefix used in the source set is dropped here. Post IDs are
still provisional and may be renumbered, and these filenames should not have to
change when that happens. The `-v1` suffix is kept so a file in use can be
traced back to the generator that made it.

## Files

| File | Used by |
| --- | --- |
| `blog-platform-og-cover-v1.png` | The Blog Platform publication |
| `adding-content-og-cover-v1.png` | Adding a publication or post |
| `content-validation-og-cover-v1.png` | Content validation rules |
| `search-and-discovery-og-cover-v1.png` | Search, tags, and discovery |
| `authors-and-bylines-og-cover-v1.png` | Authors and bylines |
| `content-contract-og-cover-v1.png` | The content contract |
| `rendering-model-og-cover-v1.png` | How pages are rendered |
| `extending-the-renderer-og-cover-v1.png` | Extending the renderer |
| `design-tokens-og-cover-v1.png` | Design tokens and theming |
| `accessibility-contract-og-cover-v1.png` | Accessibility contract |
| `urls-and-redirects-og-cover-v1.png` | URLs, slugs, and redirects |
| `running-the-blog-og-cover-v1.png` | Running and releasing the blog |

The Markdown reference post keeps its cover in its own directory, at
`posts/markdown-reference/assets/markdown-reference-og-cover-v1.png`, because a
directory-module post owns its assets.

## Replacing these

Every file is brought in with a static import, so renaming or removing one
breaks the build rather than producing a missing image. Add the new version
alongside, update the import, then delete the old file. Do not overwrite a
versioned file in place.

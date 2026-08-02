# Build an online presence cover and Open Graph images

Generated brand assets, not photographs. Copied into the content directory on
2026-07-31 from the versioned set of record at
`v0/branding/images/online-presence/`.

- Source set: `v0/branding/images/online-presence/`
- Generator: `v0/branding/generators/og-covers-v2.py`
- Version: v1

Each file is 1200 × 630 and does two jobs. It is the cover shown on the site,
and it is the Open Graph image used in link previews, because a page takes its
Open Graph image from `coverImage`.

The banner at the top of a page uses this same 40:21 ratio, so a file is shown
there whole. The 16:9 card crop and the square thumbnail crop both take a slice
out of the middle, which is why the title sits in a central safe area.

The numeric post ID prefix used in the source set is dropped here, so these
filenames do not have to change if posts are renumbered. The `-v1` suffix is
kept so a file in use can be traced back to the generator that made it.

## Files

| File | Used by |
| --- | --- |
| `online-presence-og-cover-v1.png` | The Build an online presence publication |
| `own-your-platform-og-cover-v1.png` | Own your platform |
| `three-ways-to-build-a-blog-og-cover-v1.png` | Three ways to build your own blog |

## Replacing these

Every file is brought in with a static import, so renaming or removing one
breaks the build rather than producing a missing image. Add the new version
alongside, update the import, then delete the old file. Do not overwrite a
versioned file in place.

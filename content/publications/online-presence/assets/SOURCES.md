# Build an online presence cover and Open Graph images

Generated brand assets, not photographs. Copied into the content directory on
2026-08-02 from the versioned set of record at
`v0/branding/images/online-presence/`.

- Source set: `v0/branding/images/online-presence/`
- Generator: `v0/branding/generators/og-covers-v5.py`
- Version: v2

All three cards were redrawn on 2026-08-02, alongside the Blog Platform Docs
set, so the two publications stay visually identical. Two things changed: the
title now has a green square on each side rather than only on the left, and the
domain `blog.rj11.io` sits above the mark as a masthead. The v1 files these
replaced came from `og-covers-v2.py`, and the Build your own blog one from
`og-covers-v4.py`; both are still in the source set, and no longer used here.

Each file is 1200 × 630 and does two jobs. It is the cover shown on the site,
and it is the Open Graph image used in link previews, because a page takes its
Open Graph image from `coverImage`.

The banner at the top of a page uses this same 40:21 ratio, so a file is shown
there whole. The 16:9 card crop and the square thumbnail crop both take a slice
out of the middle, which is why the title sits in a central safe area.

The numeric post ID prefix used in the source set is dropped here, so these
filenames do not have to change if posts are renumbered. The version suffix is
kept so a file in use can be traced back to the generator that made it: `-v2`
means `og-covers-v5.py`.

## Files

| File | Used by |
| --- | --- |
| `online-presence-og-cover-v2.png` | The Build an online presence publication |
| `own-your-platform-og-cover-v2.png` | Own your platform |
| `build-your-own-blog-og-cover-v2.png` | Build your own blog |

## Replacing these

Every file is brought in with a static import, so renaming or removing one
breaks the build rather than producing a missing image. Add the new version
alongside, update the import, then delete the old file. Do not overwrite a
versioned file in place.

## Renaming a post

The title is drawn into the picture, so a renamed post needs a new file or its
cover keeps announcing the old title in every link preview. Generate it, copy it
in under the new name, update the import, and delete the file the old title was
drawn into.

`build-your-own-blog-og-cover-v1.png` replaced
`three-ways-to-build-a-blog-og-cover-v1.png` on 2026-08-02 for exactly this
reason. Both are gone now, superseded the same day by the v2 redraw below.

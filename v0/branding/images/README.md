# 11blog generated image set

Raster assets generated from the approved 11blog brand references. The source
direction is limited to the approved palette, sharp-edged visual language,
11blog/rj11io identity, and the stated AI, product engineering, and technology
focus. Existing placeholder imagery and editorial voice were not used.

## Assets

| Asset | Dimensions | Intended use |
|---|---:|---|
| `logos/11blog-logo-primary.png` | 2172 × 724 | Primary horizontal dark-mode lockup |
| `logos/11blog-mark.png` | 1254 × 1254 | Avatar, favicon source, and compact placements |
| `logos/11blog-mark-large-dot.png` | 1254 × 1254 | Enlarged-signal compact mark exploration |
| `favicons/11blog-favicon-512.png` | 512 × 512 | Tightly cropped favicon master |
| `favicons/11blog-favicon-32.png` | 32 × 32 | Small-size favicon preview |
| `favicons/11blog-favicon-16.png` | 16 × 16 | Minimum-size favicon preview |
| `favicons/11blog-favicon.ico` | 16–256 px | Multi-resolution browser favicon |
| `logos/11blog-mark-xl-dot-centered.png` | 1254 × 1254 | Centered mark with extra-large signal square |
| `favicons/11blog-favicon-v2-512.png` | 512 × 512 | Centered extra-large-dot favicon master |
| `favicons/11blog-favicon-v2-32.png` | 32 × 32 | Centered v2 small-size preview |
| `favicons/11blog-favicon-v2-16.png` | 16 × 16 | Centered v2 minimum-size preview |
| `favicons/11blog-favicon-v2.ico` | 16–256 px | Centered v2 multi-resolution favicon |
| `favicons/www-rj11io-v1/` | 16–512 px | Complete warm-black and orange favicon package for `www.rj11.io` |
| `favicons/ai-rj11io-v1/` | 16–512 px | Complete inverted green favicon package for `ai.rj11.io` |
| `og/11blog-default-og.png` | 1200 × 630 | Default site Open Graph image |
| `og/11blog-favicon-style-og.png` | 1200 × 630 | Default OG direction based on the centered extra-large-dot favicon |
| `og/11blog-favicon-style-og-v2.png` | 1200 × 630 | URL-led favicon-style OG without the repeated `11blog` label |
| `og/11blog-favicon-style-og-v3.png` | 1200 × 630 | URL-led OG with the complete editorial keyword line |
| `og/11blog-favicon-style-og-v4.png` | 1200 × 630 | Minimal v3 variant without borders or background grid lines |
| `og/11blog-favicon-style-og-v5.png` | 1200 × 630 | **Live default OG.** v4 with a signal square each side of the domain |
| `og/rj11io-favicon-style-orange-og-v1.png` | 1200 × 630 | Main-site exploration for `www.rj11.io` with an orange signal hue |
| `og/rj11io-favicon-style-orange-og-v2.png` | 1200 × 630 | Optically aligned orange main-site OG with the keyword footer restored |
| `og/rj11io-favicon-style-orange-og-v3.png` | 1200 × 630 | v2 with a signal square each side of the domain |
| `og/ai-rj11io-favicon-style-monochrome-og-v1.png` | 1200 × 630 | Monochrome AI sub-brand OG using an outlined signal square |
| `og/ai-rj11io-favicon-style-inverted-green-og-v2.png` | 1200 × 630 | Inverted AI OG with a light field, dark mark, and green signal |
| `og/ai-rj11io-favicon-style-inverted-green-og-v3.png` | 1200 × 630 | v2 with a signal square each side of the domain |
| `og/blog-platform-og.png` | 1200 × 630 | Blog Platform publication Open Graph image |
| `blog-platform/` | 1200 × 630 each | Shared OG/cover system for the publication and all twelve registered posts |
| `covers/blog-platform-publication-cover.png` | 1600 × 900 | Blog Platform publication cover |
| `covers/markdown-components-cover.png` | 1600 × 900 | Markdown components post cover |
| `covers/markdown-blog-format-cover.png` | 1600 × 900 | Markdown Blog Format post cover |

## Shared art direction

- Solid `#0A0A0A` ground with `#FAFAFA` structure.
- `#2BC88F` appears as a restrained signal square. Since 2026-08-02 a title or
  domain carries one on each side rather than only on the left, so the row is
  framed rather than bulleted, and it centres against the mark and the footer.
  Anything still showing a single square predates that and is superseded.
- Secondary planes use `#27272A`, `#262626`, and `#121C17`; hairlines use
  `#A1A1A1` sparingly.
- Sharp rectilinear geometry, square corners, fine rules, modular grids, and
  generous negative space.
- No gradients, rounded UI, generic AI symbols, neon cyberpunk styling, or
  literal product screenshots.
- Cover images contain no embedded text so titles remain accessible and
  responsive in the interface.

## Versioning

Image explorations are non-destructive. Keep every accepted or reviewed
iteration and create new siblings with sequential suffixes such as `-v2` and
`-v3`; do not overwrite an earlier image.

That rule has a second reason where Open Graph images are concerned. A social
network caches the image against the address it first saw, so an old file that
nothing links to is still serving previews of everything already shared. This
is why `v0/www/public/static/og/` keeps `11blog-default-og-v4.png` beside the
v5 the site now points at.

The three favicon-style OG images were given their second square by
`../generators/favicon-style-og-symmetric-v1.py`, which edits the existing PNG
rather than redrawing it. There is no generator for these three — they were
drawn by hand, so the pixels are the only record of the font and spacing, and
moving the row is the only way to change it without guessing.

Each versioned favicon package contains `favicon.ico`, 16px and 32px PNGs, a
180px Apple touch icon, and 192px and 512px application icons.

## Prompt set

The assets were generated as a coordinated family with these core concepts:

1. **Primary logo:** a double-one symbol replaces the first two characters in
   `11blog`; only `blog` follows it, with one green square signal.
2. **Compact mark:** a bold geometric `11` with one green square, designed to
   remain legible at small sizes.
3. **Favicon exploration:** the original mark is preserved while the green
   square is enlarged and the canvas is cropped more tightly for recognition
   at 16 and 32 pixels. The v2 direction enlarges it further and centers the
   complete `11` plus square silhouette as a single unit.
4. **Default OG:** a modular editorial technology grid with the exact strings
   `11blog` and `by rj11io`.
5. **Favicon-style OG:** a centered poster-like composition led by the
   extra-large-dot `11` mark, with restrained grid lines and the approved
   editorial focus. Its v2 removes the repeated brand name and promotes
   `blog.rj11.io` to the primary centered label. Its v3 adds the complete
   `AI / SOFTWARE / PRODUCT / ENGINEERING / TECHNOLOGY` metadata line. Its v4
   removes all background rules for a quieter, fully minimal composition.
6. **rj11.io orange exploration:** reuses the centered `11` silhouette for the
   main site, changing the signal color to orange `#F97316`, warming the black
   field slightly, and removing blog-specific metadata. Its v2 optically
   centers the URL row and restores the five-keyword footer.
7. **ai.rj11.io monochrome exploration:** replaces the family’s solid accent
   square with a thick white outline, retaining the URL-led composition and
   five-keyword footer without assigning the AI sub-brand an arbitrary color.
   Its v2 returns to the original green signal while inverting the field and
   mark to light and dark respectively.
8. **Blog Platform OG:** an abstract publishing-system layout with the exact
   strings `Blog Platform` and `11blog`.
9. **Publication cover:** interlocking page frames, content rails, margins, and
   columns organized around a double-one rhythm.
10. **Markdown components cover:** a strict kit of abstract heading, paragraph,
   code, table, media, and callout modules without rendered copy.
11. **Markdown Blog Format cover:** a left-to-right transformation from plain
   line units, through a double-one parsing gate, into a structured page.

The original image set was created with the built-in image generation model.
The favicon exploration is a deterministic raster refinement of that mark so
the numeral geometry remains unchanged. OG and cover outputs were normalized
to their final production dimensions without changing their compositions.

---
name: 11blog-verify-publication-covers
description: Verify 11blog publication cover and Open Graph images against their source generations in the separate 11brands repository. Use after generating, importing, refreshing, or rebranding covers, or when checking dimensions, byte identity, palette integrity, source records, and static imports across both repositories.
---

# Verify 11blog publication covers

Treat the 11brands generation as the source artifact and the 11blog copy as its
consumer. Verify measurements first, then inspect the rendered image.

## Configuration

Read ELEVENBRANDS_DIR from repository-root .env.brand-assets.local. Never
hardcode or commit that local path.

Before verification, read the configured checkout's
v0/skills/11brands-verify-assets/SKILL.md completely.

## Verify

Use the exact source file recorded in the publication's SOURCES.md:

~~~bash
python3 v0/skills/11blog-verify-publication-covers/scripts/verify_publication_cover.py \
  --source "v0/brands/blog-rj11io/content-og/gen-.../tech-tutorials-content-og.png" \
  --target "content/publications/tech-tutorials/assets/tech-tutorials-og-cover-v1.png"
~~~

The script loads the external path from the env file and, when needed, re-runs
itself with 11brands' Pillow-enabled virtual environment.

The script must report:

- identical bytes between source and consumer;
- 1200 by 630 pixels;
- zero colours outside the source manifest's ground/ink/signal triangle.

Any failure blocks handoff. Do not replace measurement with visual judgment.

Then:

1. inspect the image at original detail;
2. confirm title, style, signal squares, and blog.rj11.io masthead;
3. confirm the publication index statically imports that exact target;
4. confirm SOURCES.md names the exact generation and brand;
5. run the 11blog production build.

---
name: 11blog-verify-post-covers
description: Verify an individual 11blog post cover against its exact 11brands source generation. Use after generating, importing, renaming, refreshing, or rebranding a post cover to check byte identity, 1200-by-630 dimensions, palette integrity, provenance, visual output, and static imports for both single-file and directory-module posts.
---

# Verify 11blog post covers

Treat the 11brands generation as source and the 11blog post asset as consumer.
Measure first, then inspect the rendered image.

## Configuration

Read ELEVENBRANDS_DIR from repository-root .env.brand-assets.local. Never
hardcode or commit that path. Before verification, read the configured
checkout's v0/skills/11brands-verify-assets/SKILL.md completely.

## Verify

Use the exact source recorded in the nearest SOURCES.md. Run from the 11blog
repository root:

~~~bash
python3 v0/skills/11blog-verify-post-covers/scripts/verify_post_cover.py \
  --publication tech-tutorials \
  --post dependency-injection \
  --version v2 \
  --source "v0/brands/blog-rj11io/content-og/gen-.../dependency-injection-without-magic-content-og.png"
~~~

The script rejects a missing or ambiguous post and automatically resolves its
consumer path:

- posts/<slug>.ts uses the publication's assets directory;
- posts/<slug>/index.ts uses that post's assets directory.

Use --filename only when the consumer uses a nonstandard established stem. The
delegated checker must report identical bytes, 1200x630, and zero colours
outside the source manifest's ground/ink/signal triangle. Any failure blocks
handoff.

Then:

1. Inspect the target at original detail; confirm title, requested style,
   signal squares, and blog.rj11.io masthead.
2. Confirm the post record statically imports that exact target.
3. Confirm the nearest SOURCES.md records the exact source generation and brand.
4. Run the production build from v0/www.

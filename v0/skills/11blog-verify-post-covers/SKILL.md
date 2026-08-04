---
name: 11blog-verify-post-covers
description: Verify one or a cohesive batch of 11blog post covers against an exact bundled 11brands source generation. Use after generating, importing, renaming, refreshing, or rebranding post covers to check byte identity, dimensions, palette integrity, shared provenance, visual output, and static imports for single-file and directory-module posts.
---

# Verify 11blog post covers

Treat 11brands as source and 11blog as consumer. Measure first, then inspect.

## Configure

Read ELEVENBRANDS_DIR from repository-root .env.brand-assets.local. Never
hardcode or commit it. Read the configured checkout's
v0/skills/11brands-verify-assets/SKILL.md completely.

## Verify one or a bundle

Use single mode for one post:

~~~bash
python3 v0/skills/11blog-verify-post-covers/scripts/verify_post_cover.py \
  --publication tech-tutorials \
  --post dependency-injection \
  --version v2 \
  --source "v0/brands/blog-rj11io/content-og/gen-.../dependency-injection-without-magic-content-og.png"
~~~

For multiple covers created together, create one temporary JSON file and invoke
--batch-file once:

~~~json
[
  {
    "publication": "blog-platform-docs",
    "post": "adding-content",
    "version": "v3",
    "source": "v0/brands/blog-rj11io-11ai/content-og/gen-20260804-blog-platform-docs-v3/adding-a-publication-or-post-content-og.png"
  },
  {
    "publication": "blog-platform-docs",
    "post": "markdown-reference",
    "version": "v3",
    "source": "v0/brands/blog-rj11io-11ai/content-og/gen-20260804-blog-platform-docs-v3/markdown-reference-content-og.png"
  }
]
~~~

~~~bash
python3 v0/skills/11blog-verify-post-covers/scripts/verify_post_cover.py \
  --batch-file /tmp/11blog-post-cover-checks.json
~~~

Batch items accept publication, post, version, source, and optional filename.
The script resolves each consumer from its post layout and rejects sources from
different gen- folders. Every item must report identical bytes, 1200x630, and
zero colours outside the source manifest's palette triangle.

Any failure blocks handoff. Then inspect every image at original detail, confirm
titles and requested style, confirm imports and exact SOURCES.md provenance, and
run the production build.

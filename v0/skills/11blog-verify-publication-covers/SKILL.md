---
name: 11blog-verify-publication-covers
description: Verify one or a cohesive batch of 11blog publication covers against exact 11brands source generations. Use after generating, importing, refreshing, or rebranding covers to check dimensions, byte identity, palette integrity, bundled provenance, source records, and static imports across both repositories.
---

# Verify 11blog publication covers

Treat the 11brands generation as source and 11blog copies as consumers. Measure
first, then inspect rendered images.

## Configure

Read ELEVENBRANDS_DIR from repository-root .env.brand-assets.local. Never
hardcode or commit it. Read the configured checkout's
v0/skills/11brands-verify-assets/SKILL.md completely.

## Verify one or a bundle

Use single mode for one cover:

~~~bash
python3 v0/skills/11blog-verify-publication-covers/scripts/verify_publication_cover.py \
  --source "v0/brands/blog-rj11io/content-og/gen-.../tech-tutorials-content-og.png" \
  --target "content/publications/tech-tutorials/assets/tech-tutorials-og-cover-v1.png"
~~~

For a bundled generation, create one JSON file whose items contain source and
target, then run --batch-file once. Every source in a multi-item batch must come
from the same gen- folder; the script rejects mixed provenance.

~~~json
[
  {
    "source": "v0/brands/blog-rj11io/content-og/gen-20260804-new-publications/tech-tutorials-content-og.png",
    "target": "content/publications/tech-tutorials/assets/tech-tutorials-og-cover-v1.png"
  },
  {
    "source": "v0/brands/blog-rj11io/content-og/gen-20260804-new-publications/project-postmortems-content-og.png",
    "target": "content/publications/project-postmortems/assets/project-postmortems-og-cover-v1.png"
  }
]
~~~

~~~bash
python3 v0/skills/11blog-verify-publication-covers/scripts/verify_publication_cover.py \
  --batch-file /tmp/11blog-publication-cover-checks.json
~~~

Every item must report identical bytes, 1200x630, and zero colours outside the
source manifest's ground/ink/signal triangle. Any failure blocks handoff.

Then inspect every image at original detail, confirm requested style and title,
confirm static imports and exact SOURCES.md provenance, and run the production
build.

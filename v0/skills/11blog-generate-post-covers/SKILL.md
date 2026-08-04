---
name: 11blog-generate-post-covers
description: Generate and import one or a cohesive batch of versioned cover and Open Graph images for 11blog posts through the separate 11brands repository. Use when adding, renaming, refreshing, restyling, or rebranding post covers, including single-file and directory-module posts, while keeping related outputs in one source generation.
---

# Generate 11blog post covers

Generate in the configured 11brands checkout, then copy exact outputs into each
post's established asset location. Never draw or overwrite a cover in 11blog.

## Configure

Read ELEVENBRANDS_DIR from repository-root .env.brand-assets.local. Stop if a
dependency is missing. Never commit the env file or hardcode its value.

Before generating, read these configured-checkout files completely:

- v0/skills/11brands-generate-assets/SKILL.md
- the selected v0/brands/<brand>/brand.md

Use 11blog/blog-rj11io by default. Use 11ai/blog-rj11io-11ai only when the
request explicitly selects the light AI style.

## Bundle related posts

Treat one user request in one style as one intended generation. If it contains
multiple post covers, batch them; never invoke single mode in a loop. Split only
for a different style or a genuinely later, independent request.

Single mode remains for one post:

~~~bash
python3 v0/skills/11blog-generate-post-covers/scripts/generate_post_cover.py \
  --publication tech-tutorials \
  --post dependency-injection \
  --title "Dependency injection without magic" \
  --style 11blog \
  --version v2
~~~

For multiple posts, create a temporary JSON file:

~~~json
[
  {
    "publication": "blog-platform-docs",
    "post": "adding-content",
    "title": "Adding a publication or post",
    "version": "v3"
  },
  {
    "publication": "blog-platform-docs",
    "post": "markdown-reference",
    "title": "Markdown reference",
    "version": "v3"
  }
]
~~~

Run once:

~~~bash
python3 v0/skills/11blog-generate-post-covers/scripts/generate_post_cover.py \
  --batch-file /tmp/11blog-post-covers.json \
  --style 11ai \
  --stamp 20260804-blog-platform-docs-v3
~~~

Batch items accept publication, post, title, version, and optional filename.
The script rejects missing or ambiguous posts, automatically routes a
posts/<slug>.ts cover to publication assets and a posts/<slug>/index.ts cover to
post-owned assets, then delegates the whole set as one 11brands generation.

## Finish

1. Inspect every image at original detail.
2. Record brand, date, shared generation, source files, consumer files, and
   dimensions in the nearest SOURCES.md files.
3. Statically import each new version where its post record is defined.
4. Keep old versioned covers for provenance and cached social previews.
5. Invoke 11blog-verify-post-covers with one batch for the shared generation.
6. Run typecheck, lint, and build from v0/www.

Never overwrite a versioned file. Social previews cache image URLs.

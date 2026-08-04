---
name: 11blog-generate-post-covers
description: Generate and import a versioned cover and Open Graph image for an individual 11blog post through the separate 11brands repository. Use when adding, renaming, refreshing, restyling, or rebranding a post cover, including single-file posts and directory-module posts with their own asset folders.
---

# Generate 11blog post covers

Generate in the configured 11brands checkout, then copy its exact output into
the post's established asset location. Never draw or overwrite a post cover in
11blog directly.

## Configuration and brands

Read ELEVENBRANDS_DIR from repository-root .env.brand-assets.local. Stop if the
configuration, checkout, generator, brand definition, or virtual environment is
missing. Never commit the env file or hardcode its value.

Before generating, read these files from the configured checkout completely:

- v0/skills/11brands-generate-assets/SKILL.md
- the selected v0/brands/<brand>/brand.md

Styles:

- 11blog: brand key blog-rj11io; default dark blog palette.
- 11ai: brand key blog-rj11io-11ai; light AI palette with blog.rj11.io masthead.

Use 11blog unless the request explicitly selects 11ai.

## Generate and import

Check git status in both repositories. Preserve unrelated changes. Run from the
11blog repository root:

~~~bash
python3 v0/skills/11blog-generate-post-covers/scripts/generate_post_cover.py \
  --publication tech-tutorials \
  --post dependency-injection \
  --title "Dependency injection without magic" \
  --style 11blog \
  --version v2
~~~

The script rejects a missing or ambiguous post. It detects the content shape:

- posts/<slug>.ts copies to the publication's assets directory;
- posts/<slug>/index.ts copies to that post's assets directory.

It creates a new timestamped content-og generation in 11brands and refuses to
reuse a source folder or overwrite a consumer asset. Use --filename only to
retain an established filename stem. Use --stamp when deterministic provenance
is useful.

## Finish the change

1. Inspect the generated image at original detail.
2. Record brand, date, exact source generation, source file, consumer file, and
   dimensions in the nearest SOURCES.md.
3. Statically import the new version where the post record is defined.
4. Keep old versioned covers for provenance and cached social previews.
5. Invoke the 11blog-verify-post-covers skill with the exact recorded source.
6. Run typecheck, lint, and build from v0/www.

A visual change always gets a new filename because social previews cache image
URLs.

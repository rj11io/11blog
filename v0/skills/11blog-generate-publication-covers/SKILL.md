---
name: 11blog-generate-publication-covers
description: Generate and import versioned 11blog publication cover and Open Graph images through the separate 11brands repository. Use when adding, refreshing, restyling, or rebranding a publication cover while preserving the source generation, manifest, consumer import, and asset history across both repositories.
---

# Generate 11blog publication covers

Use the generator in the configured 11brands checkout first, then copy its exact
output into the publication that consumes it. Never draw or overwrite a cover
inside 11blog directly.

## Configuration

Read ELEVENBRANDS_DIR from the repository-root .env.brand-assets.local file.
Stop if the file, checkout, brand definition, generator, or its virtual
environment is missing. Never commit the env file or hardcode its value in the
skill.

Before generating, read these files from that checkout completely:

- v0/skills/11brands-generate-assets/SKILL.md
- the selected v0/brands/<brand>/brand.md

## Styles

- 11blog: brand key blog-rj11io; dark blog palette.
- 11ai: brand key blog-rj11io-11ai; light AI palette with the blog.rj11.io
  masthead.

Default to 11blog unless the request explicitly selects 11ai.

## Generate and import

Check both repositories' git status first. Preserve unrelated changes.

Run one publication per invocation:

~~~bash
python3 v0/skills/11blog-generate-publication-covers/scripts/generate_publication_cover.py \
  --publication tech-tutorials \
  --title "Tech tutorials" \
  --style 11blog \
  --version v1
~~~

Use --filename only when retaining an established filename stem. The script:

1. creates a new timestamped content-og generation inside 11brands;
2. refuses to reuse a source folder or overwrite a consumer file;
3. copies the generated PNG into content/publications/<id>/assets/;
4. prints both source and destination paths.

After generation:

1. inspect every generated image;
2. add or update SOURCES.md with the source generation, brand, date, and filename;
3. statically import the new version from the publication index;
4. keep the old versioned image unless the user explicitly requests deletion;
5. invoke the 11blog-verify-publication-covers skill;
6. run typecheck, lint, and build from v0/www.

Do not update a cover by overwriting an existing version. Social previews cache
image URLs; a visual change needs a new filename.

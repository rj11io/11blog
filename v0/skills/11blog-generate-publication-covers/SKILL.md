---
name: 11blog-generate-publication-covers
description: Generate and import one or a cohesive batch of versioned 11blog publication cover and Open Graph images through the separate 11brands repository. Use when adding, refreshing, restyling, or rebranding publication covers while preserving bundled source generations, manifests, consumer imports, and asset history across both repositories.
---

# Generate 11blog publication covers

Generate in the configured 11brands checkout, then copy exact outputs into the
publications that consume them. Never draw or overwrite a cover in 11blog.

## Configure

Read ELEVENBRANDS_DIR from repository-root .env.brand-assets.local. Stop if the
configuration, checkout, brand definition, generator, or virtual environment is
missing. Never commit the env file or hardcode its value.

Before generating, read these configured-checkout files completely:

- v0/skills/11brands-generate-assets/SKILL.md
- the selected v0/brands/<brand>/brand.md

Styles:

- 11blog: blog-rj11io; default dark blog palette.
- 11ai: blog-rj11io-11ai; light AI palette with blog.rj11.io masthead.

Use 11blog unless the request explicitly selects 11ai.

## Choose one run or a batch

Treat one user request in one style as one intended generation. If it contains
multiple covers, batch them. Do not invoke the single-cover command in a loop.
One batch creates one gen- folder and one MANIFEST.md containing every title.

Split generations only when the style differs or the work is a genuinely later,
independent request. A single cover can use single mode:

~~~bash
python3 v0/skills/11blog-generate-publication-covers/scripts/generate_publication_cover.py \
  --publication tech-tutorials \
  --title "Tech tutorials" \
  --style 11blog \
  --version v1
~~~

For multiple covers, create a temporary JSON file:

~~~json
[
  {
    "publication": "tech-tutorials",
    "title": "Tech tutorials",
    "version": "v1"
  },
  {
    "publication": "project-postmortems",
    "title": "Project postmortems",
    "version": "v1"
  }
]
~~~

Run it once:

~~~bash
python3 v0/skills/11blog-generate-publication-covers/scripts/generate_publication_cover.py \
  --batch-file /tmp/11blog-publication-covers.json \
  --style 11blog \
  --stamp 20260804-new-publications
~~~

Batch items accept publication, title, version, and optional filename and
target_assets. The latter is an implementation hook for the post-cover skill;
invoke 11blog-generate-post-covers for individual posts.

The script validates every request and destination before generation, rejects
duplicate source names or consumer targets, refuses overwrite, then prints the
shared generation plus every source/destination pair.

## Finish

1. Inspect every image at original detail.
2. Record brand, date, shared generation, source files, consumer files, and
   dimensions in SOURCES.md.
3. Statically import each new version.
4. Keep old versioned covers for provenance and cached social previews.
5. Invoke 11blog-verify-publication-covers, batching files from this generation.
6. Run typecheck, lint, and build from v0/www.

Never overwrite a versioned file. Social previews cache image URLs.

---
name: 11blog-generate-covers
description: Generate and import versioned cover and Open Graph images for 11blog posts and publications from the 11brands v1 repository. Use when adding, renaming, refreshing, restyling, or rebranding any post or publication cover, including batches that must share one generation run.
---

# Generate 11blog covers

Covers are generated in the separate 11brands checkout and copied here without
modification. Never draw, edit, resize, or re-encode a cover inside 11blog.

## Configure

Read ELEVENBRANDS_DIR from the repository-root .env.brand-assets.local file.
Stop if the file or the directory is missing. Never commit the env file or
hardcode its value.

Everything below runs against the v1 subtree of that checkout. Its v0 is
deprecated: never touch it. The full consumer contract is
$ELEVENBRANDS_DIR/v1/skills/11brands-v1-integration/SKILL.md; read it if
anything here seems out of date.

## Pick the brand key

Brands live at $ELEVENBRANDS_DIR/v1/brands/<key>/config.json. Use 11blog by
default. Use a sub-brand key such as 11blog-11ai only when the request
explicitly selects that style. Read the config for the palette and text; never
edit anything in 11brands. A new brand or variant is the 11brands operator's
job, not yours.

## Generate

One user request in one style is one generation run: pass every title in a
single invocation, never loop single calls.

~~~bash
cd "$ELEVENBRANDS_DIR/v1/scripts"
.venv/bin/python generate_integration.py 11blog --source 11blog \
  --kind og-content \
  --title "First post title" \
  --title "Second post title" \
  --title "Publication title"
~~~

A publication cover is just a card whose title is the publication title. Many
titles also fit in a file, one per line, via --titles-file. First-time setup if
the venv is missing: python3 -m venv .venv && .venv/bin/pip install Pillow.

The script prints the run stamp. Output lands at
$ELEVENBRANDS_DIR/v1/integrations/<stamp>/<key>/og-content/, one
<title-slug>-og-content.png per title plus a MANIFEST.md recording what was
used and who asked. Leave the run folder behind, always: it is 11brands'
record. Never delete, move, tidy, stage, or commit anything inside 11brands.

## Import

Copy each file byte-for-byte to its consumer path, renamed to the next unused
version. Never overwrite an existing version; old versions stay, because shared
link previews cache image URLs.

- Single-file post (posts/slug.ts): content/publications/<pubId>/assets/<slug>-og-cover-vN.png
- Directory post (posts/slug/index.ts): content/publications/<pubId>/posts/<slug>/assets/<slug>-og-cover-vN.png
- Publication cover: content/publications/<pubId>/assets/<name>-og-cover-vN.png, keeping the established <name> prefix

## Wire and record

1. Statically import each new file where the post or publication record is
   defined and point coverImage at its .src.
2. Record in the nearest SOURCES.md: brand key, date, run stamp, source file,
   consumer file, and dimensions. One shared run gets one entry with a table
   for its files.
3. Run the 11blog-verify-covers skill over the same set.
4. Run typecheck, lint, and build from v0/www.

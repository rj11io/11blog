# AGENTS.md

Working notes for agents and new contributors. Find your task in the routing table, read the post it names, then change code.

## What this repository is

11blog is a personal blog. The writing lives in TypeScript under `content/`, and a Next.js app in `v0/www/` imports it and builds every page ahead of time. There is no database and no CMS. Publishing means committing a file and running a build. The site is hosted on Vercel.

Two directories matter:

- `content/` — the writing, its types, and its validator. Depends on nothing from the website.
- `v0/www/` — the website. Imports `content/` through the `@content/*` alias.

The dependency runs one way. **Never import from `v0/www` inside `content/`.**

There is a second, unrelated `AGENTS.md` at `v0/www/AGENTS.md`. It warns that this version of Next.js differs from what you may expect and tells you to check `node_modules/next/dist/docs/` before writing framework code. Heed it.

## The documentation lives in the blog itself

The Blog platform docs publication documents this platform. It is the source of truth for how everything works, and it is written for whoever maintains the repo. Read the relevant post before changing the thing it describes.

All fourteen live in `content/publications/blog-platform-docs/posts/`. Start with Working with the platform if you are new.

| If you are… | Read | Published at |
| --- | --- | --- |
| New to the platform | `working-with-the-platform.ts` | `/blog-platform-docs/working-with-the-platform` |
| Writing or editing a post | `adding-content.ts` | `/blog-platform-docs/adding-content` |
| Looking up Markdown syntax | `markdown-reference/` | `/blog-platform-docs/markdown-reference` |
| Hitting a content error message | `content-validation.ts` | `/blog-platform-docs/content-validation` |
| Choosing tags, titles, or excerpts | `search-and-discovery.ts` | `/blog-platform-docs/search-and-discovery` |
| Adding or changing an author | `authors-and-bylines.ts` | `/blog-platform-docs/authors-and-bylines` |
| Changing types, the registry, or the boundary | `content-contract.ts` | `/blog-platform-docs/content-contract` |
| Adding a component, or wondering what runs where | `rendering-model.ts` | `/blog-platform-docs/rendering-model` |
| Adding Markdown syntax | `extending-the-renderer.ts` | `/blog-platform-docs/extending-the-renderer` |
| Touching colours, spacing, or theming | `design-tokens.ts` | `/blog-platform-docs/design-tokens` |
| Building any interactive element | `accessibility-contract.ts` | `/blog-platform-docs/accessibility-contract` |
| Renaming anything with a URL | `urls-and-redirects.ts` | `/blog-platform-docs/urls-and-redirects` |
| Running, checking, or releasing | `running-the-blog.ts` | `/blog-platform-docs/running-the-blog` |
| Changing how readers can support the blog | `supporting-the-platform.ts` | `/blog-platform-docs/supporting-the-platform` |

## Commands

Run these from `v0/www`:

```bash
npm run typecheck
```

```bash
npm run lint
```

```bash
npm run build
```

The dev server runs from the repository root and serves on port 4100:

```bash
npm --prefix v0/www run dev
```

**Run all three checks before committing.** They fail for different reasons and none covers another.

**A passing `typecheck` proves nothing about content.** It only checks types and never runs your code. The content validator executes when the registry is imported, which happens during `build` and when the dev server renders a page. A date written as `2026-02-30` is a valid string: `typecheck` passes, `build` fails.

## Hard rules

- **The registry is the only door.** Pages import from `content/registry.ts`. Never import a publication file directly. If a page needs something the registry does not expose, add a derived export there.
- **Drafts are filtered once, in the registry.** `isDraft` on a post or publication hides it, and every derived export follows. Never add a second draft check in a page or a component. The dev server shows drafts; a production build never does.
- **`content/routes.ts` owns every URL shape.** Call its helpers. Never write a path as a string.
- **Renaming anything with a URL needs a redirect** in `v0/www/next.config.ts`, in the same change. A publication ID, a post slug, and an author ID are all public addresses.
- **One post, one address.** A post is reachable at its slug, or at its numeric ID if it has no slug — never both. Numeric IDs are not a fallback address.
- **No YAML frontmatter, no MDX, no raw HTML in posts.** None of the three is enabled. New syntax means a new renderer component; see `extending-the-renderer.ts`.
- **Never create both `posts/name.ts` and `posts/name/index.ts` for one slug.** The single file silently wins and the directory is ignored.
- **Editorial order is array order.** A publication's `posts` array sets the reading sequence and the previous/next links. Nothing sorts it.
- **Server components by default.** Add `"use client"` only for state or event handlers, and keep it at the leaves.
- **Name a design token; never write a colour or a corner radius.**
- **Commit messages decide releases.** `fix:` is a patch, `feat:` is a minor, `chore:`/`docs:`/`styles:` release nothing.

## Two things nothing validates

Check these by hand, because no command will tell you:

- **Internal links written in post prose.** A link to a page that does not exist builds happily and 404s for the reader. Open every internal link you write. This also bites when you draft something already published: its address goes away, and any prose link to it becomes a 404. Search the content directory for the slug first.
- **Author avatar paths.** Unlike cover images, the `avatar` field is not checked at all, and a broken path ships silently. Open one author page after changing an avatar. Note that an HTTPS avatar cannot work: avatars render through `next/image`, which has no remote hosts configured.

## When you change something, update the documentation

**Any meaningful change to the platform must update the Blog platform docs publication in the same commit.** These posts are published; a stale one is a public false statement, not a private note.

A change is meaningful if it alters what someone else would need to know. Specifically:

| You changed | Update |
| --- | --- |
| A field on a content type | `adding-content.ts`, and `content-contract.ts` if the contract itself moved |
| Where assets live, or how covers and link previews work | `adding-content.ts` |
| A validation rule or its message | `content-validation.ts`, including its message table |
| A route, slug, or redirect | `urls-and-redirects.ts` |
| Markdown syntax or a renderer component | `markdown-reference/` **and** `extending-the-renderer.ts` |
| A design token, or theming behaviour | `design-tokens.ts` |
| An accessibility guarantee, or a new interactive element | `accessibility-contract.ts` |
| Search fields, tag behaviour, or sorting | `search-and-discovery.ts` |
| The author record, or how bylines render | `authors-and-bylines.ts` |
| A command, script, or the release pipeline | `running-the-blog.ts` |
| What runs on the server or in the browser | `rendering-model.ts` |

**If no existing post covers what you changed, write one.** Follow `adding-content.ts`, give it the next unused `postId` in the 4xx range, place it in the `posts` array where it belongs in the reading order, and link it from the posts it relates to. Add it to the routing table above as well.

Three habits that keep the documentation honest:

- **Verify before you write.** Read the code, or run it. Several statements in these posts were wrong on the first draft and were only caught by testing them.
- **Record the reasoning, not just the rule.** The contrast numbers in `design-tokens.ts` and the plugin order in `running-the-blog.ts` are why those unusual choices have survived.
- **Say what is broken or missing.** `accessibility-contract.ts` ends with its own gaps. A contract with unstated holes is worse than no contract.

## Writing a doc post

Post bodies are TypeScript template strings, which constrains how you write them. Follow what the existing posts do:

- Use `~~~` for code fences, not backticks.
- Avoid inline backticks. Write file names and identifiers as plain text.
- Escape `${` as `\${`, or it becomes a variable reference and breaks the build.
- Escape backslashes: write `\\d` to show `\d`.
- Start the body with a first-level heading matching the post title. The page strips it and renders the title itself.
- Use second- through fifth-level headings for sections. They become the table of contents.

After writing, run `build` and open the page. Check the code blocks, the tables, and every internal link.

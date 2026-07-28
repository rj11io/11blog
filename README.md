# 11blog

11blog is a personal blog whose editorial content lives in TypeScript and is rendered by a Next.js app.

## Repository layout

- `content/` contains authors, publications, posts, routes, and content validation.
- `v0/www/` contains the private Next.js web application.

The web app imports shared content through the `@content/*` TypeScript path alias. The current registry contains the `Signal Path`, `Material Culture`, `Local Weather`, and `Blog Platform` publications.

## Run the site

From the web app directory:

```bash
cd v0/www
npm install
npm run dev
```

Open the local URL printed by Next.js. `/` is the landing page, which pulls featured and recent posts, featured and recent publications, and the author list straight from the registry. `/browse` is the searchable index. Publication and post pages use `/{pubId}` and `/{pubId}/{postId}`, while author pages are available below `/authors/...`.

Other available checks and production commands are:

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

## Add content

Add or edit publication files under `content/publications/`, and update authors in `content/authors.ts`. The registry in `content/registry.ts` is the source of truth for which publications are exposed. Content is validated when the registry is loaded.

# 11blog web app

This directory contains the private Next.js frontend for 11blog. It renders the TypeScript content stored in the repository-level `content/` directory.

## Development

```bash
npm install
npm run dev
```

Run these commands from `v0/www`. The available scripts are:

```text
npm run lint       # Check the app with ESLint
npm run typecheck  # Run TypeScript without emitting files
npm run build      # Create a production build
npm run start      # Serve the production build
npm run format     # Format TypeScript and TSX files
```

## Routes

- `/` is the landing page.
- `/browse` lists the blog content.
- `/publications/[pubId]` shows a publication.
- `/publications/[pubId]/[postId]` shows a post.
- `/authors/[authorId]` shows an author and their posts.

## Content

Content is defined outside this app in `../../content`. The `@content/*` alias configured in `tsconfig.json` makes it available to the app; edit the content files there when adding authors, publications, or posts.

The app uses local UI components in `components/ui/` and shared helpers in `lib/`.

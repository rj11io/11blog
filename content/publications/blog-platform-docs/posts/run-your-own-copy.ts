export const runYourOwnCopy = `
# Run your own copy

This platform is available as a boilerplate, so the fastest way to own a blog like this one is to copy it and replace the writing. This post is the checklist for doing that: what to replace, what to configure, and what to leave alone. For the argument for running your own platform at all, read [Own your platform](/online-presence/own-your-platform); this post assumes you are already convinced.

## What you are copying

The boilerplate lives at [github.com/rj11io/blog-boilerplate](https://github.com/rj11io/blog-boilerplate), under the Apache License 2.0. It is the same platform this site runs on, so everything in this publication applies to your copy: the content format, the validator, the renderer, and the release pipeline.

You get the two halves described in [The content contract](/blog-platform-docs/content-contract): a content directory for the writing and a website that renders it. The licence asks almost nothing of you, and replacing the writing and the branding is expected rather than merely allowed.

## Get it running first

Fork or clone the repository, then start the dev server:

~~~bash
cd v0/www
npm install
npm run dev
~~~

Open the address it prints and click around before changing anything. A working baseline makes every later mistake easier to find. [Running and releasing the blog](/blog-platform-docs/running-the-blog) covers the commands and the checks.

## Replace the writing

Three things make the content yours.

**The authors.** Replace the entries in content/authors.ts with yourself, and put your photograph in v0/www/public/static/blog-authors/. The checklist in [Authors and bylines](/blog-platform-docs/authors-and-bylines) covers every field, including the one nothing validates: open an author page afterwards and check the photograph loaded.

**The publications.** Remove the publication directories under content/publications and write your first one following [Adding a publication or post](/blog-platform-docs/adding-content). Remember the registry imports every publication by name, so removing one means removing its import too.

**The redirects.** The redirect list in v0/www/next.config.ts is this site's address history. None of those old addresses are yours, so empty the list and let your own history accumulate. [URLs, slugs, and redirects](/blog-platform-docs/urls-and-redirects) explains why the file only ever grows after that.

## Configure the site's identity

**The address.** v0/www/lib/site.ts holds siteOrigin, the one place the site's own domain is written. Set it to yours first. Every share link and every link preview is built from it, and a copy still pointing at blog.rj11.io sends your readers here.

**The link-preview fallback.** The site-wide Open Graph image, the picture shown when a page with no cover is shared, lives under v0/www/public/static/og/. Replace it, or pages without covers preview with this blog's branding.

**The name.** The header wordmark, page titles, and footer carry the site's name in the website's own files. Search v0/www for the old name and replace what you find.

## Deploy and release

The site deploys as a standard Next.js application. This blog runs on Vercel, and the analytics script in the root layout is Vercel's; if you deploy elsewhere, remove it or replace it with your own measurement.

Releases are cut by the workflow in .github/workflows/release.yml, driven entirely by commit messages, and the version in the site footer comes from the root package.json that the pipeline writes. The workflow runs in a GitHub environment named release, so create that environment in your repository settings; if a release fails anyway, [Running and releasing the blog](/blog-platform-docs/running-the-blog) covers where to look.

One environment variable matters: SHOW_DRAFTS=1 publishes drafts on a deployment. Set it only on a preview environment, never on production. The flag lives in content/drafts.ts.

## What to leave alone

- The registry and the validator. They are what makes a broken post a failed build instead of a broken page.
- content/routes.ts. Change it only if you want different URL shapes, and read [URLs, slugs, and redirects](/blog-platform-docs/urls-and-redirects) first.
- The plugin order in .releaserc.js and in the Markdown renderer. Both are load-bearing, and both are commented where they live.

## Keep the manual

This publication is the boilerplate's manual. Where a post names this site's publications or authors, read it as an example rather than a requirement. And if you change how your copy works, change your copy of these posts with it: the habit that keeps documentation true is described at the end of [Working with the platform](/blog-platform-docs/working-with-the-platform). If you improve the platform itself, [Contribute to the platform](/blog-platform-docs/contribute-to-the-platform) explains how to send the change back.
`

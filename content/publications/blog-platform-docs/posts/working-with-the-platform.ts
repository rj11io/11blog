export const workingWithThePlatform = `
# Working with the platform

This publication documents 11blog, the platform this site runs on. Fourteen posts is a lot to walk into, so this one is the map: what the platform is, what it deliberately is not, and which post to read for whatever you are trying to do.

If you are here because you want your own blog rather than to work on this one, start with [Build your own blog](/online-presence/build-your-own-blog) instead.

## What 11blog is

A blog whose writing lives in TypeScript files and is rendered by a Next.js application that reads them at build time.

That single sentence explains most of the decisions documented here. There is no database, no admin screen, and no content fetched at request time. A post is a file. Publishing is a commit and a build. Every page is generated ahead of time and served as static output.

The repository has two halves:

~~~text
11blog/
├── content/          the writing, its types, and its validator
└── v0/www/           the website that renders it
~~~

The dependency runs one way. The website imports the content; the content knows nothing about the website. That is what makes the front end replaceable, and it is why the directory is called v0.

## What it is not

Worth stating early so you can stop reading if it is the wrong tool.

**It is not a content management system.** There is no interface for writing. You edit files in a repository.

**It is not multi-tenant.** One repository is one blog, with one author list.

**It cannot publish without a build.** Adding a post to a running site is not possible by design. If you need to publish from a phone at short notice, this is the wrong shape.

**It has no comments, no newsletter, and no analytics beyond page views.** Those are deliberate omissions rather than a roadmap.

What you get in exchange: pages that are files, content that outlives the renderer, a build that refuses to ship invalid data, and almost no JavaScript on a reading page.

## Where to start

Four groups, in the order they build on each other. Every post links onward to whatever it depends on, so you can also just follow the previous and next links from here.

### Writing

Start here if you want to add or edit content.

- [Adding a publication or post](/blog-platform-docs/adding-content) is the entry point. Both post formats, every required field, and a checklist for each job.
- [Markdown reference](/blog-platform-docs/markdown-reference) is the executable reference: every form the renderer supports, written out and rendered live on the page.
- [Content validation rules](/blog-platform-docs/content-validation) lists every rule the build enforces, the exact message each one throws, and what to change. Read it when a build fails.
- [Search, tags, and discovery](/blog-platform-docs/search-and-discovery) explains what readers can actually search, which changes how you should write a title, an excerpt, and a tag.
- [Authors and bylines](/blog-platform-docs/authors-and-bylines) covers the author record and what happens when you rename or remove one.

### Understanding

Start here if you are evaluating the approach, or about to change its shape.

- [The content contract](/blog-platform-docs/content-contract) explains why the writing sits outside the application, what the boundary guarantees, and what a replacement front end would have to provide.
- [How pages are rendered](/blog-platform-docs/rendering-model) covers static generation, which few components run in the browser and why, and the trades taken on images.

### Extending

Start here if you are adding to the platform rather than writing on it.

- [Extending the renderer](/blog-platform-docs/extending-the-renderer) is the recipe behind the custom shortcodes, walked through end to end with a new one.
- [Design tokens and theming](/blog-platform-docs/design-tokens) covers the named values behind the interface, including the two that carry measured reasoning.
- [Accessibility contract](/blog-platform-docs/accessibility-contract) records what the blog guarantees for keyboard, screen reader, contrast, and reduced-motion readers, and ends with the gaps that remain.

### Operating

Start here if you are running the thing.

- [URLs, slugs, and redirects](/blog-platform-docs/urls-and-redirects) covers how addresses are built and the runbook for renaming anything without breaking old links.
- [Running and releasing the blog](/blog-platform-docs/running-the-blog) covers the dev server, the checks to run before committing, and how a commit message becomes a release.

## Three things that catch everyone

Pulled forward from the posts above, because they are the mistakes that cost the most time.

**A passing typecheck proves nothing about your content.** It checks types and never runs the code. The validator executes when the registry is imported, which happens during a build and when the dev server renders a page. A date written as the thirtieth of February is a valid string: typecheck passes, the build fails.

**Nothing checks the links you write in prose.** A link to a page that does not exist builds happily and returns a 404 to the reader. Open every internal link you write.

**Renaming anything with a URL needs a redirect in the same change.** A publication ID, a post slug, and an author ID are all public addresses. This publication moved from one address to another while it was being written, and the redirects for that move are in the config today.

## Versions

The version is decided by commit messages rather than set by hand. A fix commit is a patch, a feature commit is a minor, and everything else releases nothing. The number shown in the site footer comes from the repository manifest, which the release pipeline writes.

For what changed and when, read the changelog in the repository rather than any post here. A hand-written summary of releases would go stale on the next one, and nothing in this publication can keep up with a pipeline that runs on every push.

## Running your own copy

The platform is available as a boilerplate at [github.com/rj11io/blog-boilerplate](https://github.com/rj11io/blog-boilerplate), under the Apache License 2.0. Fork it, replace the content directory with your own writing, and deploy it.

Everything in this publication applies to that copy, because it is the same platform. Where a post refers to this site's specific publications or authors, read it as an example rather than as a requirement.

If you want the argument for why running your own is worth the trouble, that is a different publication: [Own your platform](/online-presence/own-your-platform).

## How these posts are maintained

One rule, and it is the reason this publication is worth trusting: **a meaningful change to the platform updates the documentation in the same commit.** These posts are published, so a stale one is not a private note that has drifted, it is a public false statement.

Three habits hold that up.

Verify before writing. Several claims in these posts were wrong in their first draft and were caught only by running them.

Record the reasoning, not just the rule. The contrast measurements in the theming post and the plugin ordering in the release post are why those unusual choices have survived.

Say what is missing. The accessibility post ends with its own gaps, and the validation post names the two things nothing checks. A contract with unstated holes is worse than no contract.

## Supporting the blog

The four groups above are the platform. One post in this publication is not about the platform at all: [Supporting the platform](/blog-platform-docs/supporting-the-platform) is for readers rather than maintainers, and it covers the three ways to help this blog keep going. Passing a post to someone who needs it is the one that matters most, and it is free.
`

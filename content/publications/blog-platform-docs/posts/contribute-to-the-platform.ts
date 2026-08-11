export const contributeToThePlatform = `
# Contribute to the platform

This blog is developed in the open, at [github.com/rj11io/11blog](https://github.com/rj11io/11blog). Contributions are welcome in two shapes: writing, meaning a new post or a correction to one, and code, meaning a change to the platform itself. Both arrive the same way, as a pull request, and this post is the path from fork to merged.

## The shortest contribution

You do not need a fork to point out a problem. If a post is broken, unclear, or plainly wrong, open an issue on the repository and say so. This documentation is only worth trusting because wrong claims in it keep getting caught, and some of the catches come from readers. [Supporting the platform](/blog-platform-docs/supporting-the-platform) counts this as real support, because it is.

## Before either kind

Fork the repository, clone your fork, and get the site running locally. [Running and releasing the blog](/blog-platform-docs/running-the-blog) covers it; the short version:

~~~bash
cd v0/www
npm install
npm run dev
~~~

Work on a branch, and run the three checks before you push:

~~~bash
npm run typecheck
npm run lint
npm run build
~~~

They fail for different reasons and none covers another. The build is the one that runs the content validator, so it is the one that judges your writing rather than just your types.

## Contributing writing

Four steps.

**Add yourself as an author.** Every post carries a byline, and bylines resolve against content/authors.ts. Follow the checklist in [Authors and bylines](/blog-platform-docs/authors-and-bylines): a lowercase id, a two-or-three character displayName, a plain-text bio, and a photograph if you want one, checked by opening your author page, because nothing validates the path.

**Write the post.** [Adding a publication or post](/blog-platform-docs/adding-content) is the format guide, and [Markdown reference](/blog-platform-docs/markdown-reference) shows every form the renderer supports. Put the post in the publication it belongs to, in the right position in its posts array, since array order is reading order.

**Check what search will see.** Post bodies are invisible to search on this site, so the title, the excerpt, and the tags carry all the discoverability. [Search, tags, and discovery](/blog-platform-docs/search-and-discovery) changes how you write all three.

**Click every link you wrote.** Nothing validates links in prose. A link to a page that does not exist builds happily and returns a 404 to your reader.

## Contributing code

Read first, then change. Each part of the platform has a post that documents it, and [Working with the platform](/blog-platform-docs/working-with-the-platform) maps which one covers the thing you are about to touch. The repository's AGENTS.md carries the same map in table form, plus the hard rules that are easy to break by accident.

Two rules matter more than the rest.

**Update the documentation in the same commit.** A meaningful change to the platform updates the post that describes it. These posts are published, so a stale one is a public false statement rather than a private note. If no post covers what you changed, write one.

**Your commit message decides the release.** The pipeline reads Conventional Commits: a fix commit cuts a patch, a feature commit cuts a minor, and chore or docs commits release nothing. Write the summary line as a changelog entry a reader can understand, because that is exactly what it becomes.

## What a review looks at

A pull request is checked against the same things these posts warn about: the three checks pass, internal links were clicked, unfinished work is flagged as a draft rather than half-published, new syntax comes with its example in the Markdown reference, and anything whose URL moved comes with a redirect. None of that is bureaucracy; each item is a specific way a reader gets hurt.

If you plan to change the shape of the content itself, meaning the types, the registry, or the validation, read [The content contract](/blog-platform-docs/content-contract) first and expect the review to take longer. That boundary is the platform's one deliberate rigidity, and it is guarded accordingly.
`

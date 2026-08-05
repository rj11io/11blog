export const contentContract = `
# The content contract

The writing on this blog does not live inside the website. It lives in a directory next to it, in plain TypeScript, and the website imports it. This post explains why, what the boundary guarantees, and what you would have to do to put a different website in front of the same content.

## Two directories, one boundary

~~~text
11blog/
├── content/          the writing and its rules
└── v0/www/           the website that renders it
~~~

The content directory has no dependency on Next.js, on React, or on anything in v0/www. It is types, data, a small amount of derivation, and a validator. You could import it from a script, a different framework, or a test with nothing else installed.

The dependency runs one way only: v0/www imports from content, and content imports nothing from v0/www. That single rule is the contract. Everything else in this post follows from it.

The v0 in the path is a statement of intent. The website is version zero of a presentation layer, and it is expected to be replaced. The content is not.

## How the boundary is wired

Two settings in v0/www/tsconfig.json do the work:

~~~json
"paths": {
  "@content/*": ["../../content/*"]
},
"include": ["**/*.ts", "**/*.tsx", "../../content/**/*.ts"]
~~~

The alias means the website writes @content/registry rather than a chain of parent directories. The include means the content files are type-checked as part of the website's own typecheck, so a type mistake in a content file is caught by the same command that checks the components. Rule violations are a separate matter, caught by the build; see [Content validation rules](/blog-platform-docs/content-validation).

The bundler needs matching configuration, described in [Running and releasing the blog](/blog-platform-docs/running-the-blog).

## The registry is the only door

content/registry.ts is the entry point. Pages import from it. Nothing in the website imports a publication file directly, and nothing should.

The registry does five things, in this order.

**It assembles.** It imports each publication and the author list into a private array called authoredPublications, which is everything that has been written, drafts included.

**It validates.** It calls the checker at the top level of the module, so importing the registry validates the content. A rule failure is a build failure. Validation runs on the full authored list, before anything is hidden, so a draft is held to the same rules as a published post. See [Content validation rules](/blog-platform-docs/content-validation).

**It filters.** It removes drafts, and exports the result as publications. Both levels are filtered: a draft publication takes its posts with it, and a draft post disappears from a published publication. It also marks the posts of a draft publication as drafts themselves, which is just the truth restated, and it saves every badge downstream from having to check two flags. This is the only place in the whole site where a draft is hidden. See [Adding a publication or post](/blog-platform-docs/adding-content) for how the flag behaves.

**It derives.** It pre-computes the shapes the pages actually need, so no page has to join data together itself. Every derived export is built from the filtered list, which is why hiding a draft needs no other change anywhere: counts, lists, addresses, and the previous and next links all follow.

**It looks things up.** It exports the small set of functions that find one publication, post, or author. These read the filtered list too, so a draft's address resolves to nothing and the page returns 404.

Here is what the registry exports:

| Export | What it is |
| --- | --- |
| publications | Every published publication, in editorial order, with its published posts attached. Drafts are already gone |
| blogAuthors | Every author, in full |
| allPosts | Every post from every publication, flattened, with its publication and resolved authors attached |
| publicationPreviews | Every publication without its posts, plus a link, a post count, and its authors |
| postPreviews | Every post without its body or images, for lists and cards |
| authorPreviews | Every author plus a link and how many posts they have written |
| getPublication, getPost, getAuthor | Single-item lookups |
| getPostsByAuthor | Every post preview for one author |
| getPublicationAuthors | The authors of a whole publication |
| getPostPreview | A preview for one post, when you already hold the publication |
| getPostContent, stripLeadingH1 | Small helpers for preparing a body to render |

The reason to route everything through this file is that the derivation happens once, at module load, and every page sees the same result. A page that reached into a publication file directly would have to resolve author IDs itself, build its own links, and would drift the moment the shape changed.

## Why there are preview types

A post carries its whole body, and possibly a dozen configured images. A card on the browse page needs the title, the excerpt, the date, and a link.

So content/types.ts defines narrower shapes derived from the full ones:

~~~ts
export type PostPreview = Omit<
  PostListItem,
  "content" | "images" | "imageLists" | "authorIds"
>

export type PublicationPreview = Omit<Publication, "posts"> & {
  href: string
  postCount: number
}
~~~

Because they are built with Omit from the full types, they cannot drift. Add a field to Post and the preview gains it automatically unless you exclude it. There is no second list of field names to keep in step.

The practical payoff is on the browse page, which is a client component. Everything it receives is serialised and sent to the browser. Handing it postPreviews rather than allPosts keeps every post body out of that payload.

authorIds is dropped from the preview for a different reason: it has already been replaced by resolved author details, so keeping the raw IDs would invite code that looks them up a second time.

isDraft is kept rather than dropped, which looks redundant given that a preview only ever describes something the site is showing. It is false in every production build. It is carried through so the Draft badge has something to read on the dev server, where drafts are served on purpose.

A publication preview gains something its full form does not have: an authors list. A publication never declares its authors, because that would be a second place for the same fact to live and the two would eventually disagree. Instead the registry collects everyone with a byline on at least one of its posts, ordered by how many they wrote and then by name, so the main author leads. Add a post and the publication's authors follow on the next build, with nothing to remember to update.

## Editorial order is array order

A publication holds its posts as a plain array, and that order is the editorial order. Nothing sorts it.

Two features depend on this. The registry records each post's position as editorialIndex while flattening, and the post page uses the position returned by the lookup to find its neighbours:

~~~ts
const previous = publication.posts[postIndex - 1]
const next = publication.posts[postIndex + 1]
~~~

So the previous and next links at the foot of a post follow the array, not the dates. Reordering the array reorders the reading sequence. This is intentional: a publication is a series, and a series has an order its author chose.

Those two lines are also the reason the draft filter rebuilds the posts array rather than only filtering the derived lists. They read positions straight off the publication, so a draft left in the array would become a dead link out of a live post. Removing it closes the gap instead, and the chain simply runs from the post before it to the post after.

Where dates are used, they are used explicitly. The landing page sorts by created date to build its "latest" lists; the browse page offers newest and oldest as sort options. Those are presentation choices layered on top of the editorial order, not replacements for it.

## The two helpers a renderer needs

Post bodies begin with a first-level heading that repeats the title, because a Markdown file should be readable on its own. The page displays the title itself, so the body's copy has to go:

~~~ts
export function getPostContent(post: Post) {
  return post.content?.trim() || null
}

export function stripLeadingH1(markdown: string) {
  return markdown.replace(/^\\s*#\\s+[^\\n]+\\n+/, "")
}
~~~

getPostContent returns null rather than an empty string for a body with nothing in it, so a page can distinguish "no content" from "content that happens to be short". The post page uses that to show an access message instead of an empty article.

These two live in the content layer rather than the website because they are facts about the content format, not about how it is displayed.

## Replacing the website

Because the dependency runs one way, a different front end is a realistic piece of work rather than a rewrite. It would need to provide:

- **A way to import a .md file as a string.** The type declaration in content/markdown.d.ts already describes the shape; the bundler needs a loader that produces it. The current one is five lines.
- **A way to import an image file and read its source, width, and height.** Post image modules rely on this, and it is the only other build-time capability the content assumes.
- **The five routes.** Landing, browse, publication, post, author. content/routes.ts already defines their shapes.
- **A Markdown renderer** that handles standard Markdown, the GitHub extensions, and the three custom shortcodes. See [Extending the renderer](/blog-platform-docs/extending-the-renderer).

Everything else, including all validation, comes with the content.

## Rules for changing the contract

**Adding an optional field is safe.** Existing content stays valid and existing pages ignore it. Add a validation rule for it at the same time.

**Adding a required field is a change to every publication file.** Do it deliberately, and update [Adding a publication or post](/blog-platform-docs/adding-content) in the same change.

**Never import from v0/www inside content.** It would reverse the dependency and make the content layer unusable anywhere else. There is nothing in the website worth this.

**Put format knowledge in content, and appearance knowledge in the website.** "A body starts with a first-level heading" is a fact about the format, so stripLeadingH1 belongs in content. "A second-level heading has a top margin" is appearance, and belongs in the renderer.

**Keep the registry the only entry point.** If a page needs something the registry does not expose, add a derived export or a lookup function. Do not reach past it.
`

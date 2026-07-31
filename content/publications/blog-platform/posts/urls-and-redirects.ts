export const urlsAndRedirects = `
# URLs, slugs, and redirects

Every address on this blog is built by one small file, and every address that has ever worked is expected to keep working. This post explains how URLs are made, how a post is found from one, and what to do when something has to be renamed.

## One file owns every URL shape

content/routes.ts is fifteen lines and it is the only place that knows what the site's addresses look like:

~~~ts
export const browseHref = "/browse"

export function publicationHref(pubId: string) {
  return "/" + encodeURIComponent(pubId)
}

export function authorHref(authorId: string) {
  return "/authors/" + encodeURIComponent(authorId)
}

export function postHref(pubId: string, post: Pick<Post, "postId" | "slug">) {
  return publicationHref(pubId) + "/" + encodeURIComponent(post.slug ?? String(post.postId))
}
~~~

Nothing else in the codebase writes a path by hand. Pages, cards, breadcrumbs, and next-and-previous links all call these functions. Changing the shape of an address is therefore a one-file change, and the compiler finds every caller.

Two things worth noticing. Each piece is escaped, so an identifier that somehow contained an unusual character could not break the address. And a post falls back to its numeric ID when it has no slug, which is what makes slugs optional.

The five addresses on the site:

| Address | What it shows |
| --- | --- |
| / | The landing page |
| /browse | The searchable index of posts, publications, and authors |
| /{pubId} | One publication and its posts |
| /{pubId}/{slug} | One post |
| /authors/{authorId} | One author and everything they have written |

Publications sit at the top level, with no prefix. That is a deliberate choice and the reason for the reserved-word rule below.

## How a post URL is resolved

When a request arrives for /local-weather/morning-route, the registry looks up the publication by its ID, then searches that publication's posts for a match on either the slug or the numeric ID written as text:

~~~ts
const postIndex = publication.posts.findIndex(
  (post) => post.slug === postKey || String(post.postId) === postKey
)
~~~

It is tempting to read that and conclude a post has two working addresses. It does not, and the reason is worth understanding.

The lookup accepts either form, but only one of them is ever built as a page. The route lists its addresses like this:

~~~ts
postId: post.slug ?? String(post.postId),
~~~

A post with a slug contributes only its slug. Since nothing outside that list exists, /local-weather/302 returns 404 even though the lookup would have resolved it. Every post in the blog currently has a slug, so no numeric address exists anywhere on the site.

The numeric branch of the lookup matters only for a post with no slug, and then it is that post's single address. So the rule is simply: a post has exactly one address, its slug if it has one and its number if it does not.

The lookup also returns the post's position in the array, which is how the previous and next links at the foot of a post are found. Editorial order is array order. See [The content contract](/blog-platform/content-contract).

## Reserved publication IDs

Because publications live at the top level, a publication ID could collide with a real route. Three words are therefore refused outright:

~~~text
authors
browse
publications
~~~

A publication using one of them would be shadowed by the route of the same name and unreachable. The validator rejects it with "browse: pubId conflicts with a reserved route" before the site builds.

If you add a new top-level route, add its name to reservedPublicationIds in content/validation.ts in the same change. Forgetting is the kind of mistake that only shows up much later, as a publication that mysteriously will not open.

## Only known addresses exist

The three routes that vary by content each list their addresses ahead of time and refuse everything else. The post page is the clearest example:

~~~tsx
export const dynamicParams = false

export function generateStaticParams() {
  return allPosts.map((post) => ({
    pubId: post.publicationId,
    postId: post.slug ?? String(post.postId),
  }))
}
~~~

generateStaticParams lists every address to build. dynamicParams set to false means anything not on that list is a 404 rather than something the server tries to render on demand.

Two consequences follow.

**New content requires a build.** There is no way to add a post to a running site. This is the intended trade: the site is a set of files, and nothing is generated at request time.

**A typo in a link is caught as a 404, not as a broken page.** But note what is *not* checked: nothing verifies that a link written inside a post's prose points at a real address. A link to /blog-platform/does-not-exist will build happily and 404 for the reader. When you write internal links in a post, click them.

## Internal and external links in prose

The renderer sorts links into three kinds, in v0/www/app/(blog)/components/markdown.tsx:

- An address starting with a hash is a plain anchor, handled by the browser, jumping within the page.
- An address starting with a single forward slash is internal and uses the app's own navigation, so it does not reload the page.
- Anything else is treated as external and opens in a new tab, with rel set to noopener and noreferrer.

The internal test is careful about two lookalikes:

~~~ts
export function isInternalHref(href: string) {
  return (
    href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/\\\\")
  )
}
~~~

An address beginning with two slashes is a full address to another site with the scheme left off, and one beginning with a slash and a backslash is a known trick browsers may read the same way. Both would leave the site while looking internal, so both are excluded.

For authors, the rule is simple: write internal links as root-relative paths, starting with a slash.

## Renaming without breaking links

Changing a publication ID or a post slug changes its public address. The old address must keep working, which means a redirect.

Redirects live in v0/www/next.config.ts. There is a worked example already in place: the publication now called blog-platform was once called blog-tech, and it also used to sit under a /publications prefix. Four rules cover that history:

~~~ts
{ source: "/blog-tech/:postId", destination: "/blog-platform/:postId", permanent: true },
{ source: "/blog-tech", destination: "/blog-platform", permanent: true },
{ source: "/publications/blog-tech/:postId", destination: "/blog-platform/:postId", permanent: true },
{ source: "/publications/blog-tech", destination: "/blog-platform", permanent: true },
~~~

Two more rules handle the dropped prefix for every other publication:

~~~ts
{ source: "/publications/:pubId/:postId", destination: "/:pubId/:postId", permanent: true },
{ source: "/publications/:pubId", destination: "/:pubId", permanent: true },
~~~

Note the ordering. The specific blog-tech rules come before the general prefix rules, because the first matching rule wins and the general rule would otherwise send /publications/blog-tech to a publication ID that no longer exists.

permanent set to true sends a 308, which tells browsers and search engines the move is final and lets them update their records.

### Renaming a publication

1. Change pubId in the publication's file, and rename its directory to match.
2. Add two redirects: one for the publication itself, one for its posts using the :postId placeholder.
3. If the old ID was also reachable under a prefix or an even older name, add rules for those too, and put them above any general rule that could swallow them.
4. Search the content directory for the old ID. Links written inside post prose are plain text and will not be updated by the compiler. They will still work through the redirect, but an internal link should point at the current address.
5. Run build, then open the old address and confirm it lands in the right place.

### Renaming a post slug

Same shape, one rule instead of two:

~~~ts
{ source: "/local-weather/old-slug", destination: "/local-weather/new-slug", permanent: true }
~~~

There is no safety net here. As explained above, the post's numeric ID is not a working address, so the redirect is the only thing keeping the old link alive. Write it in the same change as the rename, not afterwards.

### Removing a publication or post

Deleting content leaves its address returning 404. If the piece existed publicly for any length of time, redirect it somewhere sensible instead: the publication it belonged to, or /browse. A redirect to a real page is nearly always better for a reader than a dead end.

## Rules of thumb

- Choose the slug carefully at the start. It is the address, and changing it costs a redirect forever.
- Never delete a redirect. The file only grows, and that is correct. Old links live in other people's bookmarks, feeds, and search results.
- Keep specific rules above general ones.
- Build paths by calling the helpers in content/routes.ts, never by writing a string.
- After any rename, check the old address by hand. A redirect that does not fire looks exactly like a working site until someone follows an old link.
`

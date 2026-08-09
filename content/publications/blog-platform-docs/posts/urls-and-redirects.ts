export const urlsAndRedirects = `
# URLs, slugs, and redirects

Every address on this blog is built by one small file, and every address that has ever worked is expected to keep working. This post explains how URLs are made, how a post is found from one, and what to do when something has to be renamed. For the map of the whole documentation set, see [Working with the platform](/blog-platform-docs/working-with-the-platform).

## One file owns every URL shape

content/routes.ts is the only place that knows what the site's addresses look like:

~~~ts
export const browseContentTypes = ["posts", "publications", "authors"] as const
export const defaultBrowseContentType: BrowseContentType = "posts"
export const browseHref = "/browse"

export function browseContentHref(contentType: BrowseContentType) {
  return \`\${browseHref}/\${contentType}\`
}

export function publicationHref(pubId: string) {
  return \`/\${encodeURIComponent(pubId)}\`
}

export function authorHref(authorId: string) {
  return \`/authors/\${encodeURIComponent(authorId)}\`
}

export function postHref(pubId: string, post: Pick<Post, "postId" | "slug">) {
  return \`\${publicationHref(pubId)}/\${encodeURIComponent(post.slug ?? String(post.postId))}\`
}
~~~

Almost nothing else in the codebase writes a path by hand. Pages, cards, breadcrumbs, and next-and-previous links all call these functions. The exceptions are honest ones: the header's link home is a literal slash, and the redirect rules in next.config.ts are plain strings, because a redirect's source is a historical address no helper should ever build again. Changing the shape of a live address is therefore a one-file change, and the compiler finds every caller.

Two things worth noticing. Each piece is escaped, so an identifier that somehow contained an unusual character could not break the address. And a post falls back to its numeric ID when it has no slug, which is what makes slugs optional.

The addresses on the site:

| Address | What it shows |
| --- | --- |
| / | The landing page |
| /browse/posts | The searchable index of posts |
| /browse/publications | The searchable index of publications |
| /browse/authors | The searchable index of authors |
| /{pubId} | One publication and its posts |
| /{pubId}/{slug} | One post |
| /authors/{authorId} | One author and everything they have written |

Publications sit at the top level, with no prefix. That is a deliberate choice and the reason for the reserved-word rule below.

The browse page has three addresses rather than one, and the content type is a path segment rather than a query parameter. Two consequences follow. Each of the three is built ahead of time and carries its own title and description, and an unrecognised type such as /browse/drafts is a 404 rather than a page quietly showing something else.

A request for /browse on its own redirects to /browse/posts. Note that no link inside the site points there: every one calls browseContentHref, so navigating the site never passes through that redirect. It exists for links from elsewhere and for addresses typed by hand.

## How a post URL is resolved

When a request arrives for /blog-platform-docs/adding-content, the registry looks up the publication by its ID, then searches that publication's posts for a match on either the slug or the numeric ID written as text:

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

A post with a slug contributes only its slug. Since nothing outside that list exists, /blog-platform-docs/402 returns 404 even though the lookup would have resolved it. Every post in the blog currently has a slug, so no numeric address exists anywhere on the site.

The numeric branch of the lookup matters only for a post with no slug, and then it is that post's single address. So the rule is simply: a post has exactly one address, its slug if it has one and its number if it does not.

The lookup also returns the post's position in the array, which is how the previous and next links at the foot of a post are found. Editorial order is array order. See [The content contract](/blog-platform-docs/content-contract).

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

The four routes that vary by content — publication, post, author, and browse — each list their addresses ahead of time and refuse everything else. The post page is the clearest example:

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

Three consequences follow.

**New content requires a build.** There is no way to add a post to a running site. This is the intended trade: the site is a set of files, and nothing is generated at request time.

**A draft has no address.** The list above comes from the registry, which has already removed drafts, so nothing is built for one and its path is a 404 like any other unknown address. No page has to check a flag, and there is no half-published state where the address exists but the page hides its contents. See [Adding a publication or post](/blog-platform-docs/adding-content).

**A typo in a link is caught as a 404, not as a broken page.** But note what is *not* checked: nothing verifies that a link written inside a post's prose points at a real address. A link to /blog-platform-docs/does-not-exist will build happily and 404 for the reader. When you write internal links in a post, click them.

## Internal and external links in prose

The renderer sorts links into three kinds in v0/www/app/(blog)/components/markdown.tsx, using a test defined in markdown-utils.ts:

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

Redirects live in v0/www/next.config.ts. This publication is the worked example, because it has been renamed twice. It began as blog-tech under a /publications prefix, became blog-platform, and is now blog-platform-docs. Every one of those addresses still resolves.

Four rules cover the first rename:

~~~ts
{ source: "/blog-tech/:postId", destination: "/blog-platform/:postId", permanent: true },
{ source: "/blog-tech", destination: "/blog-platform", permanent: true },
{ source: "/publications/blog-tech/:postId", destination: "/blog-platform/:postId", permanent: true },
{ source: "/publications/blog-tech", destination: "/blog-platform", permanent: true },
~~~

Two more cover the second:

~~~ts
{ source: "/blog-platform/:postId", destination: "/blog-platform-docs/:postId", permanent: true },
{ source: "/blog-platform", destination: "/blog-platform-docs", permanent: true },
~~~

Notice that the first set still points at blog-platform, which is no longer a real publication. That is deliberate, and it is the useful lesson in this example: **redirects chain.** A request for /blog-tech/design-tokens is forwarded to /blog-platform/design-tokens, the browser follows it, and the second set forwards it again to /blog-platform-docs/design-tokens. Two hops, one working page.

Rewriting the old rules to point straight at the current name would save a hop, but every rename would then mean editing every rule that had ever pointed at the old one. Letting them chain means each rename adds rules and never edits them, which is far harder to get wrong.

There is one exception in the file. Three rules handle posts that were renamed *and* whose publication then moved, and those do point straight at the final address:

~~~ts
{ source: "/blog-platform/markdown-components",
  destination: "/blog-platform-docs/markdown-reference", permanent: true },
~~~

They have to sit above the general /blog-platform/:postId rule. A source matches on path alone and the first matching rule wins, so listed after it, an old slug would be forwarded to a publication that has no post by that name.

Two more rules handle the dropped prefix for every other publication:

~~~ts
{ source: "/publications/:pubId/:postId", destination: "/:pubId/:postId", permanent: true },
{ source: "/publications/:pubId", destination: "/:pubId", permanent: true },
~~~

Note the ordering. The specific blog-tech rules come before the general prefix rules, because the first matching rule wins. Listed the other way round nothing would break outright — /publications/blog-tech would be stripped to /blog-tech, which is itself a redirect source, and the chain above would still get there — but every request would pay an extra hop. Keeping specific rules first keeps every historical address within at most three hops.

permanent set to true sends a 308, which tells browsers and search engines the move is final and lets them update their records.

### Moving a query parameter into the path

The browse page is the second worked example, and it shows a case the publication rename does not: an old address that differed only by its query string.

The content type used to be a query parameter. /browse?content=publications is now /browse/publications, and four rules cover the move:

~~~ts
{ source: "/browse", has: [{ type: "query", key: "content", value: "publications" }],
  destination: "/browse/publications", permanent: true },
{ source: "/browse", has: [{ type: "query", key: "content", value: "authors" }],
  destination: "/browse/authors", permanent: true },
{ source: "/browse", has: [{ type: "query", key: "content", value: "posts" }],
  destination: "/browse/posts", permanent: true },
{ source: "/browse", destination: "/browse/posts", permanent: true },
~~~

Two things to take from that.

**A source matches the path only.** All four rules have the same source, and the query is matched separately through has. This is why the bare rule has to come last: listed first, it would match every request to /browse regardless of query, and someone following an old link to the authors tab would land on posts.

**The query string survives the redirect.** An old link to /browse?content=authors arrives at /browse/authors?content=authors. The parameter is now meaningless, and the page ignores it, but it stays in the address. Stripping it would need middleware, which is not worth writing for something a reader will not notice.

### Renaming a publication

1. Change pubId in the publication's file, and rename its directory to match.
2. Add two redirects: one for the publication itself, one for its posts using the :postId placeholder.
3. If the old ID was also reachable under a prefix or an even older name, add rules for those too, and put them above any general rule that could swallow them.
4. Search the content directory for the old ID. Links written inside post prose are plain text and will not be updated by the compiler. They will still work through the redirect, but an internal link should point at the current address.
5. Run build, then open the old address and confirm it lands in the right place.

### Renaming a post slug

Same shape, one rule instead of two. This one is real, and sits in the file:

~~~ts
{ source: "/online-presence/three-ways-to-build-a-blog",
  destination: "/online-presence/build-your-own-blog", permanent: true }
~~~

There is no safety net here. As explained above, the post's numeric ID is not a working address, so the redirect is the only thing keeping the old link alive. Write it in the same change as the rename, not afterwards.

The second live example is Working with the platform, renamed from "A tour of the platform" on 2026-08-04; its rule forwards /blog-platform-docs/start-here. Both old addresses still resolve.

A rename is rarely one line, because a title turns up in more places than the slug does. That one touched seven things: the slug and title in the publication file, the first-level heading at the top of the post body, the post's own filename and the name it exports, two links in the prose of other posts, the cover image, and this rule. The cover matters most and is missed most easily, because the title is drawn into the picture — a renamed post keeping its old cover shows the old title to everyone who shares it. Covers are generated, so a rename means running the generator again for a new file, never editing the old one in place.

Nothing checks any of this. Grep for the old slug and the old title separately before you finish, because a link written in prose and a title baked into an image will not fail a build.

### Removing a publication or post

Deleting content leaves its address returning 404 — the styled page covered in [Feeds, crawlers, and the 404 page](/blog-platform-docs/feeds-and-crawlers). If the piece existed publicly for any length of time, redirect it somewhere sensible instead: the publication it belonged to, or /browse/posts. A redirect to a real page is nearly always better for a reader than a dead end.

Setting isDraft on something already published removes its address the same way, so it needs the same treatment. Add a redirect if the address was public for any length of time, and check whether another post links to it in prose, because nothing validates those links.

## When a path is not enough

Every helper in content/routes.ts returns a path beginning with a slash, which is what a link inside the site needs. Two things need the whole address, host and all: the link previews social networks read, and the share links on the post and publication pages. Neither can do anything with a path on its own.

The host lives in v0/www/lib/site.ts, once, as siteOrigin, with absoluteUrl beside it to join the two halves:

~~~tsx
absoluteUrl(postHref(publication.pubId, post))
~~~

Note the shape of that call. routes.ts still decides what the path looks like; site.ts only puts a host in front of it. Never assemble a path inside absoluteUrl, and never write the host anywhere else. It was written twice for a while, in the layout and in the share links, which is exactly how two copies of a hostname start to disagree.

It is a constant rather than a setting read at run time because pages are built ahead of time, so the value has to be known during the build. That also gives the right answer on a preview deployment: a link shared from a preview points at the live post, not at an address that stops working next week.

## Rules of thumb

- Choose the slug carefully at the start. It is the address, and changing it costs a redirect forever.
- Never delete a redirect. The file only grows, and that is correct. Old links live in other people's bookmarks, feeds, and search results.
- Keep specific rules above general ones.
- Build paths by calling the helpers in content/routes.ts, never by writing a string. Where a full address is needed, wrap one of those calls in absoluteUrl.
- After any rename, check the old address by hand. A redirect that does not fire looks exactly like a working site until someone follows an old link.
`

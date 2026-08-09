export const feedsAndCrawlers = `
# Feeds, crawlers, and the 404 page

Most readers arrive through a page. Three other consumers arrive through machine-readable addresses: feed readers, search engine crawlers, and whoever follows a dead link. This post covers the four pieces that serve them — the RSS feed, the sitemap, the robots file, and the 404 page — and why none of them needs maintaining when content changes.

## The three addresses

| Address | What it serves |
| --- | --- |
| /feed.xml | An RSS feed of every published post, newest first |
| /sitemap.xml | Every address on the site, for search engines |
| /robots.txt | Crawl permissions, and a pointer to the sitemap |

All three are built from the registry at build time, exactly like the pages. That single fact does most of the work of this post: they list what the site serves and nothing else, drafts are already gone before any of them is generated, and adding or removing a post updates all three on the next build with nothing to remember. See [The content contract](/blog-platform-docs/content-contract) for why the registry is the only door.

## The feed

The feed lives at v0/www/app/feed.xml/route.ts. It is a route handler forced static, so it is rendered once during the build and served as a file.

Each entry carries the post's title, address, date, and excerpt. The body is not included: excerpts are the searchable, shareable summary everywhere else on the site, and the feed follows that. A reader who wants the post follows the link.

Entries are ordered by the updated date when a post has one, the created date otherwise, so a revised post resurfaces. The address in each entry is built by the same route helpers as every link on the site, wrapped in absoluteUrl, because a feed entry has to carry a full address. See [URLs, slugs, and redirects](/blog-platform-docs/urls-and-redirects).

## The sitemap and the robots file

Both use the framework's file conventions: v0/www/app/sitemap.ts and v0/www/app/robots.ts export a description, and the build turns each into the file crawlers expect.

The sitemap lists the landing page, the three browse indexes, every publication, every post, and every author page. Posts and publications carry a last-modified date, the updated field when one is set and created otherwise — one more reason to set updated when revising a post.

The robots file allows everything and points at the sitemap. There is nothing to hide: a draft has no address at all, which is a stronger guarantee than asking crawlers to stay away from one.

## The 404 page

Every content route refuses unknown addresses, so a mistyped path, a drafted post, or a removed page all land on one page: v0/www/app/not-found.tsx. It is a styled page with two ways onward, the landing page and the browse index, rather than the framework's unstyled default.

It is worth knowing how much traffic this page can quietly receive. Nothing validates links written in post prose, so a broken internal link sends readers here rather than failing a build. If the 404 page starts appearing in analytics, the cause is usually a missing redirect — see [URLs, slugs, and redirects](/blog-platform-docs/urls-and-redirects) for the fix.

## What changes when content changes

Nothing, and that is the design. Publish a post and the next build adds it to the feed and the sitemap. Draft one and it leaves both, the same build that removes its address. The only manual habit worth keeping: set the updated field when you revise a post, because the feed and the sitemap both read it.

## Limits, stated plainly

- The feed carries excerpts, not full bodies. A full-content feed would mean rendering Markdown to HTML inside the feed, which nothing else needs.
- There is one feed for the whole site. Per-publication feeds would be easy to add if a publication ever deserves its own audience.
- Nothing advertises the feed: no visible link in the footer and no discovery tag in the page head yet. A feed reader has to be handed /feed.xml directly.
`

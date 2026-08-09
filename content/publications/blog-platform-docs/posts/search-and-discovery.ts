export const searchAndDiscovery = `
# Search, tags, and discovery

Readers find things on this blog in one of three ways: the browse page, the search box inside a publication, or a link from somewhere else. This post explains what those searches actually look at, because the answer changes how you should write a post's metadata.

The headline fact, stated first because everything follows from it: **post bodies are not searched.** Nothing indexes the writing itself. If a word is not in a post's title, excerpt, tags, publication name, or author name, no search on this blog will find it.

## The browse page

The browse page shows one of three kinds of thing at a time: posts, publications, or authors. Each is its own address:

~~~text
/browse/posts
/browse/publications
/browse/authors
~~~

These are the only three. The content type is a path segment, so an unrecognised one such as /browse/drafts is a 404 rather than a page showing something unexpected. A request for /browse on its own redirects to /browse/posts.

Each of the three is built ahead of time, like every other page on the blog, and each has its own page title and description.

Nothing else about the view is in the address. The search text and the selected tags are held in the page while you use it, and are forgotten as soon as you leave. A reader who has filtered down to something interesting cannot send that view to anyone; they can only send the content type. Worth knowing before you tell someone to "search for X on the browse page".

Two things are remembered rather than forgotten: the card-or-list layout and the sort order. The layout is stored in the browser under 11blog:view-mode and shared by every list on the site, so choosing list on the browse page also gives you list inside a publication, on this visit and the next. The sort choices are stored the same way; the Sorting section below covers them. These are a reader's preferences rather than part of a view worth sharing, which is why they live in the browser and not the address.

Because the pages are built ahead of time, the server cannot know that preference, so a stored choice of list is briefly drawn as cards before the page corrects itself. See [How pages are rendered](/blog-platform-docs/rendering-model).

This used to be a query parameter, written /browse?content=posts. Those addresses still work, and still land on the right tab. See [URLs, slugs, and redirects](/blog-platform-docs/urls-and-redirects).

## What each search looks at

Each content type searches a different set of fields:

| Searching | Fields matched, in this order |
| --- | --- |
| Posts | Title, excerpt, publication title, every author's name and display name, tags |
| Publications | Title, description, synopsis, tags |
| Authors | Name, display name, bio, tags, post count |

Two of those are easy to miss. Searching posts matches the **publication name**, so typing "blog platform docs" returns every post in Blog platform docs. And searching posts matches **author names**, so typing an author's name works from the posts view without switching to authors.

Searching authors matches the post count as text, which is an accident of how the search text is assembled rather than a feature. Typing 3 in the authors view will match an author who has written three posts.

## How matching works

The search is a plain substring test. All the fields above are joined together with spaces into one string — empty fields are dropped first — both that string and your query are lowercased, and the trimmed query has to appear somewhere inside it. A query of only spaces therefore matches everything.

Three consequences follow.

**Partial words match.** Typing sys finds Systems. There is no requirement to type a whole word.

**Word order matters, and so does field order.** A query of more than one word only matches if those words sit next to each other in the joined text. Because tags are joined in the order the post lists them, a post tagged Systems then Operations matches a query of "systems operations", and the same post would not match "operations systems".

**A match can cross a field boundary.** The joined string has no separators beyond spaces, so a query made of the last word of an excerpt plus the first word of the publication title will match. This is rare and harmless, but it explains the occasional surprising result.

What the search does not do: no ranking, no word stemming (searching "system" finds "systems" only because it is a substring, not because it understands plurals), no spelling tolerance, and no handling of quoted phrases.

## Tag filters combine with AND

Tags are the only filter the blog offers, and selecting more than one narrows rather than widens. Two selected tags means items carrying **both**. Three means all three. This empties out quickly, which is intended for finding something specific and unhelpful for browsing.

Tag matching is exact, and that includes capitals. Which leads to the one real trap in this system:

**Tags that differ only in capitals become two separate filters.** The validator stops you using both Systems and systems on the same post, but nothing stops one post using Systems and another using systems. The filter list would then show both, each finding only its own half of the posts.

The list of available tags is the set of tags used by whatever content type you are viewing, sorted alphabetically. So the tags offered when browsing posts are the tags on posts, and switching to publications offers a different list. Any selected tag that does not exist in the new list is dropped.

There is no tag page and no way to link to a tag. A tag is a filter inside the browse page, not an address.

## Sorting

There are two sets of options, because the three content types do not sort on the same things. You cannot order a post by how many posts it has.

### Posts and publications

Five options. Newest first is the default.

- **Newest first** and **Oldest first** sort by the created date.
- **Last updated** sorts by the updated date, most recently revised first. Most posts have never been revised and carry no updated date, so those fall back to their created date. The practical effect: on content nobody has edited, this option produces the same order as Newest first, rather than pushing unrevised posts to the bottom or leaving them out.
- **A-Z** and **Z-A** sort by title.

These five are one remembered choice, shared between the browse page and a publication's own post list. Sort a publication's posts A-Z and the browse page is A-Z when you get there.

### Authors

Four options. Most posts is the default.

- **Most posts** and **Least posts** sort by how many posts the author has written. Counts tie easily with a short author list, so both fall back to the name when they do, and the order stays stable rather than depending on where the author sits in the file.
- **A-Z** and **Z-A** sort by name.

Authors keep their own remembered choice, separate from the one above. Changing the author order does not disturb how posts are sorted, and the reverse.

### Where the choice lives

Both are stored in the browser, under 11blog:content-sort and 11blog:author-sort, alongside the layout preference at 11blog:view-mode. All three run through the same small store, so each is shared by every list on the page, survives navigation, and follows along in other tabs.

Because the pages are built ahead of time, the server cannot know any of them, so a stored choice shows for one frame as the default before the page corrects itself. See [How pages are rendered](/blog-platform-docs/rendering-model).

### The option that used to be here

Posts and publications once had another, **Relevance**, and it is worth recording why it went.

It ranked nothing. It returned items in the order the registry holds them, which is publication order and then the editorial order inside each publication. That is a real and useful ordering — it is the reading sequence a publication chose — but "Relevance" is not what it is called anywhere else on the web, and the label promised a ranking the code never performed. It also sat first in the list, so it was what a reader met before anything else.

The value still exists in the sort function, so the behaviour is reachable and could be offered again under a name that describes it, such as series order. It is simply no longer in the dropdown.

## Searching inside one publication

A publication page has its own search box, and it is deliberately narrower than the browse page. It matches only the **title, excerpt, and tags** of posts in that publication. It does not match the publication name, since every result shares it, and it does not match author names.

Its tag list is drawn only from that publication's posts. It offers the same five sort options, sharing both the option list and the sort function with the browse page. Alongside the posts, a row of section buttons switches to the publication's synopsis and editor notes, and each section is offered only if that field is filled in.

## The other ways in

Search is not the only route to a post.

The landing page lists recent posts and recent publications by created date, so a new post appears there on publication without anything being tagged or configured.

An author page lists everything that author has written, newest first, and it is linked from every byline. In practice this is the most reliable way to find a body of related work, since it does not depend on tags being consistent.

And the previous and next links at the foot of a post follow the publication's editorial order, which is the intended reading path through a series. See [The content contract](/blog-platform-docs/content-contract).

## What this means when you write

**Put the words a reader would type in the title.** It is the first field searched and the only one that also serves as the link text everywhere.

**Treat the excerpt as a search field, not just a summary.** It is the largest piece of searchable text a post has. An excerpt written only to sound good, using none of the terms someone would search for, makes the post harder to find.

**Reuse existing tags instead of inventing near-duplicates.** Documentation and Docs would be two separate filters covering half the posts each. Check what tags already exist before adding one, and match their capitalisation exactly.

**Do not rely on a term appearing in the body.** If a post is the place to learn about redirects, the word redirects belongs in the title, the excerpt, or a tag. The body is invisible to search.

**Give a post between two and four tags.** Tags are the filter facet, and one tag per post makes the filter useless while eight makes every tag mean nothing.

## Limits, and when they will start to hurt

The whole search is a filter running in the reader's browser over the list of previews already sent with the page. There is no index, no server, no pagination, and no query cost. At the current size that is the right trade: results appear as you type, and nothing has to be maintained.

It stops being right at the point where sending every preview to every reader becomes wasteful, or where results are numerous enough to need ranking. Two signs to watch for: a browse page that takes a moment to appear, and readers asking why the top result is not the obvious one. Neither is true yet.

Adding body search would mean either shipping every post body to the browser, which defeats the preview types entirely, or building an index at build time and shipping that. The second is the real option if it ever becomes necessary.
`

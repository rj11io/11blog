export const authorsAndBylines = `
# Authors and bylines

Every post on this blog names at least one author, and every author has a page listing their work. Authors are the one part of the content that is shared across publications, which makes the file that holds them the one place a small mistake shows up everywhere.

They all live in a single file: content/authors.ts.

## What an author is

~~~ts
{
  id: "rj11io",
  name: "Ricardo Jorge",
  displayName: "RJ",
  bio: "Designer and engineer working on calmer systems, practical interfaces, and durable product decisions.",
  avatar: "/static/blog-authors/rj-pic.png",
  tags: ["Systems", "Interfaces", "Product"],
  links: [
    { label: "Website", url: "https://rj11.io" },
    { label: "GitHub", url: "https://github.com/rj11io" },
  ],
}
~~~

| Field | Required | What it does |
| --- | --- | --- |
| id | Yes | The author's public address, at /authors/{id}. Lowercase letters, digits, and single hyphens. |
| name | Yes | The full name, used in bylines, page headings, and cards. |
| displayName | Yes | A short form. Doing two jobs; see below. |
| bio | Yes | One paragraph of plain text, shown on the author page and on every author card. |
| avatar | No | A photograph, as a path served by the site. Falls back to initials when absent. |
| tags | Yes | Subject tags, searchable and filterable in the authors view of browse. |
| links | No | External links, each a label and a full web address. |

Posts refer to an author by id, in their authorIds list. Nothing else connects them.

## displayName is doing two jobs

This is the field most likely to catch you out, because it is used in two very different ways.

First, it is the **avatar fallback**. When an author has no photograph, their displayName is drawn inside a small square: nine or twelve pixels of type on a byline, fourteen on a card, and much larger on the author page. It is sized as initials, so two or three characters is the working limit. Put a full name in there and it will overflow its square on every card on the site.

Second, it appears **in a sentence**. The author page heads its list of work with "Latest posts by" followed by the displayName, and the browse page shows it as a small badge. So the value also has to read acceptably in prose. "Latest posts by RJ" is fine. "Latest posts by R" is not.

Initials are the format that satisfies both jobs. The three current authors use RJ, MC, and SP.

## Photographs, and one gap

An avatar is a path to a file served by the site, so /static/blog-authors/rj-pic.png. Author photographs are the main reason that directory exists; see [Adding a publication or post](/blog-platform-docs/adding-content) for the layout.

Unlike a post's images, they are rendered with the optimising image component, at fixed sizes, cropped to fill a square.

**Nothing validates the path.** Cover images are checked for being root-relative or HTTPS, but the avatar field is not checked at all. A typo produces a broken image on the author page, every card, and every byline, and no command in the project will tell you. Open one author page after changing an avatar.

When there is no photograph the initials square appears instead, tinted with the accent colour. It is a deliberate design rather than a placeholder, so an author with no photograph does not look unfinished.

## Bios are plain text

The bio is rendered as a single paragraph. It is not passed through the Markdown renderer, so asterisks, links, and line breaks written into it will appear literally. If you need a link, use the links list.

The same bio appears in three places at three widths: the author page, the author card on the landing page, and the author result in browse. Two or three sentences works in all of them; a long bio pushes the cards out of alignment with their neighbours.

## Links

Each link is a label and a full web address, and both are validated. A label cannot be empty, and an address must be complete, using http or https. Writing example.com/notes fails the build; https://example.com/notes passes.

Links appear only on the author page, as a row of bordered buttons, opening in a new tab. There is no limit, but the row wraps, so four or five is the practical maximum before it stops reading as a row.

## Post counts are derived, not set

There is no field for how many posts an author has written. The registry counts them:

~~~ts
postCount: postPreviews.filter((post) =>
  post.authors.some((postAuthor) => postAuthor.id === author.id)
).length
~~~

So the count follows the posts and cannot disagree with them. It is shown on the author card, on the author page, and as a badge in browse, and it is one of the fields the authors search matches.

Ordering differs by surface: the landing page lists authors by post count, most first, with names breaking a tie; browse always lists them by name.

## Bylines

A post's authorIds is a list, and its order is preserved everywhere. First in the list is first in the byline. Nothing sorts it, so the order is an editorial decision you make per post.

On a post page the byline appears under "Written by" as a row of avatar-and-name links, one per author, each linking to that author's page.

In browse results the names are joined into a sentence:

| Authors | Rendered as |
| --- | --- |
| One | Ricardo Jorge |
| Two | Ricardo Jorge and 11ai |
| Three or more | A, B, and C |

Three or more uses a comma before the final "and".

## Publications have authors too

A publication has no author field, and it does not need one. Its authors are the people with a byline on at least one of its posts, collected by the registry, and they are shown exactly the way a post's authors are: the same byline component, the same "Written by" label, the same avatar-and-name links to each author page.

The order is by how many posts each person wrote, then by name when counts tie. So whoever wrote most of a publication appears first, and a publication written entirely by one person shows one name.

They are derived rather than declared because a field on the publication would be a second place for the same fact to live, and the two would eventually disagree. The cost of deriving is nothing to maintain: add a post with a new author and that author joins the publication's byline on the next build, and if you remove their last post they leave it.

Publication cards phrase it more briefly, matching post cards: "By" followed by the names.

## The rules the build enforces

- Every post needs at least one author.
- No author may appear twice on the same post.
- Every id in authorIds must exist in content/authors.ts.
- An author id must be a valid slug, and unique.
- name, displayName, and bio must all have text in them.
- Tags follow the usual rules: no blanks, no surrounding spaces, no duplicates within one list.
- Every link needs a non-empty label and a complete http or https address.

The full set of messages is in [Content validation rules](/blog-platform-docs/content-validation).

One rule is checked twice, in two different places, and the two messages look different. The validator names the post by its numeric ID:

~~~text
blog-platform-docs/402 references unknown author assistant-id
~~~

The registry checks again while resolving authors for display, and names the post by title:

~~~text
Adding a publication or post references unknown author assistant-id
~~~

Seeing the second form means the first check passed, which in practice means an author was removed from the file while a post still referenced them.

## Adding, renaming, and removing

**Adding** an author is one entry in content/authors.ts. Their page is generated on the next build, whether or not they have written anything.

That last part is worth knowing: an author with no posts still gets a page. It shows their details, a count of zero, and an empty list, with no message explaining the emptiness. Add the author in the same change as their first post and the question does not arise.

**Renaming** an author's id changes their public address, because the id is the URL. That needs a redirect, exactly like renaming a publication:

~~~ts
{ source: "/authors/old-id", destination: "/authors/new-id", permanent: true }
~~~

Changing the name, displayName, bio, or avatar costs nothing, since none of those are in the address.

**Removing** an author who has posts fails the build, with one of the two messages above. That is the right behaviour: it forces you to decide what happens to the writing rather than leaving posts pointing at nobody. Either reassign the posts to another author or remove them too.

## Checklist for a new author

1. Choose an id in lowercase with hyphens. It becomes their public address, so choose it as carefully as a post slug.
2. Set displayName to two or three characters, so it works as both an avatar and a name in a sentence.
3. Write a bio of two or three sentences, in plain text.
4. Add a photograph if you have one, then open the author page to confirm the path is right. Nothing validates it.
5. Give two or three subject tags, matching the capitalisation of tags already in use. See [Search, tags, and discovery](/blog-platform-docs/search-and-discovery).
6. Add external links with complete addresses.
7. Add them alongside their first post, so they never appear with an empty page.
8. Run typecheck, lint, and build.
`

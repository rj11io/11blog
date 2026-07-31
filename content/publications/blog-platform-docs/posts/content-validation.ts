export const contentValidation = `
# Content validation rules

Every publication, post, author, and image in this blog is checked against a set of rules before the site can be built. If a rule fails, the build stops with a message naming the exact field. Nothing reaches a page half-formed.

This post lists every rule, the message you will see when it fails, and what to change. The checks themselves live in content/validation.ts.

## When the check runs

The check is not a test you can choose to run. It happens while the content is being loaded.

content/registry.ts imports every publication and the author list, then calls the checker immediately:

~~~ts
export const publications: Publication[] = [
  signalPath,
  materialCulture,
  localWeather,
  blogPlatformDocs,
  onlinePresence,
]

export const blogAuthors: Author[] = authors

validatePublications(publications, blogAuthors)
~~~

Because that call sits at the top level of the module, it runs the first time anything actually executes the registry. Two things do that:

- **npm run build**, while it collects page data. A rule failure stops the build.
- **npm run dev**, when a page that reads the registry is first rendered. The failure appears in the terminal and in the browser.

One command does **not** catch these: npm run typecheck. It only checks types, and it never runs the code. A date written as 2026-02-30 is a perfectly valid string, so typecheck reports nothing and the build then fails with:

~~~text
Error: Failed to collect configuration for /[pubId]
  [cause]: Error: local-weather/315.created must be a real ISO date
~~~

The practical effect: after editing content, run build, or keep the dev server running and open the page. Typecheck alone will not tell you whether your content is valid.

## How to read a failure

Messages are built from a label that points at the thing being checked, followed by the problem.

A publication-level problem names the publication:

~~~text
local-weather.description must not be empty
~~~

A post-level problem names the publication, a slash, and the post's numeric ID:

~~~text
local-weather/302.created must use YYYY-MM-DD format
~~~

A problem inside a post's image configuration extends the same path:

~~~text
blog-platform-docs/401.images.workspace-overview.alt must not be empty
~~~

The checker throws on the first problem it finds and stops. If your content has three mistakes, you will see them one at a time, in order. Fix, re-run, repeat.

The order of checking is fixed: all authors first, then each publication in the order it appears in the registry array, and within a publication each post in the order it appears in the posts array.

## Shared checks

Five kinds of check are reused across the whole content set. Understanding these five explains most of the rules.

### Identifiers

Author IDs, publication IDs, and post slugs all use the same shape: lowercase letters and digits, in groups joined by single hyphens.

~~~text
^[a-z0-9]+(?:-[a-z0-9]+)*$
~~~

So local-weather and rj11io pass. Local-Weather, local_weather, -local-weather, and local--weather all fail. There are no underscores, no capitals, and no hyphen at either end.

This is the same string that appears in the URL, which is why the rule is strict.

### Dates

Every date is a plain calendar date written year first:

~~~text
^\\d{4}-\\d{2}-\\d{2}$
~~~

Passing the format check is not enough. The date is then parsed and converted back to text, and the result must match what you wrote. That second step rejects dates that look right but do not exist, such as 2026-02-30 or 2026-13-01.

When a post or publication has an updated date, it must not be earlier than its created date. The comparison is a plain text comparison, which works because this date format sorts correctly as text.

### Tags

Tags are checked three ways:

- No tag may be empty or only spaces.
- No tag may have a leading or trailing space. "Systems " fails; the checker will not silently trim it for you.
- No two tags in the same list may be the same, ignoring capitals. Adding both "Systems" and "systems" to one post fails.

### Web addresses

An author's link must be a complete web address using http or https. A partial address such as example.com/notes fails, because it cannot be turned into a working link.

### Image sources

Image sources follow a different, tighter rule than author links. A source either starts with a forward slash, meaning a file served from the site itself, or it is a complete https address. Plain http is rejected for images, and a bare filename is rejected.

So /static/blog-authors/rj-pic.png passes and https://images.example.com/photo.webp passes. http://images.example.com/photo.webp does not.

## Author rules

Authors live in content/authors.ts. For each author:

- The ID must be a valid identifier, as described above.
- No two authors may share an ID.
- name, displayName, and bio must all have text in them.
- Tags must pass the three tag checks.
- Each link must have a label with text in it, and a complete http or https address.

Link problems name the position in the list, counting from zero, so maya-chen.links[1].url points at the second link.

## Publication rules

For each publication:

- relId must be a whole number greater than zero, and no two publications may share one.
- pubId must be a valid identifier, and no two publications may share one.
- pubId must not be one of the reserved words authors, browse, or publications. Those three are real routes on the site, and a publication using them would be unreachable.
- title and description must have text in them.
- created must be a real date. updated, if present, must also be a real date and must not come before created.
- Tags must pass the three tag checks.
- coverImage, if present, must pass the image source rule.

The reserved-word rule is worth remembering when naming a new publication. A publication called "Browse" would need a different ID, such as browse-guide.

## Post rules

For each post inside a publication:

- postId must be a whole number greater than zero, and no two posts in the same publication may share one. Posts in different publications may reuse a number.
- slug is optional, but when present it must be a valid identifier and must be unique within the publication.
- title must have text in it.
- created must be a real date. updated, if present, must not come before created.
- The post must list at least one author.
- No author may be listed twice on the same post.
- Every author listed must exist in content/authors.ts.
- Tags must pass the three tag checks.
- coverImage, if present, must pass the image source rule.
- content must have text in it. A post with an empty body fails the build.

There is a second, later check on authors. The registry resolves each post's authors into display details, and if it cannot find one it throws a message naming the post by title rather than by ID. Seeing that form means the post passed the first check but the author disappeared afterwards, which normally means an author was deleted from content/authors.ts while a post still referenced them.

## Image rules

A post's named images are checked one by one. Each key must be a lowercase identifier, and may use hyphens, underscores, or colons as separators between groups. Colons are what make keys such as quilted:title-below possible.

Keep image keys lowercase. The renderer's own pattern for reading a shortcode accepts capitals, but the checker does not, so an uppercase key fails the build before it can ever be rendered.

For each image:

- src must pass the image source rule.
- thumbnailSrc, if present, must pass the same rule.
- width and height must both be whole numbers greater than zero. These reserve the right space on the page before the file arrives, so they are not optional.
- alt must have text in it. There is no way to configure an image without describing it.
- title and subtitle, if present, must have text in them. Leave them out rather than setting them to an empty string.
- credit, if present, must have a label with text and a complete http or https address.

## Image list rules

For each named image list:

- The key must follow the same lowercase identifier rule as image keys.
- The list must contain at least one image.
- ariaLabel, if present, must have text in it.
- Every image in the list is checked with the full set of image rules above, and failures name their position, such as .images[2].alt.

## Message reference

| Message | Cause | Fix |
| --- | --- | --- |
| rj11io: author id must be a URL-safe slug | Capitals, underscores, or stray hyphens in an author ID | Use lowercase letters, digits, and single hyphens |
| Duplicate author id: rj11io | Two authors share an ID | Give one of them a different ID |
| rj11io.bio must not be empty | A required text field is blank or only spaces | Write the field, or remove the author |
| rj11io.tags contains an empty tag | A tag is blank | Remove the empty entry |
| rj11io.tags must not contain surrounding whitespace | A tag has a leading or trailing space | Trim the tag |
| rj11io.tags contains duplicate tags | Two tags match, ignoring capitals | Remove one |
| rj11io.links[0].url must be an absolute HTTP URL | A link is missing its scheme, or uses one other than http or https | Write the full address |
| local-weather: relId must be a positive integer | relId is missing, zero, negative, or not a whole number | Use the next unused whole number |
| Duplicate publication relId: 3 | Two publications share a relId | Give the new publication an unused number |
| local-weather: pubId must be a URL-safe slug | Capitals or underscores in the publication ID | Use lowercase and hyphens |
| browse: pubId conflicts with a reserved route | The publication ID is authors, browse, or publications | Pick a different ID |
| Duplicate publication pubId: local-weather | Two publications share an ID | Rename one, and add redirects for the old URL |
| local-weather.description must not be empty | A required text field is blank | Write a short description |
| local-weather.created must use YYYY-MM-DD format | The date is written some other way | Rewrite it year first |
| local-weather.created must be a real ISO date | The date is correctly shaped but does not exist | Correct the day or month |
| local-weather.updated must not be before local-weather.created | The updated date is earlier than the created date | Correct whichever is wrong |
| local-weather.coverImage must be root-relative or use HTTPS | An image source uses http, or is a bare filename | Start it with a slash, or use https |
| local-weather: postId must be a positive integer | postId is missing, zero, or not a whole number | Use an unused whole number |
| local-weather: duplicate postId 302 | Two posts in one publication share a postId | Renumber one |
| local-weather/rain-map: invalid post slug | Capitals or underscores in the slug | Use lowercase and hyphens |
| local-weather: duplicate post slug rain-map | Two posts in one publication share a slug | Rename one, and add a redirect for the old URL |
| local-weather/302 must have at least one author | authorIds is empty | Add an author ID |
| local-weather/302 has duplicate author rj11io | The same author is listed twice | Remove the repeat |
| local-weather/302 references unknown author sam | The author ID does not exist in authors.ts | Correct the ID, or add the author |
| local-weather/302 has no content | The body is missing or empty | Write the body, or remove the post |
| blog-platform-docs/401.images.hero must use a shortcode-safe image key | An image key has capitals or unsupported characters | Use lowercase, with hyphens, underscores, or colons |
| blog-platform-docs/401.images.hero.width must be a positive integer | A dimension is missing, zero, or fractional | Read the real pixel dimensions and use them |
| blog-platform-docs/401.images.hero.alt must not be empty | An image has no description | Describe the image |
| blog-platform-docs/401.imageLists.gallery must contain at least one image | A configured list is empty | Add images, or remove the list |

## Fixing a failing build

1. Read the label. Everything before the first dot tells you which file to open.
2. Make one change.
3. Check it. The dev server is the fastest way: leave it running and reload the page. Otherwise run build.
4. Repeat until it passes.

If you are adding content in bulk, expect several rounds. The checker deliberately stops at the first problem rather than collecting them, which keeps each message unambiguous.

## Adding a rule

The checker is plain TypeScript with no schema library, so a new rule is a new function and a new call. Keep three habits:

- Write the message in the same shape as the existing ones: the label, then what is wrong, in lower case.
- Build the label from the pieces already in scope, so it points at one field.
- Add the rule to this post's reference table in the same change. A rule nobody can find is a rule that surprises people.
`

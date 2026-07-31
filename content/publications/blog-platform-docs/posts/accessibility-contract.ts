export const accessibilityContract = `
# Accessibility contract

This post records what the blog guarantees for readers using a screen reader, a keyboard, a high-contrast setting, or a reduced-motion setting. Most of it is already true in the code. It is written down so it stays true, because an accessibility guarantee that nobody has stated is one that quietly disappears during the next redesign.

It also lists what the blog does not yet do, at the end.

## What an author must provide

One accessibility rule is enforced by the build rather than left to good intentions: every configured image must be described.

The validator requires alt text on every named image and on every image in a gallery, and rejects an empty string. There is no way to add a configured image without describing it. See [Content validation rules](/blog-platform-docs/content-validation).

Two other author responsibilities are conventions rather than enforced rules:

**Use headings in order.** Second through fifth-level headings become the table of contents, and their nesting is what the sidebar's indentation shows. Skipping from a second-level heading to a fourth produces a table of contents that misrepresents the structure.

**Write link text that means something on its own.** "Read the format guide" works when read out of context. "Click here" does not.

## Headings and the table of contents

Second through fifth-level headings get an identifier, generated from the heading text. The sidebar links to those identifiers, and both the sidebar and the renderer generate them with the same shared function, so a link and its target cannot drift apart. Repeated headings get numbered identifiers rather than colliding.

Each heading carries a scroll margin so that jumping to it does not leave it hidden under the top of the window:

~~~tsx
<Tag id={id} data-blog-heading style={{ scrollMarginTop: CONTENT_HEADING_OFFSET }}>
~~~

The sidebar is a nav element with a label, and the current position is marked with aria-current set to location, which is the correct value for a location within a page rather than a page within a site.

Sixth-level headings render but are left out of the table of contents. Authors should treat the fifth level as the practical floor.

## Landmarks and navigation

Every page is a main element. The header holds a nav labelled "Primary navigation". The footer is a footer element.

Breadcrumbs are an ordered list inside a nav labelled "Breadcrumb". The current page carries aria-current set to page, and the separators between items are marked aria-hidden so a screen reader is not read a series of slashes:

~~~tsx
<li aria-hidden="true">/</li>
<li aria-current="page" className="max-w-56 truncate text-foreground">
  {post.title}
</li>
~~~

The previous and next links at the foot of a post sit in a nav labelled "Adjacent posts", so they are reachable directly rather than only by reading to the end.

## Controls report their own state

Interactive controls use the attribute that matches what they do, rather than being styled to look selected:

- The layout switcher is a pair of buttons using aria-pressed. The styling is driven from that attribute, with a class that responds to aria-pressed, so the visible state and the announced state cannot disagree.
- The filter toggle uses aria-expanded, again with styling driven from the attribute.
- Tag filters are buttons using aria-pressed.
- The content-type switcher on the browse page is a set of links, not buttons, because it changes the address. The selected one carries aria-current set to page.
- The tabs on a publication page use the tab role with aria-selected.

Every icon-only control has a text label. The layout buttons announce "List view" and "Card view"; the filter toggle announces "Show filters" or "Hide filters" depending on its state; the theme button announces "Switch to light mode" or "Switch to dark mode". Every decorative icon inside them is marked aria-hidden.

The share row is a group with a label, so a reader is told what the controls that follow are for before entering them, and each target names its destination rather than its logo: "Share on Bluesky", "Submit to Hacker News", "Share by email". The brand marks themselves are drawn with no title and marked aria-hidden, because the link around each one already says where it goes.

One control in that row is only sometimes there. The device share sheet button cannot be tested for until the page has loaded, so it is absent from the markup a reader first receives and appears afterwards, on the devices that have a share sheet. It is added next to the copy button, which is the honest cost of it: the six target links keep their position and their place in the focus order, and the copy button moves along the row to make room. Nothing above or below the row shifts, because the row does not change height.

Card links carry a label describing the destination rather than leaving a screen reader to assemble it from the card's contents:

~~~tsx
aria-label={"Read " + post.title + " in " + post.publicationTitle}
~~~

## Results are announced when they change

Filtering happens as you type, with no submit button, so the result count is a live region:

~~~tsx
<p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
  {resultCount} {resultCount === 1 ? contentType.slice(0, -1) : contentType}
</p>
~~~

polite means the count is read after the current announcement finishes rather than interrupting. The image viewer uses the same technique for its position counter.

Copying a link does the same thing, for a different reason. The button swaps its icon and its wording to confirm, and neither of those is announced on its own, so the outcome is written into a live region a reader cannot see. It reports failure as well as success: the clipboard needs a secure page and some privacy settings refuse it outright, and a button that silently does nothing is worse than one that says it could not.

The copy button on a code block does not do this yet. It changes its icon and its label and announces nothing, so a reader using a screen reader gets no confirmation that anything was copied. It should use the same live region.

The empty state is not just a message. It includes a button that clears the search text and the selected tags, so a reader who has filtered themselves into a corner has a way out that does not involve finding and emptying each control.

## Focus

Every interactive element in the codebase has a visible focus ring, using focus-visible so it appears for keyboard use without appearing on every mouse click. This is applied per element rather than globally, which means a new component needs it added; the base layer also sets a default outline colour as a safety net.

The image viewer returns focus where it came from. Opening it from a gallery records which thumbnail was used, and closing it puts focus back on that thumbnail:

~~~tsx
function handleLightboxOpenChange(open: boolean) {
  setLightboxOpen(open)

  if (!open) {
    window.requestAnimationFrame(() =>
      triggerRefs.current[activeIndex]?.focus()
    )
  }
}
~~~

The frame delay matters: the dialog has to finish closing before the element behind it can take focus. Note that focus returns to the image the reader ended on, not the one they started with, which is the right behaviour after browsing a gallery.

## Motion

The root element opts into smooth scrolling and then withdraws it when the reader has asked for reduced motion:

~~~tsx
className="scroll-smooth antialiased motion-reduce:scroll-auto"
~~~

Gallery thumbnails grow very slightly on hover, and that too is withdrawn:

~~~text
group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100
~~~

Colour-mode switching suppresses transitions entirely, so changing mode does not animate the whole page.

The general rule: any animation must have a reduced-motion form, and that form should be the effect happening instantly rather than not happening.

## Contrast

Text must measure at least 4.5 to 1 against every surface it sits on, in both colour modes.

The dark-mode accent colour exists because of this rule. The original deep green measured 2.6 to 1 against the dark background, and was replaced with a light mint measuring 9.2 to 1, with a dark foreground token for text sitting on an accent fill. The numbers are recorded in comments in the stylesheet, and the full reasoning is in [Design tokens and theming](/blog-platform-docs/design-tokens).

One token exists specifically to protect contrast: the badge surface is an opaque mix rather than a translucent tint, so a badge sitting on top of cover art keeps a known background rather than inheriting whatever the photograph provides.

## Images and galleries

Configured images have required descriptions, as above. Beyond that:

- Author photographs are decorative in context, because the author's name is right next to them. They carry an empty alt attribute, and the initials shown when there is no photograph are marked aria-hidden.
- The cover art collage on the landing page is marked aria-hidden as a whole. The same posts are linked properly further down the page, so nothing is lost.
- Generated cover art is marked aria-hidden. It carries no information.
- Galleries use list and listitem roles with an optional label from the content, so a reader is told how many images there are before entering.
- Each gallery thumbnail announces its position: "Open image 3 of 8", followed by the image's title or description.
- Video embeds carry a title on the frame.
- Task list checkboxes in Markdown are rendered read-only, so they can be read but not toggled into a state the content does not reflect.

## The image viewer

The viewer is the most interactive part of the blog, so it is worth listing what it provides:

- It is a dialog, with a title and a description that are visually hidden but read on opening. The description explains the available gestures, and mentions arrow-key browsing only when there is more than one image.
- Left and right arrow keys move between images.
- Every control has a text label: previous, next, zoom in, zoom out, reset zoom.
- Zoom buttons are properly disabled at the limits, rather than remaining active and doing nothing.
- The current zoom level is shown as a percentage, and that display is itself a button that resets the zoom.
- The position counter is a polite live region.
- Focus returns to the thumbnail on close.

## Known gaps

Stated plainly, because a contract with unstated gaps is misleading:

**There is no skip link.** A keyboard reader arriving on a post page passes through the header navigation, the GitHub link, and the theme button before reaching the content. The header is short, so the cost is small, but a link to jump to the main content is the standard fix and it is missing.

**The colour-mode hotkey is undiscoverable.** Pressing d switches mode, and nothing says so. The theme button's label describes what the button does, not the shortcut. Either announce it or accept it as an undocumented convenience.

**Heading order is not checked.** An author can skip from a second-level heading to a fourth and the build will pass, producing a table of contents that misrepresents the document. This is a rule the validator could enforce.

**Prose links are not checked.** A link inside a post's body pointing at an address that does not exist builds without complaint. See [URLs, slugs, and redirects](/blog-platform-docs/urls-and-redirects).

## When you add a component

1. Add a visible focus ring using focus-visible. It is per element, not global.
2. Give every icon-only control a text label, and mark the icon aria-hidden.
3. Use the attribute that matches the behaviour: aria-pressed for a toggle, aria-expanded for something that opens, aria-current for the current page or location. Then drive the styling from that attribute so the two cannot disagree.
4. If content changes without a page load, announce it with a polite live region.
5. If it animates, give it a reduced-motion form.
6. Check text contrast against every surface it can sit on, in both modes.
7. If it opens a layer, return focus to whatever opened it.
8. Try the whole thing with the keyboard alone before committing.
`

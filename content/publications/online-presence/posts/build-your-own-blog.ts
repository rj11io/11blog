export const buildYourOwnBlog = `
# Build your own blog

There is no single right way to put your work on the internet under your own name. There are roughly three, they cost very different amounts of time and money, and the honest answer to which one you should pick depends on how much of it you want to do yourself.

If you are still deciding whether it is worth the trouble at all, that argument is in [Own your platform](/online-presence/own-your-platform).

## Before any of them: buy the domain

Whichever route you take, start here, because it is the cheapest decision with the longest consequences.

A domain costs roughly the price of a couple of coffees a year. It is the only part of your online presence that stays yours across every change of host, framework, and publishing tool you will ever make. Every route below assumes you have one.

Buy it before you need it. You can point it at whatever you are using today and change your mind later, which is precisely the point.

## The three routes at a glance

| | Do it yourself | Do it together | Have it done |
| --- | --- | --- | --- |
| Time to first post | An evening to several weekends | An afternoon | A conversation |
| Money | Free to a monthly fee | Domain only | A project fee |
| Technical skill | Some to a lot | Comfortable editing files | None |
| You maintain it | Yes | Yes | By arrangement |
| Best when | You want control, or enjoy the building | You want to own it without starting from zero | You need something specific and want it right |

## One: do it yourself

Pick whatever tools you are comfortable with and build it.

This splits into two genuinely different situations, and the trade is opposite in each.

**A hosted product.** WordPress.com, Ghost, Squarespace, Substack, Bear, Mataroa. You are writing within the hour, the editor is good, and someone else handles uptime. This is a completely reasonable choice and most people telling you otherwise are selling an alternative.

The cost is specific rather than moral. You are inside somebody's product decisions: their themes, their post format, their limits on what a page can be. Getting out later means an export whose contents you should check *before* you rely on it, and a set of addresses that will not survive the move unless you own the domain. Which is why you own the domain.

**Rolling your own.** Any static site generator, any framework, any host. Total control over every detail, and no vendor to be surprised by.

The cost here is also specific: you build everything. Not just the pages, but the content model, the Markdown handling, the code highlighting, the images, the metadata for link previews, the accessibility work, the redirect handling when you rename something. Each piece is small. There are a lot of pieces, and the ones nobody warns you about are the ones that take the weekends: the second time you rename a post and break every link to it, the first time you realise nothing validates your own content.

Pick this route if the building is part of the appeal. That is a good enough reason. It is a bad route to take by accident, expecting it to be quick.

## Two: do it together

This is the middle path, and it is the one this site exists to support.

Take the 11blog boilerplate, make it yours, and deploy it:

~~~text
github.com/rj11io/blog-boilerplate
~~~

It is the same platform this site runs on, under the Apache License 2.0. You get the content model, the Markdown renderer with code highlighting and image galleries, the browse and search pages, light and dark themes, link previews, and a validator that refuses to build if your content is malformed — the pieces that would otherwise be your weekends.

What you do: fork it, replace the content directory with your own writing, change the colours and the wordmark, point your domain at it, and deploy. Vercel's free tier is enough to run it; a static blog costs nothing to serve at any reasonable readership.

What you keep: everything. The writing is a directory of plain files in your repository. The renderer is replaceable, by design, and nothing about the content depends on it. If you outgrow the platform or simply dislike it, you take the files and go.

The documentation is this site's other publication, written for exactly this: [Working with the platform](/blog-platform-docs/working-with-the-platform) maps it, and fourteen posts cover writing, extending, theming, and operating it. It is the same documentation I use to run this blog, which is the only kind worth trusting.

You need to be comfortable editing files in a repository and running a couple of commands. You do not need to know the framework, and you do not need to design anything.

## Three: have it done

If you want something more than a good blog — a specific design, a migration off an existing platform with all the addresses preserved, custom features, integration with something you already run — that is a project rather than a fork.

That is what I do. Get in touch:

~~~text
www.rj11.io
~~~

Worth saying plainly: you should not need this to have a blog. Routes one and two cover most people, and I would rather you took one of them than paid for something you did not need. Route three is for when the requirements are real and specific.

## Picking

If you have never published anything, take a hosted product today and buy the domain. Writing regularly is a harder problem than hosting, and it is the one worth solving first.

If you have been writing for a while, on a platform, and the thought of losing the archive bothers you, take route two. That discomfort is the correct signal and it does not go away on its own.

If you know exactly what you want and it is not any of the above, route three.

None of these is a life sentence. That is the whole reason to own the domain and keep the writing as files: whichever you pick, the next decision stays yours.
`

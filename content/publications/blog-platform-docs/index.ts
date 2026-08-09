import type { Publication } from "../../types"
import { accessibilityContract } from "./posts/accessibility-contract"
import { workingWithThePlatform } from "./posts/working-with-the-platform"
import { addingContent } from "./posts/adding-content"
import { authorsAndBylines } from "./posts/authors-and-bylines"
import { contentContract } from "./posts/content-contract"
import { contentValidation } from "./posts/content-validation"
import { designTokens } from "./posts/design-tokens"
import { extendingTheRenderer } from "./posts/extending-the-renderer"
import { feedsAndCrawlers } from "./posts/feeds-and-crawlers"
import { markdownReference } from "./posts/markdown-reference"
import { renderingModel } from "./posts/rendering-model"
import { runningTheBlog } from "./posts/running-the-blog"
import { searchAndDiscovery } from "./posts/search-and-discovery"
import { supportingThePlatform } from "./posts/supporting-the-platform"
import { urlsAndRedirects } from "./posts/urls-and-redirects"

import publicationCover from "./assets/blog-platform-og-cover-v3.png"
import workingWithThePlatformCover from "./assets/working-with-the-platform-og-cover-v3.png"
import addingContentCover from "./assets/adding-content-og-cover-v3.png"
import contentValidationCover from "./assets/content-validation-og-cover-v3.png"
import searchAndDiscoveryCover from "./assets/search-and-discovery-og-cover-v3.png"
import authorsAndBylinesCover from "./assets/authors-and-bylines-og-cover-v3.png"
import contentContractCover from "./assets/content-contract-og-cover-v3.png"
import renderingModelCover from "./assets/rendering-model-og-cover-v3.png"
import extendingTheRendererCover from "./assets/extending-the-renderer-og-cover-v3.png"
import designTokensCover from "./assets/design-tokens-og-cover-v3.png"
import accessibilityContractCover from "./assets/accessibility-contract-og-cover-v3.png"
import urlsAndRedirectsCover from "./assets/urls-and-redirects-og-cover-v3.png"
import runningTheBlogCover from "./assets/running-the-blog-og-cover-v3.png"
import supportingThePlatformCover from "./assets/supporting-the-platform-og-cover-v3.png"

export const blogPlatformDocs: Publication = {
  relId: 4,
  pubId: "blog-platform-docs",
  title: "Blog platform docs",
  description:
    "The complete documentation for 11blog: writing posts, the content contract, extending the renderer, and running the site.",
  created: "2026-07-01",
  updated: "2026-08-09",
  isNSFW: false,
  isNew: false,
  isFeatured: false,
  isDraft: true,
  tags: ["Blog", "Technology", "Publishing", "Documentation"],
  synopsis:
    "Fifteen posts covering the platform end to end: how to add a publication or post, every Markdown form the renderer supports, the rules the build enforces, why the writing lives outside the web application, how pages are rendered, and how to extend, theme, and operate the whole thing. Start with Working with the platform, which maps the rest by what you are trying to do. This is also the manual for the 11blog boilerplate, so anything here applies to a copy you run yourself.",
  editorNotes:
    "Written inside the system it describes, which is the point: every post here is rendered by the platform it documents, so a broken claim shows up as a broken page. Read the post that covers a thing before changing that thing, and update it in the same commit.",
  // Editorial order, which is what the previous and next links follow. It runs
  // oldest to newest, so "next" always moves forward in time and "previous"
  // always moves back: author, understand, extend, operate, then the entry point,
  // then the reader-facing support post as the newest.
  //
  // The listing sorts by date newest-first, so it reads as the exact reverse of
  // this array, and whatever was written last lands at the top. That used to be
  // the tour, which was the point; the support post now sits above it. The tour
  // is still the second card and still links to every post directly, so nothing
  // is unreachable, but if the tour needs to be first again the fix is to
  // backdate the support post rather than to reorder this array. Keeping the
  // array oldest-to-newest is what makes the previous and next links mean
  // something.
  posts: [
    {
      postId: 402,
      slug: "adding-content",
      title: "Adding a publication or post",
      excerpt:
        "How to add a publication or post using the blog's content format, with a checklist for each.",
      created: "2026-07-01",
      updated: "2026-08-09",
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["Markdown", "Publishing", "Documentation"],
      content: addingContent,
      coverImage: addingContentCover.src,
    },
    markdownReference,
    {
      postId: 403,
      slug: "content-validation",
      title: "Content validation rules",
      excerpt:
        "Every rule the content checker enforces, the message it throws, and what to change when it fails.",
      created: "2026-07-03",
      updated: "2026-08-09",
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["Validation", "Content", "Documentation"],
      content: contentValidation,
      coverImage: contentValidationCover.src,
    },
    {
      postId: 411,
      slug: "search-and-discovery",
      title: "Search, tags, and discovery",
      excerpt:
        "What the blog's searches actually look at, why post bodies are not among them, and how tags behave.",
      created: "2026-07-04",
      updated: "2026-08-09",
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["Discovery", "Content", "Documentation"],
      content: searchAndDiscovery,
      coverImage: searchAndDiscoveryCover.src,
    },
    {
      postId: 412,
      slug: "authors-and-bylines",
      title: "Authors and bylines",
      excerpt:
        "The author record, the two jobs its display name does, and what happens when you rename or remove one.",
      created: "2026-07-05",
      updated: "2026-08-09",
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["Authors", "Content", "Documentation"],
      content: authorsAndBylines,
      coverImage: authorsAndBylinesCover.src,
    },
    {
      postId: 404,
      slug: "content-contract",
      title: "The content contract",
      excerpt:
        "Why the writing lives outside the web application, what the boundary guarantees, and how to put a different front end in front of it.",
      created: "2026-07-06",
      updated: "2026-08-09",
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["Architecture", "Content", "Documentation"],
      content: contentContract,
      coverImage: contentContractCover.src,
    },
    {
      postId: 405,
      slug: "rendering-model",
      title: "How pages are rendered",
      excerpt:
        "Static pages, server components, the few interactive islands, and why content images use plain image elements.",
      created: "2026-07-07",
      updated: "2026-08-09",
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["Rendering", "Performance", "Architecture", "Documentation"],
      content: renderingModel,
      coverImage: renderingModelCover.src,
    },
    {
      postId: 406,
      slug: "extending-the-renderer",
      title: "Extending the renderer",
      excerpt:
        "The five-step recipe behind the blog's shortcodes, the directive path for containers, and how to add one of your own.",
      created: "2026-07-08",
      updated: "2026-08-09",
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["Rendering", "Markdown", "Documentation"],
      content: extendingTheRenderer,
      coverImage: extendingTheRendererCover.src,
    },
    {
      postId: 407,
      slug: "design-tokens",
      title: "Design tokens and theming",
      excerpt:
        "The named values behind the interface, the two that carry measured reasoning, and what to do when you add a component.",
      created: "2026-07-09",
      updated: "2026-08-09",
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["Design", "Theming", "Interface", "Documentation"],
      content: designTokens,
      coverImage: designTokensCover.src,
    },
    {
      postId: 408,
      slug: "accessibility-contract",
      title: "Accessibility contract",
      excerpt:
        "What the blog guarantees for keyboard, screen reader, contrast, and reduced-motion readers, and the gaps that remain.",
      created: "2026-07-10",
      updated: "2026-08-09",
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["Accessibility", "Interface", "Documentation"],
      content: accessibilityContract,
      coverImage: accessibilityContractCover.src,
    },
    {
      postId: 409,
      slug: "urls-and-redirects",
      title: "URLs, slugs, and redirects",
      excerpt:
        "How addresses are built and resolved, and the runbook for renaming a publication or post without breaking old links.",
      created: "2026-07-11",
      updated: "2026-08-09",
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["Routing", "Operations", "Documentation"],
      content: urlsAndRedirects,
      coverImage: urlsAndRedirectsCover.src,
    },
    {
      postId: 410,
      slug: "running-the-blog",
      title: "Running and releasing the blog",
      excerpt:
        "Starting the site, the checks to run before committing, and how a commit message becomes a release.",
      created: "2026-07-12",
      updated: "2026-08-09",
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["Operations", "Release", "Documentation"],
      content: runningTheBlog,
      coverImage: runningTheBlogCover.src,
    },
    {
      postId: 415,
      slug: "feeds-and-crawlers",
      title: "Feeds, crawlers, and the 404 page",
      excerpt:
        "The RSS feed, the sitemap, the robots file, and the 404 page: what serves the site's machine readers, and why none of it needs maintaining.",
      created: "2026-08-09",
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["Operations", "Discovery", "Documentation"],
      content: feedsAndCrawlers,
    },
    {
      postId: 413,
      slug: "working-with-the-platform",
      title: "Working with the platform",
      excerpt:
        "What the platform is, what it deliberately is not, and which post to read for whatever you are trying to do.",
      created: "2026-07-13",
      updated: "2026-08-09",
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["Documentation", "Blog", "Publishing"],
      content: workingWithThePlatform,
      coverImage: workingWithThePlatformCover.src,
    },
    {
      postId: 414,
      slug: "supporting-the-platform",
      title: "Supporting the platform",
      excerpt:
        "Three ways to help this blog keep going: pass a post on, sponsor one, or support the work directly.",
      created: "2026-07-31",
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["Support", "Community", "Documentation"],
      content: supportingThePlatform,
      coverImage: supportingThePlatformCover.src,
    },
  ],
  coverImage: publicationCover.src,
}

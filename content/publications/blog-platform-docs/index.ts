import type { Publication } from "../../types"
import { accessibilityContract } from "./posts/accessibility-contract"
import { startHere } from "./posts/start-here"
import { addingContent } from "./posts/adding-content"
import { authorsAndBylines } from "./posts/authors-and-bylines"
import { contentContract } from "./posts/content-contract"
import { contentValidation } from "./posts/content-validation"
import { designTokens } from "./posts/design-tokens"
import { extendingTheRenderer } from "./posts/extending-the-renderer"
import { markdownReference } from "./posts/markdown-reference"
import { renderingModel } from "./posts/rendering-model"
import { runningTheBlog } from "./posts/running-the-blog"
import { searchAndDiscovery } from "./posts/search-and-discovery"
import { supportingThePlatform } from "./posts/supporting-the-platform"
import { urlsAndRedirects } from "./posts/urls-and-redirects"

import publicationCover from "./assets/blog-platform-og-cover-v3.png"
import startHereCover from "./assets/start-here-og-cover-v2.png"
import addingContentCover from "./assets/adding-content-og-cover-v2.png"
import contentValidationCover from "./assets/content-validation-og-cover-v2.png"
import searchAndDiscoveryCover from "./assets/search-and-discovery-og-cover-v2.png"
import authorsAndBylinesCover from "./assets/authors-and-bylines-og-cover-v2.png"
import contentContractCover from "./assets/content-contract-og-cover-v2.png"
import renderingModelCover from "./assets/rendering-model-og-cover-v2.png"
import extendingTheRendererCover from "./assets/extending-the-renderer-og-cover-v2.png"
import designTokensCover from "./assets/design-tokens-og-cover-v2.png"
import accessibilityContractCover from "./assets/accessibility-contract-og-cover-v2.png"
import urlsAndRedirectsCover from "./assets/urls-and-redirects-og-cover-v2.png"
import runningTheBlogCover from "./assets/running-the-blog-og-cover-v2.png"
import supportingThePlatformCover from "./assets/supporting-the-platform-og-cover-v2.png"

export const blogPlatformDocs: Publication = {
  relId: 4,
  pubId: "blog-platform-docs",
  title: "Blog platform docs",
  description:
    "The complete documentation for 11blog: writing posts, the content contract, extending the renderer, and running the site.",
  created: "2026-07-01",
  updated: "2026-08-04",
  isNSFW: false,
  isNew: true,
  isFeatured: true,
  tags: ["Blog", "Technology", "Publishing", "Documentation"],
  synopsis:
    "Fourteen posts covering the platform end to end: how to add a publication or post, every Markdown form the renderer supports, the rules the build enforces, why the writing lives outside the web application, how pages are rendered, and how to extend, theme, and operate the whole thing. Start with A tour of the platform, which maps the rest by what you are trying to do. This is also the manual for the 11blog boilerplate, so anything here applies to a copy you run yourself.",
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
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: true,
      isFeatured: true,
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
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
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
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
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
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
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
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
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
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      tags: ["Rendering", "Performance", "Architecture"],
      content: renderingModel,
      coverImage: renderingModelCover.src,
    },
    {
      postId: 406,
      slug: "extending-the-renderer",
      title: "Extending the renderer",
      excerpt:
        "The five-step recipe behind the blog's shortcodes, and how to add one of your own.",
      created: "2026-07-08",
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      tags: ["Rendering", "Markdown", "Extending"],
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
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      tags: ["Design", "Theming", "Interface"],
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
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
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
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      tags: ["Routing", "URLs", "Operations"],
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
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      tags: ["Operations", "Release", "Tooling"],
      content: runningTheBlog,
      coverImage: runningTheBlogCover.src,
    },
    {
      postId: 413,
      slug: "start-here",
      title: "A tour of the platform",
      excerpt:
        "What the platform is, what it deliberately is not, and which post to read for whatever you are trying to do.",
      created: "2026-07-13",
      authorIds: ["rj11io", "11ai"],
      isNSFW: false,
      isNew: true,
      isFeatured: true,
      tags: ["Documentation", "Blog", "Publishing"],
      content: startHere,
      coverImage: startHereCover.src,
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
      isNew: true,
      isFeatured: false,
      tags: ["Support", "Community", "Documentation"],
      content: supportingThePlatform,
      coverImage: supportingThePlatformCover.src,
    },
  ],
  coverImage: publicationCover.src,
}

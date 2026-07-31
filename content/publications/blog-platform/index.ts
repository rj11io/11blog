import type { Publication } from "../../types"
import { accessibilityContract } from "./posts/accessibility-contract"
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
import { urlsAndRedirects } from "./posts/urls-and-redirects"

export const blogPlatform: Publication = {
  relId: 4,
  pubId: "blog-platform",
  title: "Blog Platform",
  description:
    "Technical notes on the blog's content model, renderer, and publishing system.",
  created: "2026-07-22",
  updated: "2026-07-31",
  isNSFW: false,
  isNew: true,
  isFeatured: true,
  tags: ["Blog", "Technology", "Publishing"],
  synopsis:
    "Blog Platform documents the systems behind this publication: content contracts, Markdown rendering, and the tools that make a small editorial collection dependable.",
  editorNotes:
    "Practical notes about the blog itself, written as part of the same publishing system described in the posts.",
  posts: [
    markdownReference,
    {
      postId: 402,
      slug: "adding-content",
      title: "Adding a publication or post",
      excerpt:
        "How to add a publication or post using the blog's content format, with a checklist for each.",
      created: "2026-07-22",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: true,
      isFeatured: true,
      tags: ["Markdown", "Publishing", "Documentation"],
      content: addingContent,
      coverImage: "https://picsum.photos/900"
    },
    {
      postId: 403,
      slug: "content-validation",
      title: "Content validation rules",
      excerpt:
        "Every rule the content checker enforces, the message it throws, and what to change when it fails.",
      created: "2026-07-31",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      tags: ["Validation", "Content", "Documentation"],
      content: contentValidation,
    },
    {
      postId: 411,
      slug: "search-and-discovery",
      title: "Search, tags, and discovery",
      excerpt:
        "What the blog's searches actually look at, why post bodies are not among them, and how tags behave.",
      created: "2026-07-31",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      tags: ["Discovery", "Content", "Documentation"],
      content: searchAndDiscovery,
    },
    {
      postId: 412,
      slug: "authors-and-bylines",
      title: "Authors and bylines",
      excerpt:
        "The author record, the two jobs its display name does, and what happens when you rename or remove one.",
      created: "2026-07-31",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      tags: ["Authors", "Content", "Documentation"],
      content: authorsAndBylines,
    },
    {
      postId: 404,
      slug: "content-contract",
      title: "The content contract",
      excerpt:
        "Why the writing lives outside the web application, what the boundary guarantees, and how to put a different front end in front of it.",
      created: "2026-07-31",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      tags: ["Architecture", "Content", "Documentation"],
      content: contentContract,
    },
    {
      postId: 405,
      slug: "rendering-model",
      title: "How pages are rendered",
      excerpt:
        "Static pages, server components, the few interactive islands, and why content images use plain image elements.",
      created: "2026-07-31",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      tags: ["Rendering", "Performance", "Architecture"],
      content: renderingModel,
    },
    {
      postId: 406,
      slug: "extending-the-renderer",
      title: "Extending the renderer",
      excerpt:
        "The five-step recipe behind the blog's shortcodes, and how to add one of your own.",
      created: "2026-07-31",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      tags: ["Rendering", "Markdown", "Extending"],
      content: extendingTheRenderer,
    },
    {
      postId: 407,
      slug: "design-tokens",
      title: "Design tokens and theming",
      excerpt:
        "The named values behind the interface, the two that carry measured reasoning, and what to do when you add a component.",
      created: "2026-07-31",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      tags: ["Design", "Theming", "Interface"],
      content: designTokens,
    },
    {
      postId: 408,
      slug: "accessibility-contract",
      title: "Accessibility contract",
      excerpt:
        "What the blog guarantees for keyboard, screen reader, contrast, and reduced-motion readers, and the gaps that remain.",
      created: "2026-07-31",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      tags: ["Accessibility", "Interface", "Documentation"],
      content: accessibilityContract,
    },
    {
      postId: 409,
      slug: "urls-and-redirects",
      title: "URLs, slugs, and redirects",
      excerpt:
        "How addresses are built and resolved, and the runbook for renaming a publication or post without breaking old links.",
      created: "2026-07-31",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      tags: ["Routing", "URLs", "Operations"],
      content: urlsAndRedirects,
    },
    {
      postId: 410,
      slug: "running-the-blog",
      title: "Running and releasing the blog",
      excerpt:
        "Starting the site, the checks to run before committing, and how a commit message becomes a release.",
      created: "2026-07-31",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      tags: ["Operations", "Release", "Tooling"],
      content: runningTheBlog,
    },
  ],
  coverImage: "https://picsum.photos/900"
}

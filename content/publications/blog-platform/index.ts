import type { Publication } from "../../types"
import { accessibilityContract } from "./posts/accessibility-contract"
import { contentContract } from "./posts/content-contract"
import { contentValidation } from "./posts/content-validation"
import { customComponents } from "./posts/custom-components"
import { designTokens } from "./posts/design-tokens"
import { markdownBlogFormat } from "./posts/markdown-blog-format"
import { markdownComponents } from "./posts/markdown-components"
import { renderingModel } from "./posts/rendering-model"
import { runningTheBlog } from "./posts/running-the-blog"
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
    markdownComponents,
    {
      postId: 402,
      slug: "markdown-blog-format",
      title: "Markdown Blog Format",
      excerpt:
        "How to add publications and posts using the blog's internal content and Markdown format.",
      created: "2026-07-22",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: true,
      isFeatured: true,
      tags: ["Markdown", "Publishing", "Documentation"],
      content: markdownBlogFormat,
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
      slug: "custom-components",
      title: "Adding a custom Markdown component",
      excerpt:
        "The five-step recipe behind the blog's shortcodes, and how to add one of your own.",
      created: "2026-07-31",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      tags: ["Rendering", "Markdown", "Extending"],
      content: customComponents,
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

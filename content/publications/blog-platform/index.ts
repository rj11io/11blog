import type { Publication } from "../../types"
import { markdownBlogFormat } from "./posts/markdown-blog-format"
import { markdownComponents } from "./posts/markdown-components"

export const blogPlatform: Publication = {
  relId: 4,
  pubId: "blog-platform",
  title: "Blog Platform",
  description:
    "Technical notes on the blog's content model, renderer, and publishing system.",
  created: "2026-07-22",
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
  ],
  coverImage: "https://picsum.photos/900"
}

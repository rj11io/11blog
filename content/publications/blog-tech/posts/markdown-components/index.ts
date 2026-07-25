import type { Post } from "../../../../types"

import content from "./markdown-components.md"
import { markdownComponentsImageLists } from "./markdown-components.images"

export const markdownComponents = {
  postId: 401,
  slug: "markdown-components",
  title: "Markdown components",
  excerpt:
    "A complete reference for the Markdown components supported by the blog renderer.",
  created: "2026-07-22",
  authorIds: ["rj11io"],
  isNSFW: false,
  isNew: true,
  isFeatured: false,
  tags: ["Markdown", "Rendering", "Documentation"],
  content,
  imageLists: markdownComponentsImageLists,
} satisfies Post

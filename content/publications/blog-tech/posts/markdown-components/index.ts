import type { Post } from "../../../../types"

import content from "./markdown-components.md"
import {
  markdownComponentsImageLists,
  markdownComponentsImages,
} from "./markdown-components.images"

export const markdownComponents = {
  postId: 401,
  slug: "markdown-components",
  title: "Markdown components",
  excerpt:
    "A complete reference for the Markdown components supported by the blog renderer.",
  created: "2026-07-22",
  authorIds: ["rj11io"],
  isNSFW: true,
  isNew: true,
  isFeatured: true,
  tags: ["Markdown", "Rendering", "Documentation"],
  content,
  images: markdownComponentsImages,
  imageLists: markdownComponentsImageLists,
} satisfies Post

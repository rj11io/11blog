import type { Publication } from "../../types"
import { aboutAiProductEngineering } from "./posts/about-ai-product-engineering"

export const aiProductEngineering: Publication = {
  relId: 10,
  pubId: "ai-product-engineering",
  title: "AI product engineering",
  description:
    "Engineering dependable AI products across architecture, evaluation, interfaces, operations, and failure handling.",
  created: "2026-08-04",
  isNSFW: false,
  isNew: true,
  isFeatured: false,
  tags: ["AI", "Product Engineering", "Systems"],
  posts: [
    {
      postId: 1001,
      slug: "about-ai-product-engineering",
      title: "About AI product engineering",
      excerpt:
        "A placeholder for practical notes on engineering dependable AI products.",
      created: "2026-08-04",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      tags: ["AI", "Product Engineering", "Introduction"],
      content: aboutAiProductEngineering,
    },
  ],
}

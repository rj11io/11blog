import type { Publication } from "../../types"
import { aboutAiBenchmarks } from "./posts/about-ai-benchmarks"

import publicationCover from "./assets/ai-benchmarks-og-cover-v1.png"

export const aiBenchmarks: Publication = {
  relId: 9,
  pubId: "ai-benchmarks",
  title: "AI benchmarks and analysis",
  description:
    "Repeatable evaluations of AI systems, with close analysis of results, limits, and product claims.",
  created: "2026-08-04",
  isNSFW: false,
  isNew: true,
  isFeatured: false,
  isDraft: false,
  tags: ["AI", "Benchmarks", "Analysis"],
  posts: [
    {
      postId: 901,
      slug: "about-ai-benchmarks",
      title: "About AI benchmarks and analysis",
      excerpt:
        "A placeholder for repeatable AI benchmarks and analysis of their results.",
      created: "2026-08-04",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      isDraft: false,
      tags: ["AI", "Benchmarks", "Introduction"],
      content: aboutAiBenchmarks,
    },
  ],
  coverImage: publicationCover.src,
}

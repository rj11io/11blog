import type { Publication } from "../../types"
import { aboutResearchAndDevelopment } from "./posts/about-research-and-development"

export const researchAndDevelopment: Publication = {
  relId: 14,
  pubId: "rnd",
  title: "Research and development",
  description:
    "Research notes and experiments for developing new ideas, tools, and systems.",
  created: "2026-08-09",
  isNSFW: false,
  isNew: false,
  isFeatured: false,
  isDraft: true,
  tags: ["Research", "Development", "Experiments"],
  posts: [
    {
      postId: 1401,
      slug: "about-research-and-development",
      title: "About research and development",
      excerpt:
        "A placeholder for research notes, experiments, and development work.",
      created: "2026-08-09",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["Research", "Development", "Introduction"],
      content: aboutResearchAndDevelopment,
    },
  ],
}

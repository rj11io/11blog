import type { Publication } from "../../types"
import { aboutAiSkillsSpotlight } from "./posts/about-ai-skills-spotlight"

export const aiSkillsSpotlight: Publication = {
  relId: 11,
  pubId: "ai-skills-spotlight",
  title: "AI skills spotlight",
  description:
    "Focused examinations of individual AI skills: their design, uses, strengths, and practical limits.",
  created: "2026-08-04",
  isNSFW: false,
  isNew: true,
  isFeatured: false,
  tags: ["AI", "Skills", "Analysis"],
  posts: [
    {
      postId: 1101,
      slug: "about-ai-skills-spotlight",
      title: "About AI skills spotlight",
      excerpt:
        "A placeholder for focused examinations of individual AI skills.",
      created: "2026-08-04",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      tags: ["AI", "Skills", "Introduction"],
      content: aboutAiSkillsSpotlight,
    },
  ],
}

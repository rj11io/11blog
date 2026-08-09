import type { Publication } from "../../types"
import { aboutAiTechForecast } from "./posts/about-ai-tech-forecast"

export const aiTechForecast: Publication = {
  relId: 13,
  pubId: "ai-tech-forecast",
  title: "AI tech forecast",
  description:
    "Practical forecasts about the technologies, capabilities, and shifts likely to shape AI work.",
  created: "2026-08-09",
  isNSFW: false,
  isNew: false,
  isFeatured: false,
  isDraft: true,
  tags: ["AI", "Forecasting", "Technology"],
  posts: [
    {
      postId: 1301,
      slug: "about-ai-tech-forecast",
      title: "About AI tech forecast",
      excerpt:
        "A placeholder for practical forecasts about the technologies and shifts shaping AI work.",
      created: "2026-08-09",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["AI", "Forecasting", "Introduction"],
      content: aboutAiTechForecast,
    },
  ],
}

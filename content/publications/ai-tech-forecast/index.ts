import type { Publication } from "../../types"
import { aboutAiTechForecast } from "./posts/about-ai-tech-forecast"
import { theRiseOfAiIn2023 } from "./posts/the-rise-of-ai-in-2023"

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
    // Ported from Medium, written 2023-01-03. Kept in its original voice: it is
    // a dated forecast, and rewriting it in the house register would quietly
    // launder what was actually claimed at the time. The created date carries
    // the age; the body says nothing about being an archive.
    //
    // Last in the array, so it reads second. It is also the oldest post here,
    // so the newest-first listing puts it second too. Both agree today. Adding
    // anything dated between 2023 and 2026 breaks that agreement.
    {
      postId: 1302,
      slug: "the-rise-of-ai-in-2023",
      title: "The rise of AI in 2023",
      excerpt:
        "Written the week AI went mainstream: why ChatGPT won on accessibility, how GPT, Copilot, and MidJourney changed a working day, and who actually gets displaced.",
      created: "2023-01-03",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["AI", "Forecasting", "Adoption", "Work"],
      content: theRiseOfAiIn2023,
    },
  ],
}

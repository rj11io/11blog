import type { Publication } from "../../types"
import { aboutAiCoachingAdvisory } from "./posts/about-ai-coaching-advisory"

// No covers yet, on the publication or its post. Both fields are optional, and
// the cards and pages fall back to a generated monogram, so nothing needs a
// placeholder image in the meantime.
export const aiCoachingAdvisory: Publication = {
  relId: 12,
  pubId: "ai-coaching-advisory",
  title: "AI coaching, consultancy, and advisory",
  description:
    "Helping people and organisations work with AI: coaching, consulting on specific problems, and advising on the decisions that are hard to reverse.",
  created: "2026-08-05",
  isNSFW: false,
  isNew: true,
  // Draft until there is a real post in it. This hides the publication and
  // everything inside it, which is why the post below can be left published: one
  // edit here reveals the whole thing when it is ready.
  isDraft: true,
  isFeatured: false,
  tags: ["AI", "Coaching", "Advisory"],
  posts: [
    {
      postId: 1201,
      slug: "about-ai-coaching-advisory",
      title: "About AI coaching, consultancy, and advisory",
      excerpt:
        "A placeholder for notes on coaching, consulting, and advising on AI work.",
      created: "2026-08-05",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      isDraft: false,
      tags: ["AI", "Coaching", "Introduction"],
      content: aboutAiCoachingAdvisory,
    },
  ],
}

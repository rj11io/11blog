import type { Publication } from "../../types"
import { aboutProjectPostmortems } from "./posts/about-project-postmortems"

export const projectPostmortems: Publication = {
  relId: 6,
  pubId: "project-postmortems",
  title: "Project postmortems",
  description:
    "Honest reviews of completed projects: what worked, what failed, and what changed afterwards.",
  created: "2026-08-04",
  isNSFW: false,
  isNew: true,
  isFeatured: false,
  tags: ["Projects", "Retrospectives", "Lessons Learned"],
  posts: [
    {
      postId: 601,
      slug: "about-project-postmortems",
      title: "About Project postmortems",
      excerpt:
        "A placeholder for future reviews of completed projects and the lessons they produced.",
      created: "2026-08-04",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      tags: ["Projects", "Retrospectives", "Introduction"],
      content: aboutProjectPostmortems,
    },
  ],
}

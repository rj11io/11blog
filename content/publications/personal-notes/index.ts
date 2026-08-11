import type { Publication } from "../../types"
import { aboutPersonalNotes } from "./posts/about-personal-notes"
import { jobHuntingLandscape } from "./posts/job-hunting-landscape"
import { jobHuntingLandscapeImages } from "./posts/job-hunting-landscape.images"

import publicationCover from "./assets/personal-notes-og-cover-v1.png"

export const personalNotes: Publication = {
  relId: 8,
  pubId: "personal-notes",
  title: "Personal notes",
  description:
    "Personal thoughts, diary entries, and observations collected without forcing them into a tutorial or case study.",
  created: "2026-08-04",
  isNSFW: false,
  isNew: false,
  isFeatured: false,
  isDraft: true,
  tags: ["Personal", "Diary", "Reflections"],
  posts: [
    {
      postId: 801,
      slug: "about-personal-notes",
      title: "About Personal notes",
      excerpt:
        "A placeholder for personal thoughts, diary entries, and observations.",
      created: "2026-08-04",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["Personal", "Diary", "Introduction"],
      content: aboutPersonalNotes,
    },
    // Ported from Medium, written 2025-05-17, kept in its original voice. The
    // created date carries the age; the body says nothing about being an
    // archive. Same treatment as The rise of AI in 2023 in ai-tech-forecast.
    //
    // No headings in the original, so none were invented. The table of contents
    // is empty for this post by design.
    //
    // Slug shortened from the Medium one, which ran to 79 characters. Nothing
    // links to the old address from inside this repo, and Medium keeps serving
    // its own, so no redirect is owed.
    {
      postId: 802,
      slug: "job-hunting-landscape",
      title:
        "Yes, the current job hunting landscape is a mess, here's how you can play around it",
      excerpt:
        "500+ applications, under 5 interviews, and the same automated rejection every time. What actually worked instead: cold DMs, referrals, and a personal brand you start today.",
      created: "2025-05-17",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["Personal", "Job Hunting", "Careers", "Work"],
      content: jobHuntingLandscape,
      images: jobHuntingLandscapeImages,
    },
  ],
  coverImage: publicationCover.src,
}

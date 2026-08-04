import type { Publication } from "../../types"
import { aboutPersonalNotes } from "./posts/about-personal-notes"

import publicationCover from "./assets/personal-notes-og-cover-v1.png"

export const personalNotes: Publication = {
  relId: 8,
  pubId: "personal-notes",
  title: "Personal notes",
  description:
    "Personal thoughts, diary entries, and observations collected without forcing them into a tutorial or case study.",
  created: "2026-08-04",
  isNSFW: false,
  isNew: true,
  isFeatured: false,
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
      isNew: true,
      isFeatured: false,
      tags: ["Personal", "Diary", "Introduction"],
      content: aboutPersonalNotes,
    },
  ],
  coverImage: publicationCover.src,
}

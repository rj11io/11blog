import type { Publication } from "../../types"
import { buildYourOwnBlog } from "./posts/build-your-own-blog"
import { ownYourPlatform } from "./posts/own-your-platform"

// v3 redraws all three through 11brands v1. The v2 set was the last thing still
// coming from the retired generator in v0/branding, which no longer runs.
import publicationCover from "./assets/online-presence-og-cover-v3.png"
import buildYourOwnBlogCover from "./assets/build-your-own-blog-og-cover-v3.png"
import ownYourPlatformCover from "./assets/own-your-platform-og-cover-v3.png"

export const onlinePresence: Publication = {
  relId: 5,
  pubId: "online-presence",
  title: "Build an online presence",
  description:
    "Building and owning your online presence: why a site of your own beats a rented platform, and three ways to get one.",
  created: "2026-07-14",
  updated: "2026-10-03",
  isNSFW: false,
  isNew: false,
  isFeatured: false,
  isDraft: true,
  tags: ["Online Presence", "Publishing", "Independence"],
  synopsis:
    "Two posts on putting your work on the internet under your own name. Start with Build your own blog for three practical routes and their costs in time, money, and control. Then read Own your platform for the case for portability and the dependencies that ownership still leaves in place.",
  editorNotes:
    "For anyone whose work lives somewhere they do not control. Technical documentation for the platform behind the middle route: Blog platform docs. Index exception: these two interconnected draft articles do not need a separate guide; revisit when the series grows.",
  // Two interconnected draft articles need no separate guide yet.
  // Array order is the reading sequence; keep actual dates for sorted cards.
  posts: [
    {
      postId: 502,
      slug: "build-your-own-blog",
      title: "Build your own blog",
      excerpt:
        "Do it yourself, do it together by forking the 11blog repository, or have it done. What each route costs in time, money, and control.",
      created: "2026-07-15",
      // Renamed from "Three ways to build your own blog" on 2026-08-02, which
      // moved the address as well as the title. See the redirect in
      // v0/www/next.config.ts.
      updated: "2026-08-02",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["Online Presence", "Publishing", "Getting Started"],
      content: buildYourOwnBlog,
      coverImage: buildYourOwnBlogCover.src,
    },
    {
      postId: 501,
      slug: "own-your-platform",
      title: "Own your platform",
      excerpt:
        "What actually goes wrong when your work lives on someone else's platform, and the smaller, truer claim about what owning your own buys.",
      created: "2026-07-15",
      updated: "2026-07-30",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["Online Presence", "Independence", "Publishing"],
      content: ownYourPlatform,
      coverImage: ownYourPlatformCover.src,
    },
  ],
  coverImage: publicationCover.src,
}

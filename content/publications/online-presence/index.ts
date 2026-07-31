import type { Publication } from "../../types"
import { ownYourPlatform } from "./posts/own-your-platform"
import { threeWaysToBuildABlog } from "./posts/three-ways-to-build-a-blog"

import publicationCover from "./assets/online-presence-og-cover-v1.png"
import ownYourPlatformCover from "./assets/own-your-platform-og-cover-v1.png"
import threeWaysCover from "./assets/three-ways-to-build-a-blog-og-cover-v1.png"

export const onlinePresence: Publication = {
  relId: 5,
  pubId: "online-presence",
  title: "Build an online presence",
  description:
    "How to build and own your online presence: why a site of your own beats a rented platform, and three ways to get one.",
  created: "2026-07-14",
  updated: "2026-07-15",
  isNSFW: false,
  isNew: true,
  isFeatured: true,
  tags: ["Online Presence", "Publishing", "Independence"],
  synopsis:
    "Two posts on putting your work on the internet under your own name. The first makes the case, without the usual overreach: owning a site does not make you invulnerable, because you still depend on a registrar, a host, and a CDN. What it buys you is portability, which is a smaller claim and a real one. The second is practical, comparing three routes by what they cost in time, money, and control.",
  editorNotes:
    "Written for anyone whose work lives somewhere they do not control. The technical documentation for the platform behind the middle route lives in Blog Platform Docs.",
  // Reading order runs argument first, then options, which is also the order a
  // reader arrives in. Dates descend with that order so the entry point is the
  // newest post and therefore heads the default newest-first listing.
  posts: [
    {
      postId: 501,
      slug: "own-your-platform",
      title: "Own your platform",
      excerpt:
        "What actually goes wrong when your work lives on someone else's platform, and the smaller, truer claim about what owning your own buys you.",
      created: "2026-07-15",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: true,
      isFeatured: true,
      tags: ["Online Presence", "Independence", "Publishing"],
      content: ownYourPlatform,
      coverImage: ownYourPlatformCover.src,
    },
    {
      postId: 502,
      slug: "three-ways-to-build-a-blog",
      title: "Three ways to build your own blog",
      excerpt:
        "Do it yourself, do it together with the 11blog boilerplate, or have it done. What each route costs in time, money, and control.",
      created: "2026-07-14",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: true,
      isFeatured: false,
      tags: ["Online Presence", "Publishing", "Getting Started"],
      content: threeWaysToBuildABlog,
      coverImage: threeWaysCover.src,
    },
  ],
  coverImage: publicationCover.src,
}

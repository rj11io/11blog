import type { Metadata } from "next"

import { rootSection } from "@content/registry"

import { BlogLanding } from "./components/pages/blog-landing"

export const metadata: Metadata = {
  title: "11blog",
  description:
    "Independent publications about projects, technology, AI, personal notes, publishing, and online presence.",
}

/** The site's own blog: the root section's landing, with the site's own copy. */
export default function HomePage() {
  return (
    <BlogLanding
      section={rootSection}
      hero={{
        eyebrow: "Independent publications",
        title: "Field notes, kept in public.",
        description:
          "A collection of publications about projects, technology, AI, personal notes, publishing, and online presence. Each one is a short series, written slowly and left here to be read in any order.",
      }}
    />
  )
}

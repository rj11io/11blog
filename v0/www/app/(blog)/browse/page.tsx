import type { Metadata } from "next"
import { Suspense } from "react"

import { Browse } from "../components/browse"
import { authorPreviews, postPreviews, publicationPreviews } from "@content/registry"

export const metadata: Metadata = {
  title: "Browse",
  description:
    "Browse independent publications exploring systems, objects, places, and the tools behind the collection.",
}

export default function BrowsePage() {
  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
        <Suspense>
          <Browse
            authors={authorPreviews}
            posts={postPreviews}
            publications={publicationPreviews}
          />
        </Suspense>

      </div>
    </main>
  )
}

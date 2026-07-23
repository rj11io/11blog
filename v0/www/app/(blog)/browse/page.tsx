import type { Metadata } from "next"
import { Suspense } from "react"

import { Browse } from "../components/browse"
import {
  authorPreviews,
  postPreviews,
  publicationPreviews,
} from "@content/registry"

export const metadata: Metadata = {
  title: "Browse",
  description:
    "Browse independent publications exploring systems, objects, places, and the tools behind the collection.",
}

export default function BrowsePage() {
  return (
    <main className="min-h-svh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-primary uppercase">
            The complete collection
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_0.55fr] lg:items-end">
            <h1 className="editorial-display text-6xl leading-none tracking-[-0.06em] sm:text-7xl">
              Library
            </h1>
            <p className="max-w-lg leading-7 text-muted-foreground">
              Browse every essay, publication, and contributor in the 11blog
              archive.
            </p>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
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

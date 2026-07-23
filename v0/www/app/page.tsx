import type { Metadata } from "next"
import Link from "next/link"
import { ArrowDown, ArrowUpRight } from "lucide-react"

import { allPosts, publicationPreviews, postPreviews } from "@content/registry"

export const metadata: Metadata = {
  title: "Independent notes on systems, objects, and places",
  description:
    "A small independent journal about the systems we build, the objects we keep, and the places we return to.",
}

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00Z`))
}

function authorNames(post: (typeof postPreviews)[number]) {
  return post.authors.map((author) => author.name).join(" · ")
}

export default function HomePage() {
  const featured =
    postPreviews.find((post) => post.slug === "quiet-systems") ??
    postPreviews[0]
  const latest = [...postPreviews]
    .filter((post) => post.href !== featured.href)
    .sort((a, b) => b.created.localeCompare(a.created))
    .slice(0, 3)

  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 h-full w-px bg-border"
        />
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[minmax(0,1.55fr)_minmax(20rem,0.65fr)]">
          <div className="px-5 pt-16 pb-12 sm:px-8 sm:pt-24 sm:pb-16 lg:border-r lg:border-border lg:px-10 lg:pt-28 lg:pb-20">
            <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em] text-primary uppercase">
              <span className="size-1.5 rounded-full bg-primary" />
              Independent journal · Lisbon
            </p>
            <h1 className="editorial-display mt-8 max-w-4xl text-[clamp(3.8rem,9vw,8.6rem)] leading-[0.82] tracking-[-0.075em] text-balance">
              Notes for the quietly curious.
            </h1>
          </div>

          <div className="flex flex-col justify-end px-5 py-10 sm:px-8 lg:px-10 lg:py-16">
            <p className="max-w-md text-lg leading-8 text-muted-foreground">
              Essays and field notes about how teams work, why objects last, and
              what familiar places reveal when we pay attention.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/browse"
                className="inline-flex h-12 items-center gap-3 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition hover:bg-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Enter the library
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
              <a
                href="#latest"
                className="inline-flex h-12 items-center gap-3 rounded-full border border-border px-6 text-sm font-semibold transition hover:border-foreground/40 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                Read the latest
                <ArrowDown aria-hidden="true" className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <Link
          href={featured.href}
          className="group grid overflow-hidden rounded-[2rem] bg-foreground text-background transition outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 lg:grid-cols-[0.72fr_1.28fr]"
        >
          <div className="flex min-h-72 flex-col justify-between border-b border-background/15 p-7 sm:p-10 lg:min-h-[32rem] lg:border-r lg:border-b-0">
            <div className="flex items-start justify-between gap-6">
              <span className="text-[11px] font-semibold tracking-[0.22em] text-background/60 uppercase">
                Featured dispatch
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </div>
            <div>
              <p className="text-sm text-background/60">
                {featured.publicationTitle}
              </p>
              <p className="editorial-display mt-3 text-8xl leading-none tracking-[-0.07em] text-primary-foreground/80 sm:text-9xl">
                01
              </p>
            </div>
          </div>

          <div className="flex min-h-[28rem] flex-col justify-between bg-primary p-7 text-primary-foreground sm:p-10 lg:min-h-[32rem] lg:p-12">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs tracking-[0.12em] uppercase">
              <time dateTime={featured.created}>
                {formatDate(featured.created)}
              </time>
              <span>{authorNames(featured)}</span>
            </div>
            <div className="max-w-3xl">
              <h2 className="editorial-display text-5xl leading-[0.95] tracking-[-0.055em] text-balance sm:text-7xl">
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p className="mt-7 max-w-xl text-base leading-7 text-primary-foreground/75 sm:text-lg sm:leading-8">
                  {featured.excerpt}
                </p>
              )}
              <span className="mt-9 inline-flex items-center gap-3 border-b border-primary-foreground/40 pb-1 text-sm font-semibold">
                Read the dispatch
                <span aria-hidden="true">↗</span>
              </span>
            </div>
          </div>
        </Link>
      </section>

      <section
        id="latest"
        className="scroll-mt-24 border-y border-border bg-card"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-primary uppercase">
                New in the library
              </p>
              <h2 className="editorial-display mt-4 text-5xl tracking-[-0.05em] sm:text-6xl">
                Latest notes
              </h2>
            </div>
            <Link
              href="/browse?content=posts"
              className="hidden items-center gap-2 border-b border-foreground/40 pb-1 text-sm font-semibold transition hover:border-primary hover:text-primary sm:flex"
            >
              View all posts
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <div className="mt-10 divide-y divide-border border-y border-border">
            {latest.map((post, index) => (
              <article key={post.href}>
                <Link
                  href={post.href}
                  className="group grid gap-4 py-7 transition outline-none hover:px-2 focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[4rem_11rem_1fr_auto] sm:items-center sm:gap-6 sm:py-8"
                >
                  <span className="editorial-display text-3xl text-muted-foreground/55">
                    {String(index + 2).padStart(2, "0")}
                  </span>
                  <div className="text-xs text-muted-foreground">
                    <p className="font-semibold text-primary">
                      {post.publicationTitle}
                    </p>
                    <time className="mt-1 block" dateTime={post.created}>
                      {formatDate(post.created)}
                    </time>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.025em] text-balance sm:text-2xl">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="hidden size-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary sm:block"
                  />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.58fr_1.42fr]">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-primary uppercase">
              The collection
            </p>
            <h2 className="editorial-display mt-4 max-w-sm text-5xl leading-none tracking-[-0.05em] sm:text-6xl">
              Four ways of looking closer.
            </h2>
            <p className="mt-6 max-w-sm leading-7 text-muted-foreground">
              Each publication follows a recurring line of inquiry, from
              operational systems to the shape of everyday life.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[2rem] border border-border bg-border sm:grid-cols-2">
            {publicationPreviews.map((publication) => (
              <Link
                key={publication.pubId}
                href={publication.href}
                className="group flex min-h-64 flex-col justify-between bg-card p-7 transition outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="editorial-display text-5xl text-primary/45">
                    {String(publication.relId).padStart(2, "0")}
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.03em]">
                    {publication.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {publication.description}
                  </p>
                  <p className="mt-5 text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
                    {publication.postCount}{" "}
                    {publication.postCount === 1 ? "essay" : "essays"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto grid max-w-7xl sm:grid-cols-3">
          {[
            [String(allPosts.length).padStart(2, "0"), "published notes"],
            [
              String(publicationPreviews.length).padStart(2, "0"),
              "ongoing publications",
            ],
            [
              String(
                new Set(allPosts.flatMap((post) => post.authorIds)).size
              ).padStart(2, "0"),
              "contributing voices",
            ],
          ].map(([value, label]) => (
            <div
              key={label}
              className="border-b border-border px-5 py-10 sm:border-r sm:border-b-0 sm:px-8 last:sm:border-r-0 lg:px-10"
            >
              <p className="editorial-display text-6xl tracking-[-0.06em] text-primary">
                {value}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-accent text-accent-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-14 sm:px-8 sm:py-16 lg:flex-row lg:items-end lg:px-10">
          <h2 className="editorial-display max-w-3xl text-5xl leading-[0.95] tracking-[-0.055em] sm:text-6xl">
            Take the long way through an interesting idea.
          </h2>
          <Link
            href="/browse"
            className="inline-flex h-12 shrink-0 items-center gap-3 rounded-full bg-accent-foreground px-6 text-sm font-semibold text-accent transition hover:opacity-85 focus-visible:ring-2 focus-visible:ring-accent-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-accent"
          >
            Browse the archive
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}

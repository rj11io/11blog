import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  authorPreviews,
  postPreviews,
  publicationPreviews,
} from "@content/registry"
import { browseHref } from "@content/routes"
import type { AuthorPreview } from "@content/types"

export const metadata: Metadata = {
  title: "11blog",
  description:
    "An independent editorial collection of field notes on systems, objects, places, and the tools behind them.",
}

const githubHref = "https://github.com/rj11io/11blog"

function GitHubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-current">
      <path d="M12 .297a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.26c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.84 1.23 1.84 1.23 1.07 1.84 2.8 1.31 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.94 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.65.25 2.87.13 3.17.76.84 1.22 1.91 1.22 3.22 0 4.61-2.81 5.63-5.48 5.93.43.37.81 1.1.81 2.22v3.28c0 .32.22.69.83.57A12 12 0 0 0 12 .297" />
    </svg>
  )
}

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00Z`))
}

function formatAuthorNames(authors: AuthorPreview[]) {
  if (authors.length === 1) return authors[0].name
  if (authors.length === 2) return `${authors[0].name} and ${authors[1].name}`

  return `${authors
    .slice(0, -1)
    .map((author) => author.name)
    .join(", ")}, and ${authors.at(-1)?.name}`
}

export default function HomePage() {
  const latestPosts = [...postPreviews]
    .sort((a, b) => b.created.localeCompare(a.created))
    .slice(0, 3)

  const sortedPublications = [...publicationPreviews].sort(
    (a, b) => a.relId - b.relId
  )

  const featuredPublications = sortedPublications.filter(
    (publication) => publication.isFeatured
  )
  const featuredPosts = [...postPreviews]
    .filter((post) => post.isFeatured)
    .sort((a, b) => b.created.localeCompare(a.created))
  const hasFeatured =
    featuredPublications.length > 0 || featuredPosts.length > 0

  return (
    <main className="bg-background">
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,var(--primary),transparent_88%),transparent_60%)]"
        />
        <div className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 sm:py-28 lg:px-10">
          <Badge variant="outline" className="mx-auto">
            An independent editorial collection
          </Badge>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            Field notes on systems, objects, places, and the tools that hold
            them together.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            11blog collects short, practical essays across a handful of small
            publications: how teams work, how things are made to last, and
            how places change when you look closely.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href={browseHref}>
                Browse the collection
                <ArrowRight aria-hidden="true" data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={githubHref} target="_blank" rel="noopener noreferrer">
                <span data-icon="inline-start">
                  <GitHubIcon />
                </span>
                View source
              </a>
            </Button>
          </div>
          <dl className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8">
            <div>
              <dt className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                Publications
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-foreground">
                {publicationPreviews.length}
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                Posts
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-foreground">
                {postPreviews.length}
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                Contributors
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-foreground">
                {authorPreviews.length}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {hasFeatured && (
        <section className="border-b border-border bg-primary/5">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
            <Badge>Featured</Badge>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Where to start
            </h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              A short list of publications and posts worth reading first.
            </p>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              {featuredPublications.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Publications
                  </h3>
                  <div className="mt-4 space-y-4">
                    {featuredPublications.map((publication) => (
                      <Link
                        key={publication.href}
                        href={publication.href}
                        aria-label={`Open publication ${publication.title}`}
                        className="group flex flex-col rounded-2xl border border-primary/25 bg-card p-6 outline-none transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-foreground/5 focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge>Featured</Badge>
                          <Badge variant="outline">
                            {publication.postCount} posts
                          </Badge>
                        </div>
                        <h4 className="mt-3 text-xl font-semibold tracking-tight text-card-foreground group-hover:text-primary">
                          {publication.title}
                        </h4>
                        <p className="mt-2 leading-7 text-muted-foreground">
                          {publication.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {featuredPosts.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Posts
                  </h3>
                  <div className="mt-4 space-y-4">
                    {featuredPosts.map((post) => (
                      <Link
                        key={post.href}
                        href={post.href}
                        aria-label={`Read ${post.title} in ${post.publicationTitle}`}
                        className="group flex flex-col rounded-2xl border border-primary/25 bg-card p-6 outline-none transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-foreground/5 focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge>Featured</Badge>
                          <span className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                            {post.publicationTitle}
                          </span>
                        </div>
                        <h4 className="mt-3 text-xl font-semibold tracking-tight text-card-foreground group-hover:text-primary">
                          {post.title}
                        </h4>
                        {post.excerpt && (
                          <p className="mt-2 leading-7 text-muted-foreground">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="mt-4 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                          <span className="truncate">
                            {formatAuthorNames(post.authors)}
                          </span>
                          <time dateTime={post.created} className="shrink-0">
                            {formatDate(post.created)}
                          </time>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Latest posts
            </h2>
            <p className="mt-2 text-muted-foreground">
              The newest essays across every publication.
            </p>
          </div>
          <Link
            href={browseHref}
            className="inline-flex items-center gap-1 text-sm font-semibold text-foreground transition hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            View all posts
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => (
            <Link
              key={post.href}
              href={post.href}
              aria-label={`Read ${post.title} in ${post.publicationTitle}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 outline-none transition hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-lg hover:shadow-foreground/5 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                {post.publicationTitle}
              </p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-card-foreground group-hover:text-primary">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">
                  {post.excerpt}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="truncate">
                  {formatAuthorNames(post.authors)}
                </span>
                <time dateTime={post.created} className="shrink-0">
                  {formatDate(post.created)}
                </time>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Publications
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Each publication is a small, focused collection with its own
            beat.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {sortedPublications.map((publication) => (
              <Link
                key={publication.href}
                href={publication.href}
                aria-label={`Open publication ${publication.title}`}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 outline-none transition hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-lg hover:shadow-foreground/5 focus-visible:ring-2 focus-visible:ring-ring sm:p-7"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-3xl font-semibold text-primary/35 tabular-nums">
                    {String(publication.relId).padStart(2, "0")}
                  </p>
                  {publication.isFeatured && <Badge>Featured</Badge>}
                  {publication.isNew && <Badge>New issue</Badge>}
                </div>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-card-foreground group-hover:text-primary">
                  {publication.title}
                </h3>
                <p className="mt-2 flex-1 leading-7 text-muted-foreground">
                  {publication.description}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline">
                    {publication.postCount} posts
                  </Badge>
                  {publication.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Who&apos;s writing
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          A small group of contributors, each with their own beat.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {authorPreviews.map((author) => (
            <Link
              key={author.href}
              href={author.href}
              aria-label={`Open author profile for ${author.name}`}
              className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center outline-none transition hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-lg hover:shadow-foreground/5 focus-visible:ring-2 focus-visible:ring-ring"
            >
              {author.avatar ? (
                <Image
                  src={author.avatar}
                  alt=""
                  width={64}
                  height={64}
                  className="size-16 rounded-full object-cover ring-1 ring-border"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="inline-flex size-16 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary ring-1 ring-primary/20"
                >
                  {author.displayName}
                </span>
              )}
              <h3 className="mt-3 font-semibold tracking-tight text-card-foreground group-hover:text-primary">
                {author.name}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                {author.bio}
              </p>
              <span className="mt-3 text-xs font-medium text-muted-foreground">
                {author.postCount} {author.postCount === 1 ? "post" : "posts"}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 py-16 text-center sm:px-8 sm:py-20 lg:px-10">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Ready to read the archive?
          </h2>
          <p className="max-w-xl text-muted-foreground">
            Search, filter, and sort every post, publication, and author in
            one place.
          </p>
          <Button asChild size="lg" className="mt-2">
            <Link href={browseHref}>
              Browse the collection
              <ArrowRight aria-hidden="true" data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

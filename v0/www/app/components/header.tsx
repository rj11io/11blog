import Link from "next/link"
import { GitFork } from "lucide-react"

import { ThemeToggle } from "./theme-toggle"

const githubHref = "https://github.com/rj11io/11blog"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/92 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:h-[4.5rem] lg:px-10">
        <nav
          aria-label="Primary navigation"
          className="flex items-center gap-7"
        >
          <Link
            href="/"
            aria-label="11blog home"
            className="group inline-flex items-center gap-3 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-foreground text-[11px] font-bold tracking-[-0.06em] text-background transition group-hover:bg-primary">
              11
            </span>
            <span className="text-sm font-bold tracking-[-0.025em]">
              11blog
            </span>
          </Link>
          <Link
            href="/browse"
            className="hidden text-sm text-muted-foreground transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:block"
          >
            Library
          </Link>
          <Link
            href="/browse?content=publications"
            className="hidden text-sm text-muted-foreground transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:block"
          >
            Publications
          </Link>
          <Link
            href="/browse?content=authors"
            className="hidden text-sm text-muted-foreground transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:block"
          >
            Contributors
          </Link>
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/browse"
            className="mr-1 inline-flex h-9 items-center rounded-full border border-border px-4 text-xs font-semibold transition hover:border-foreground/30 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:hidden"
          >
            Browse
          </Link>
          <a
            href={githubHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View 11blog on GitHub"
            title="View 11blog on GitHub"
            className="hidden size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:inline-flex"
          >
            <GitFork aria-hidden="true" className="size-4" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

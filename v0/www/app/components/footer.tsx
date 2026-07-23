import Link from "next/link"
import packageJson from "../../package.json"

const siteHref = "https://www.rj11.io/"

function SiteLink({ children }: { children: React.ReactNode }) {
  return (
    <a
      href={siteHref}
      target="_blank"
      rel="noopener noreferrer"
      className="transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {children}
    </a>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 sm:py-14 lg:grid-cols-[1fr_auto] lg:px-10">
        <div>
          <Link
            href="/"
            className="editorial-display text-4xl tracking-[-0.05em] focus-visible:ring-2 focus-visible:ring-background"
          >
            11blog
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-background/60">
            Independent notes on systems, objects, places, and the practices
            that help us see them more clearly.
          </p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm text-background/65 sm:grid-cols-3"
        >
          <Link className="hover:text-background" href="/browse">
            Library
          </Link>
          <Link
            className="hover:text-background"
            href="/browse?content=publications"
          >
            Publications
          </Link>
          <Link
            className="hover:text-background"
            href="/browse?content=authors"
          >
            Contributors
          </Link>
          <a
            className="hover:text-background"
            href="https://github.com/rj11io/11blog"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
          <SiteLink>rj11.io</SiteLink>
        </nav>
      </div>

      <div className="border-t border-background/15">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 text-[11px] tracking-[0.08em] text-background/45 uppercase sm:px-8 lg:px-10">
          <span>© 2026 rj11io</span>
          <span>Edition v{packageJson.version}</span>
        </div>
      </div>
    </footer>
  )
}

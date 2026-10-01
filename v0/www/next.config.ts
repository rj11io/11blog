import path from "node:path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The whole blog moved under /blog on 2026-10-01 (11brain task
      // 11blog-001). The site root is app/(main)/page.tsx: it forwards to the
      // blog on a single-section site and is the landing page of a sectioned
      // one, so no rule for / lives here.
      // Every address that existed before the move keeps working. Publications
      // used to sit at the top level, so a general /:pubId rule would also
      // swallow /blog itself, /feed.xml, /static and anything else at the root
      // (redirects run before the filesystem, public files included). The rule
      // therefore names the eleven publications that existed on the day of the
      // move. A publication created after it never had a root address, so it
      // needs no entry here.
      {
        source: "/browse/:content(posts|publications|authors)",
        destination: "/blog/browse/:content",
        permanent: true,
      },
      {
        source: "/authors/:authorId",
        destination: "/blog/authors/:authorId",
        permanent: true,
      },
      // The 11ai author was removed on 2026-10-01 (11brain task 11blog-002):
      // every post is written by RJ. An author id is a public address, so the
      // old page forwards to the author who took over the bylines. Sits below
      // the /authors rule above so an old root link chains through it.
      {
        source: "/blog/authors/11ai",
        destination: "/blog/authors/rj11io",
        permanent: true,
      },
      {
        source:
          "/:pubId(ai-benchmarks|ai-coaching-advisory|ai-product-engineering|ai-skills-spotlight|ai-tech-forecast|blog-platform-docs|online-presence|personal-notes|project-postmortems|rnd|tech-tutorials)/:postId",
        destination: "/blog/:pubId/:postId",
        permanent: true,
      },
      {
        source:
          "/:pubId(ai-benchmarks|ai-coaching-advisory|ai-product-engineering|ai-skills-spotlight|ai-tech-forecast|blog-platform-docs|online-presence|personal-notes|project-postmortems|rnd|tech-tutorials)",
        destination: "/blog/:pubId",
        permanent: true,
      },
      // Everything below predates the move. Each destination that named a live
      // address now carries the /blog prefix, so an old link lands in one hop.
      // Destinations that name an older, already-redirected address (the
      // /blog-tech rules pointing at /blog-platform) are left alone: they chain
      // into the rules above them, as the docs post on redirects explains.
      //
      // The browse page moved from a query parameter to a path segment on
      // 2026-07-31: /browse?content=publications became /browse/publications.
      //
      // The three query rules have to come first. A rule's source matches the
      // path only, so the bare /browse rule below would otherwise swallow every
      // one of them and send a request for the authors tab to the posts tab.
      {
        source: "/browse",
        has: [{ type: "query", key: "content", value: "publications" }],
        destination: "/blog/browse/publications",
        permanent: true,
      },
      {
        source: "/browse",
        has: [{ type: "query", key: "content", value: "authors" }],
        destination: "/blog/browse/authors",
        permanent: true,
      },
      {
        source: "/browse",
        has: [{ type: "query", key: "content", value: "posts" }],
        destination: "/blog/browse/posts",
        permanent: true,
      },
      // Bare /browse, and any unrecognised content value, land on the default
      // tab. This is also why no link inside the site points at /browse: every
      // one uses browseContentHref so navigation never pays for a redirect.
      {
        source: "/browse",
        destination: "/blog/browse/posts",
        permanent: true,
      },
      // "Three ways to build your own blog" became "Build your own blog" on
      // 2026-08-02. The post is unchanged; the title just said its own structure
      // out loud, which the first line of the post already does better.
      //
      // Nothing else matches this address, so its position among the rules below
      // does not matter. It sits here because it is the most recent.
      {
        source: "/online-presence/three-ways-to-build-a-blog",
        destination: "/blog/online-presence/build-your-own-blog",
        permanent: true,
      },
      // "A tour of the platform" became "Working with the platform" on
      // 2026-08-04. The broader title better describes a maintained handbook,
      // while this rule keeps bookmarks and shared links working.
      {
        source: "/blog-platform-docs/start-here",
        destination: "/blog/blog-platform-docs/working-with-the-platform",
        permanent: true,
      },
      // Blog Platform posts renamed on 2026-07-31, when the publication grew
      // from two posts to twelve and the two originals needed titles that said
      // which was the reference and which was the guide.
      //
      // These do not compete with the /blog-tech rules below: those only match
      // the old publication name. An old link like /blog-tech/markdown-components
      // still lands correctly because the browser follows each hop in turn, so
      // it is forwarded to /blog-platform/markdown-components and then here.
      {
        source: "/blog-platform/markdown-components",
        destination: "/blog/blog-platform-docs/markdown-reference",
        permanent: true,
      },
      {
        source: "/blog-platform/markdown-blog-format",
        destination: "/blog/blog-platform-docs/adding-content",
        permanent: true,
      },
      {
        source: "/blog-platform/custom-components",
        destination: "/blog/blog-platform-docs/extending-the-renderer",
        permanent: true,
      },
      // The publication was renamed from blog-platform to blog-platform-docs on
      // 2026-07-31, once it clearly was documentation and a second publication
      // existed alongside it.
      //
      // These two must stay below the three post-rename rules above: a source
      // matches greedily on the first rule that fits, and the general rule here
      // would otherwise send an old slug to a page that no longer exists.
      //
      // The /blog-tech rules further down still point at /blog-platform on
      // purpose. Their old slugs land on the post rules above, which forward
      // straight to the new publication, so every historical address resolves in
      // at most three hops.
      {
        source: "/blog-platform/:postId",
        destination: "/blog/blog-platform-docs/:postId",
        permanent: true,
      },
      {
        source: "/blog-platform",
        destination: "/blog/blog-platform-docs",
        permanent: true,
      },
      {
        source: "/blog-tech/:postId",
        destination: "/blog-platform/:postId",
        permanent: true,
      },
      {
        source: "/blog-tech",
        destination: "/blog-platform",
        permanent: true,
      },
      {
        source: "/publications/blog-tech/:postId",
        destination: "/blog-platform/:postId",
        permanent: true,
      },
      {
        source: "/publications/blog-tech",
        destination: "/blog-platform",
        permanent: true,
      },
      {
        source: "/publications/:pubId/:postId",
        destination: "/blog/:pubId/:postId",
        permanent: true,
      },
      {
        source: "/publications/:pubId",
        destination: "/blog/:pubId",
        permanent: true,
      },
    ]
  },
  turbopack: {
    root: path.resolve(__dirname, "../.."),
    rules: {
      "*.md": {
        loaders: [path.resolve(__dirname, "loaders/raw-markdown-loader.cjs")],
        as: "*.js",
      },
    },
  },
}

export default nextConfig

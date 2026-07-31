import path from "node:path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The browse page moved from a query parameter to a path segment on
      // 2026-07-31: /browse?content=publications became /browse/publications.
      //
      // The three query rules have to come first. A rule's source matches the
      // path only, so the bare /browse rule below would otherwise swallow every
      // one of them and send a request for the authors tab to the posts tab.
      {
        source: "/browse",
        has: [{ type: "query", key: "content", value: "publications" }],
        destination: "/browse/publications",
        permanent: true,
      },
      {
        source: "/browse",
        has: [{ type: "query", key: "content", value: "authors" }],
        destination: "/browse/authors",
        permanent: true,
      },
      {
        source: "/browse",
        has: [{ type: "query", key: "content", value: "posts" }],
        destination: "/browse/posts",
        permanent: true,
      },
      // Bare /browse, and any unrecognised content value, land on the default
      // tab. This is also why no link inside the site points at /browse: every
      // one uses browseContentHref so navigation never pays for a redirect.
      {
        source: "/browse",
        destination: "/browse/posts",
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
        destination: "/blog-platform/markdown-reference",
        permanent: true,
      },
      {
        source: "/blog-platform/markdown-blog-format",
        destination: "/blog-platform/adding-content",
        permanent: true,
      },
      {
        source: "/blog-platform/custom-components",
        destination: "/blog-platform/extending-the-renderer",
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
        destination: "/:pubId/:postId",
        permanent: true,
      },
      {
        source: "/publications/:pubId",
        destination: "/:pubId",
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

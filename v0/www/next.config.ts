import path from "node:path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
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

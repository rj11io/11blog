import path from "node:path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
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

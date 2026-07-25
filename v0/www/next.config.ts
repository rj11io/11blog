import path from "node:path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, "../.."),
    rules: {
      "*.md": {
        loaders: [path.resolve(__dirname, "loaders/raw-markdown-loader.cjs")],
        as: "*.js",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/browse",
        permanent: false,
      },
    ]
  },
}

export default nextConfig

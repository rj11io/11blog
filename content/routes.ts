import type { Post } from "./types"

export const browseHref = "/browse"

export function publicationHref(pubId: string) {
  return `/publications/${encodeURIComponent(pubId)}`
}

export function authorHref(authorId: string) {
  return `/authors/${encodeURIComponent(authorId)}`
}

export function postHref(pubId: string, post: Pick<Post, "postId" | "slug">) {
  return `${publicationHref(pubId)}/${encodeURIComponent(post.slug ?? String(post.postId))}`
}

import { authors } from "./authors"
import { aiBenchmarks } from "./publications/ai-benchmarks"
import { aiProductEngineering } from "./publications/ai-product-engineering"
import { aiSkillsSpotlight } from "./publications/ai-skills-spotlight"
import { blogPlatformDocs } from "./publications/blog-platform-docs"
import { onlinePresence } from "./publications/online-presence"
import { personalNotes } from "./publications/personal-notes"
import { projectPostmortems } from "./publications/project-postmortems"
import { techTutorials } from "./publications/tech-tutorials"
import { authorHref, postHref, publicationHref } from "./routes"
import type {
  Author,
  AuthorListItem,
  AuthorPreview,
  Post,
  PostListItem,
  PostPreview,
  Publication,
  PublicationPreview,
} from "./types"
import { validatePublications } from "./validation"

export const publications: Publication[] = [
  blogPlatformDocs,
  onlinePresence,
  projectPostmortems,
  techTutorials,
  personalNotes,
  aiBenchmarks,
  aiProductEngineering,
  aiSkillsSpotlight,
]

export const blogAuthors: Author[] = authors

validatePublications(publications, blogAuthors)

const authorsById = new Map(blogAuthors.map((author) => [author.id, author]))

function toAuthorPreview(author: Author): AuthorPreview {
  return {
    id: author.id,
    name: author.name,
    displayName: author.displayName,
    avatar: author.avatar,
  }
}

function resolveAuthors(post: Post) {
  return post.authorIds.map((authorId) => {
    const author = authorsById.get(authorId)
    if (!author) {
      throw new Error(`${post.title} references unknown author ${authorId}`)
    }
    return toAuthorPreview(author)
  })
}

/**
 * A publication's authors: everyone with a byline on at least one of its posts,
 * ordered by how many they wrote and then by name. That puts the main author
 * first, which is the useful signal on a card, and keeps the order stable rather
 * than depending on which post happens to come first.
 *
 * Derived rather than declared. A field on the publication would be a second
 * place for the same fact to live, and the two would eventually disagree.
 */
function authorsFromPosts(posts: Post[]): AuthorPreview[] {
  const tally = new Map<string, { author: AuthorPreview; posts: number }>()

  for (const post of posts) {
    for (const author of resolveAuthors(post)) {
      const entry = tally.get(author.id)
      if (entry) entry.posts += 1
      else tally.set(author.id, { author, posts: 1 })
    }
  }

  return [...tally.values()]
    .sort(
      (a, b) => b.posts - a.posts || a.author.name.localeCompare(b.author.name)
    )
    .map((entry) => entry.author)
}

/** For pages holding a whole publication rather than a preview of one. */
export function getPublicationAuthors(publication: Publication) {
  return authorsFromPosts(publication.posts)
}

export const allPosts: PostListItem[] = publications.flatMap((publication) =>
  publication.posts.map((post, editorialIndex) => ({
    ...post,
    authors: resolveAuthors(post),
    publicationId: publication.pubId,
    publicationTitle: publication.title,
    publicationHref: publicationHref(publication.pubId),
    href: postHref(publication.pubId, post),
    editorialIndex,
  }))
)

export const publicationPreviews: PublicationPreview[] = publications.map(
  ({ posts, ...publication }) => ({
    ...publication,
    href: publicationHref(publication.pubId),
    postCount: posts.length,
    authors: authorsFromPosts(posts),
  })
)

function toPostPreview(post: PostListItem): PostPreview {
  return {
    postId: post.postId,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    created: post.created,
    updated: post.updated,
    coverImage: post.coverImage,
    authors: post.authors,
    isNSFW: post.isNSFW,
    isNew: post.isNew,
    isFeatured: post.isFeatured,
    tags: post.tags,
    publicationId: post.publicationId,
    publicationTitle: post.publicationTitle,
    publicationHref: post.publicationHref,
    href: post.href,
    editorialIndex: post.editorialIndex,
  }
}

export const postPreviews = allPosts.map(toPostPreview)

export const authorPreviews: AuthorListItem[] = blogAuthors.map((author) => ({
  id: author.id,
  name: author.name,
  displayName: author.displayName,
  bio: author.bio,
  avatar: author.avatar,
  tags: author.tags,
  href: authorHref(author.id),
  postCount: postPreviews.filter((post) =>
    post.authors.some((postAuthor) => postAuthor.id === author.id)
  ).length,
}))

export function getPublication(pubId: string) {
  return publications.find((publication) => publication.pubId === pubId)
}

export function getPost(pubId: string, postKey: string) {
  const publication = getPublication(pubId)
  if (!publication) return undefined

  const postIndex = publication.posts.findIndex(
    (post) => post.slug === postKey || String(post.postId) === postKey
  )
  if (postIndex === -1) return undefined

  const post = publication.posts[postIndex]

  return {
    publication,
    post,
    authors: resolveAuthors(post),
    postIndex,
  }
}

export function getAuthor(authorId: string) {
  return authorsById.get(authorId)
}

export function getPostsByAuthor(authorId: string) {
  return postPreviews.filter((post) =>
    post.authors.some((author) => author.id === authorId)
  )
}

export function getPostPreview(publication: Publication, post: Post) {
  const editorialIndex = publication.posts.indexOf(post)
  const item: PostListItem = {
    ...post,
    authors: resolveAuthors(post),
    publicationId: publication.pubId,
    publicationTitle: publication.title,
    publicationHref: publicationHref(publication.pubId),
    href: postHref(publication.pubId, post),
    editorialIndex,
  }
  return toPostPreview(item)
}

export function getPostContent(post: Post) {
  return post.content?.trim() || null
}

export function stripLeadingH1(markdown: string) {
  return markdown.replace(/^\s*#\s+[^\n]+\n+/, "")
}

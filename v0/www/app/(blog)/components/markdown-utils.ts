import type { Plugin } from "unified"
import { visit } from "unist-util-visit"

type MarkdownNode = {
  type?: string
  value?: string
  url?: string
  children?: MarkdownNode[]
  data?: {
    hName?: string
    hProperties?: Record<string, string>
  }
}

const youtubeIdPattern = /^[a-zA-Z0-9_-]{11}$/
const imageKeyPattern = /^[a-z0-9]+(?:[-_:][a-z0-9]+)*$/i

export function isInternalHref(href: string) {
  return (
    href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/\\")
  )
}

export function getYouTubeVideoId(value: string) {
  const trimmed = value.trim()
  const shortcode = trimmed.match(/^@\[youtube\]\(([^)\s]+)\)$/i)
  if (shortcode) {
    return youtubeIdPattern.test(shortcode[1]) ? shortcode[1] : null
  }

  const urlMatch = trimmed.match(
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&].*)?$/
  )
  return urlMatch?.[1] ?? null
}

function markdownText(node: MarkdownNode): string {
  if (node.type === "text" || node.type === "inlineCode") {
    return node.value ?? ""
  }

  return node.children?.map(markdownText).join("") ?? ""
}

export const remarkYouTube: Plugin = () => (tree) => {
  visit(tree, "paragraph", (node) => {
    const paragraph = node as MarkdownNode
    const videoId = getYouTubeVideoId(markdownText(paragraph))

    if (videoId) {
      paragraph.data = {
        hName: "youtube-embed",
        hProperties: {
          videoid: videoId,
          title: "YouTube video",
        },
      }
      paragraph.children = []
      return
    }

    const [prefix, link] = paragraph.children ?? []
    if (
      prefix?.type === "text" &&
      prefix.value === "@" &&
      link?.type === "link" &&
      markdownText(link).toLocaleLowerCase() === "youtube" &&
      link.url &&
      youtubeIdPattern.test(link.url)
    ) {
      paragraph.data = {
        hName: "youtube-embed",
        hProperties: {
          videoid: link.url,
          title: "YouTube video",
        },
      }
      paragraph.children = []
    }
  })
}

export const remarkImageList: Plugin = () => (tree) => {
  visit(tree, "paragraph", (node) => {
    const paragraph = node as MarkdownNode
    const [prefix, link, ...rest] = paragraph.children ?? []

    if (
      rest.length > 0 ||
      prefix?.type !== "text" ||
      prefix.value !== "@" ||
      link?.type !== "link" ||
      markdownText(link).toLocaleLowerCase() !== "image-list" ||
      !link.url
    ) {
      return
    }

    if (!imageKeyPattern.test(link.url)) return

    paragraph.data = {
      hName: "image-list",
      hProperties: {
        listkey: link.url,
      },
    }
    paragraph.children = []
  })
}

export const remarkPostImage: Plugin = () => (tree) => {
  visit(tree, "paragraph", (node) => {
    const paragraph = node as MarkdownNode
    const [prefix, link, ...rest] = paragraph.children ?? []

    if (
      rest.length > 0 ||
      prefix?.type !== "text" ||
      prefix.value !== "@" ||
      link?.type !== "link" ||
      markdownText(link).toLocaleLowerCase() !== "image" ||
      !link.url ||
      !imageKeyPattern.test(link.url)
    ) {
      return
    }

    paragraph.data = {
      hName: "post-image",
      hProperties: {
        imagekey: link.url,
      },
    }
    paragraph.children = []
  })
}

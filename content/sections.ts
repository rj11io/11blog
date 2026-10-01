import type { Section } from "./types"

/**
 * The site's section tree. One root is required: its segment is empty and it
 * owns the site's own blog at /blog. Every other section hangs off a parent
 * and adds one path segment, so a section's address is its ancestors'
 * segments joined: /pokemon/champions.
 *
 * kind says what a section is for the landing pages:
 * - category: a theme that games are tagged with, like gaming or esports.
 * - game: a game, listed on the games browse page, tagged with categories.
 * - edition: a game's version, mode or era, under its game.
 *
 * This site is a single-section site: the root alone. A copy of the platform
 * that hosts several games adds sections here and nothing else changes.
 */
export const sections: Section[] = [
  {
    id: "root",
    kind: "root",
    segment: "",
    title: "11blog",
    description: "A personal blog.",
  },
]

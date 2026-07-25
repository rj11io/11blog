import type { PostImageLists } from "../../../../types"

const pressKitRoot = "/static/pokemon-champions-official-press-kit"

const pokemonChampionsImages = [
  {
    src: `${pressKitRoot}/Pokémon Champions Key Art February 27 2026/Pokemon_Champions_Key_Art.png`,
    alt: "Pokémon Champions key artwork",
    title: "Pokémon Champions",
    subtitle: "Key artwork",
  },
  {
    src: `${pressKitRoot}/Pokémon Champions Screenshots February 27 2026/Pokemon_Champions_1.png`,
    alt: "Pokémon facing one another in a Champions arena",
    title: "Arena showdown",
    subtitle: "Battle screenshot",
  },
  {
    src: `${pressKitRoot}/Pokémon Champions Screenshots February 27 2026/Pokemon_Champions_2.png`,
    alt: "Pokémon Champions battle action",
    title: "Battle action",
    subtitle: "Battle screenshot",
  },
  {
    src: `${pressKitRoot}/Pokémon Champions Screenshots February 27 2026/Pokemon_Champions_3.png`,
    alt: "Pokémon using a move in the Champions arena",
    title: "Power move",
    subtitle: "Battle screenshot",
  },
  {
    src: `${pressKitRoot}/Pokémon Champions Screenshots June 3 2026/Pokemon_Champions_Screenshot_1.jpg`,
    alt: "Pokémon Champions stadium battle",
    title: "Stadium battle",
    subtitle: "June 2026",
  },
  {
    src: `${pressKitRoot}/Pokémon Champions Screenshots June 3 2026/Pokemon_Champions_Screenshot_2.jpg`,
    alt: "Pokémon Champions team selection screen",
    title: "Team selection",
    subtitle: "June 2026",
  },
  {
    src: `${pressKitRoot}/Pokémon Champions Screenshots June 3 2026/Pokemon_Champions_Screenshot_3.jpg`,
    alt: "Pokémon Champions battle interface",
    title: "Battle interface",
    subtitle: "June 2026",
  },
  {
    src: `${pressKitRoot}/Pokémon Champions Screenshots June 3 2026/Pokemon_Champions_Screenshot_4_ENG.jpg`,
    alt: "English Pokémon Champions game screen",
    title: "Championship match",
    subtitle: "English interface",
  },
  {
    src: `${pressKitRoot}/Pokémon Champions Artwork/Pokemon_Champions_Key_Art.png`,
    alt: "Pokémon Champions promotional artwork",
    title: "Champions artwork",
    subtitle: "Promotional artwork",
  },
  {
    src: `${pressKitRoot}/Pokémon Champions Logo/Pokemon_Champions_Logo.png`,
    alt: "Pokémon Champions logo",
    title: "Pokémon Champions",
    subtitle: "Official logo",
  },
] as const

function imageList(
  layout: "quilted" | "masonry",
  variant: "image-only" | "title-inside" | "title-below"
) {
  return {
    layout,
    variant,
    images: pokemonChampionsImages,
    ariaLabel: `${layout === "quilted" ? "Quilted" : "Masonry"} Pokémon Champions image list, ${variant.replaceAll("-", " ")}`,
  } as const
}

export const markdownComponentsImageLists = {
  "quilted:image-only": imageList("quilted", "image-only"),
  "quilted:title-inside": imageList("quilted", "title-inside"),
  "quilted:title-below": imageList("quilted", "title-below"),
  "masonry:image-only": imageList("masonry", "image-only"),
  "masonry:title-inside": imageList("masonry", "title-inside"),
  "masonry:title-below": imageList("masonry", "title-below"),
} satisfies PostImageLists

import type { Publication } from "../../types"
import { aboutAiProductEngineering } from "./posts/about-ai-product-engineering"
import { bestTechStackForYourStartup } from "./posts/best-tech-stack-for-your-startup"

import publicationCover from "./assets/ai-product-engineering-og-cover-v1.png"

export const aiProductEngineering: Publication = {
  relId: 10,
  pubId: "ai-product-engineering",
  title: "AI product engineering",
  description:
    "Engineering dependable AI products across architecture, evaluation, interfaces, operations, and failure handling.",
  created: "2026-08-04",
  isNSFW: false,
  isNew: false,
  isFeatured: false,
  isDraft: true,
  tags: ["AI", "Product Engineering", "Systems"],
  posts: [
    {
      postId: 1001,
      slug: "about-ai-product-engineering",
      title: "About AI product engineering",
      excerpt:
        "A placeholder for practical notes on engineering dependable AI products.",
      created: "2026-08-04",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["AI", "Product Engineering", "Introduction"],
      content: aboutAiProductEngineering,
    },
    // Ported from Medium, written 2025-05-15, kept in its original voice. The
    // created date carries the age; the body says nothing about being an
    // archive. Same treatment as the other two Medium ports.
    //
    // That date matters more here than elsewhere. The post names specific
    // versions (React 19, Next.js 15) and closes on a sales pitch with a
    // quarter-bound deadline, so it reads as wrong rather than merely old if a
    // reader takes it as current. Nothing was softened; the date does that work.
    //
    // No headings in the original, so none were invented. The index shows the
    // title entry alone.
    {
      postId: 1002,
      slug: "best-tech-stack-for-your-startup",
      title: "The objectively best tech stack for your startup",
      excerpt:
        "Next.js as the highest-leverage choice for a new SaaS product, and the full stack around it: TypeScript, React 19, Tailwind, Shadcn, Clerk, Stripe, Vercel.",
      created: "2025-05-15",
      authorIds: ["rj11io"],
      isNSFW: false,
      isNew: false,
      isFeatured: false,
      isDraft: true,
      tags: ["Startup", "Tech Stack", "Next.js", "Product Engineering"],
      content: bestTechStackForYourStartup,
    },
  ],
  coverImage: publicationCover.src,
}

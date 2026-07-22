export const markdownComponents = `# Markdown components

## Prose and inline formatting

This paragraph demonstrates **bold text**, _italic text_, ~~strikethrough text~~, \`inline code\`, an [internal blog link](/?content=posts), and an [external reference](https://example.com).

### Lists and tasks

- First unordered item
- Second unordered item with nested detail:
  - Nested unordered item
  - Another nested item

1. First ordered item
2. Second ordered item
   1. Nested ordered item
   2. Another nested ordered item

- [x] Publish renderer contract
- [ ] Add more field examples

### Quotes, rules, and images

> Good Markdown rendering keeps authoring simple while preserving a polished reading surface.

---

![Decorative author workspace](/static/blog-authors/rj-pic.png)

### Tables

| Component | Status | Notes |
| --- | --- | --- |
| Tables | Supported | Via remark-gfm |
| Task lists | Supported | Disabled checkboxes |
| Autolinks | Supported | https://example.com/docs |

### Code blocks

#### Inline \`code\` heading

This heading verifies renderer and TOC IDs stay aligned when heading text contains inline code.

\`\`\`tsx
type Post = {
  title: string
  authorIds: string[]
}

export function PostTitle({ title }: Pick<Post, "title">) {
  return <h1>{title}</h1>
}
\`\`\`

~~~bash
npm run typecheck
npm run lint
~~~

### YouTube embeds

@[youtube](dQw4w9WgXcQ)

### Heading depth

#### H4 detail heading

This section verifies fourth-level headings appear in the table of contents.

##### H5 detail heading

This section verifies fifth-level headings render with stable IDs too.`

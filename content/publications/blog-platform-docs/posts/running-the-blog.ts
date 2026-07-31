export const runningTheBlog = `
# Running and releasing the blog

This post covers the mechanics: how to start the site locally, what to check before committing, and what happens when a change reaches the main branch. It is the operator's half of the documentation. For writing content, see [Adding a publication or post](/blog-platform-docs/adding-content).

## Two package manifests, two jobs

The repository has a package.json at its root and another inside v0/www. They are not duplicates and they do different work.

The root manifest exists to cut releases. Its only script runs semantic-release, and its only dependencies are that tool and its plugins. The version number in this file is the version of the blog as a whole, and it is the number the site footer displays.

The manifest in v0/www is the web application: Next.js, React, the Markdown pipeline, the interface components, and the scripts you use day to day.

When a command in this post has no directory next to it, run it from v0/www.

## Starting the site

The dev server is described in .claude/launch.json, which runs it from the repository root without changing directory:

~~~json
{
  "name": "blog-dev",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["--prefix", "v0/www", "run", "dev"],
  "port": 4100
}
~~~

By hand, the equivalent is:

~~~bash
cd v0/www
npm install
npm run dev
~~~

Open the address the command prints. Content changes appear on save, because the content directory is part of the compiled project rather than data loaded at runtime.

## The checks

Four commands, all run from v0/www:

| Command | What it does |
| --- | --- |
| npm run typecheck | Checks types across the whole project without producing files. Fast. |
| npm run lint | Runs ESLint with the Next.js configuration. |
| npm run build | Produces the production site, generating every page. |
| npm run start | Serves an already-built site, for checking the production output. |

There is also npm run format, which rewrites files with Prettier, including the Tailwind class-sorting plugin.

**Run all three of typecheck, lint, and build before committing.** They fail for different reasons, and none of them covers another:

- typecheck catches type errors. It does not run any of your code.
- lint catches the rules the Next.js configuration enforces.
- build is the only command that executes the content and generates every page. It is therefore the only one that catches a content validation failure, a publication missing from the registry, or a post that cannot render.

That last point is worth being clear about, because it is easy to get wrong. The content validator runs when the registry is executed, which happens during a build and when the dev server renders a page. It does not run during typecheck: a date written as 2026-02-30 is a valid string, so typecheck passes and the build then fails. Never take a passing typecheck as evidence that content is valid. See [Content validation rules](/blog-platform-docs/content-validation).

## Why the build reaches outside the app directory

The content lives outside the Next.js application, which needs two small pieces of configuration.

First, the compiler is told where to find it. v0/www/tsconfig.json maps an alias and adds the content directory to the compiled set:

~~~json
"paths": {
  "@/*": ["./*"],
  "@content/*": ["../../content/*"],
  "@root/package.json": ["../../package.json"]
},
"include": ["**/*.ts", "**/*.tsx", "../../content/**/*.ts"]
~~~

Second, the bundler is told the same thing. v0/www/next.config.ts sets Turbopack's root to the repository root rather than the app directory, and registers a loader so a .md file can be imported as a string:

~~~ts
turbopack: {
  root: path.resolve(__dirname, "../.."),
  rules: {
    "*.md": {
      loaders: [path.resolve(__dirname, "loaders/raw-markdown-loader.cjs")],
      as: "*.js",
    },
  },
}
~~~

The loader itself is five lines. It takes the file's text and exports it as a string, which is all a post body needs to be.

If you move the app, or add a second one, both settings have to move with it. That is the price of keeping content framework-independent, and it is a price worth paying. See [The content contract](/blog-platform-docs/content-contract).

## How a release happens

Pushing to main triggers .github/workflows/release.yml, which checks out the full history, installs dependencies at the root, and runs semantic-release.

The tool reads the commit messages since the last release and decides everything from them. There is no version number to bump by hand and no release branch to manage.

### Commit messages decide the version

The convention is Conventional Commits: a type, a colon, then a summary.

| Commit type | Effect |
| --- | --- |
| fix: | Patch release. 1.0.1 becomes 1.0.2. |
| feat: | Minor release. 1.0.1 becomes 1.1.0. |
| A commit with BREAKING CHANGE in its body | Major release. 1.0.1 becomes 2.0.0. |
| chore:, docs:, styles:, refactor:, test: | No release. |

Two things follow from that table. A change that should ship a new version must use fix: or feat:, or nothing happens. And a batch of chore: commits will sit on main without producing a release, which is normal and not a fault.

The summary line becomes an entry in CHANGELOG.md, so write it as something a reader would understand. "fix: sorting options" is fine. "fix: bump" tells nobody anything.

### What the pipeline does

The plugin order in .releaserc.js is load-bearing:

~~~js
plugins: [
  "@semantic-release/commit-analyzer",
  "@semantic-release/release-notes-generator",
  "@semantic-release/changelog",
  ["@semantic-release/npm", { npmPublish: false }],
  ["@semantic-release/git", {
    assets: ["package.json", "CHANGELOG.md"],
    message: "chore(release): \${nextRelease.version} [skip ci]",
  }],
  "@semantic-release/github",
]
~~~

In order: work out the next version from the commits, write release notes, prepend them to CHANGELOG.md, write the new version into package.json, commit those two files, then create the GitHub release.

The npm plugin has to run before the git plugin, because the git plugin only commits files that have actually changed on disk. Reversing them would produce a release whose package.json still held the old version. The comment in the file says so; leave the order alone.

npmPublish is false. Nothing is published to a package registry. The release is a git tag, a changelog entry, and a GitHub release.

The release commit ends with [skip ci], which stops the pipeline triggering itself in an endless loop.

### The version the footer shows

The footer reads the root manifest, not the app's:

~~~tsx
import packageJson from "@root/package.json"
~~~

That is intentional and commented in the file. The root manifest is the one the pipeline versions, so it is the one the site should report. The app's own version stays at 0.0.1 and means nothing.

A consequence worth knowing: the footer shows the version that was current when the site was built. A release that has not been rebuilt and redeployed will not be reflected there.

### Permissions

The workflow requests write access to repository contents, issues, and pull requests, plus an ID token, and runs in an environment called release. The default permissions at the top of the file are read-only, and the job widens them for itself. If a release fails with a permissions error, that block is the place to look, along with the environment's own settings.

## Pinned dependencies

Both manifests carry the same override:

~~~json
"overrides": { "lodash-es": "4.17.21" }
~~~

This forces one version of that package regardless of what any dependency asks for. If you add it to one manifest, add it to the other, or the two installs can drift apart.

## Before you commit

1. From v0/www: npm run typecheck.
2. npm run lint.
3. npm run build.
4. Check the change in the running site, including one internal link if you added any.
5. Write the commit message as fix: or feat: if it should produce a release, and as chore: or docs: if it should not.
`

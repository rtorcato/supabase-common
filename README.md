<!-- brand-kit:banner:start -->
<picture>
  <source media="(max-width: 640px)" srcset="./brand/banner-mobile.png">
  <img src="./brand/banner.png" alt="supabase-common-monorepo banner" width="1600">
</picture>
<!-- brand-kit:banner:end -->

# supabase-common

Tree-shakeable, mostly dependency-free TypeScript helpers for Supabase — the
cookie/URL/error/claims boilerplate you'd otherwise copy-paste into every
project, factored into small packages.

[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy me a coffee" height="40">](https://buymeacoffee.com/rtorcato)

📖 **Docs:** https://docs.torcato.dev/supabase-common/

## Packages

| Package | Description |
| --- | --- |
| [`@rtorcato/supabase-common`](packages/supabase-common) | Structural core (error classification, pagination, storage URLs, JWT claim decode, realtime naming) plus framework-agnostic client factories behind an optional `@supabase/ssr` peer. |
| [`@rtorcato/supabase-next`](packages/supabase-next) | Next.js App Router SSR helpers — cookie-wired server client + middleware session refresh, built on `supabase-common`. |

## Install

```bash
pnpm add @rtorcato/supabase-common
# Next.js apps:
pnpm add @rtorcato/supabase-next @supabase/ssr @supabase/supabase-js next
```

See each package's README for the full API and examples.

## Use with AI

A skill ships with the repo so AI coding tools use supabase-common the way it's
meant to be used: the two entry points, unwrapping `{ data, error }` results,
classifying errors by code, and each helper's API.

**Any agent with the [`skills`](https://www.npmjs.com/package/skills) CLI**: install it
straight from GitHub, no clone, no package install:

```bash
npx skills add https://github.com/rtorcato/supabase-common --skill supabase-common
```

**[Claude Code](https://claude.com/claude-code)**: register the marketplace once, then
install the plugin:

```sh
/plugin marketplace add rtorcato/supabase-common
/plugin install supabase-common@supabase-common
```

**Other tools (Cursor, Copilot, Codex)**: `@rtorcato/supabase-common` ships an
[`AGENTS.md`](packages/supabase-common/AGENTS.md) with the same rules. Agents that read `AGENTS.md` pick it up from
`node_modules/@rtorcato/supabase-common/`, or copy the rules into your project's
agent config.

## Development

pnpm workspace (Node ≥ 22, pnpm 11).

```bash
pnpm install
pnpm build      # build all packages
pnpm test       # run every package's tests
pnpm verify     # per-package typecheck + lint + test + publint
pnpm check      # biome lint/format check
```

Releases are managed with [Changesets](https://github.com/changesets/changesets):
add one with `pnpm changeset`. Releases are batched, so merging to `main` publishes
nothing. Closing a milestone, or dispatching `release.yml`, waits for approval in the
`release` environment and then opens the "Version Packages" PR. After that PR merges,
the next approved run publishes to npm.

## License

MIT © Richard Torcato

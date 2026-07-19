# supabase-common

Tree-shakeable, mostly dependency-free TypeScript helpers for Supabase — the
cookie/URL/error/claims boilerplate you'd otherwise copy-paste into every
project, factored into small packages.

📖 **Docs:** https://rtorcato.github.io/supabase-common

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
add one with `pnpm changeset`; merging the version PR publishes.

## License

MIT © Richard Torcato

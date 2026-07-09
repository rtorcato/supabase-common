# supabase-common

<!-- js-tooling:badges:start -->
[![npm version](https://img.shields.io/npm/v/@rtorcato/supabase-common)](https://www.npmjs.com/package/@rtorcato/supabase-common)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/supabase-common)](https://www.npmjs.com/package/@rtorcato/supabase-common)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/supabase-common)](https://bundlephobia.com/package/@rtorcato/supabase-common)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
<!-- js-tooling:badges:end -->

> Shared, tree-shakeable TypeScript helpers for Supabase, part of the `@rtorcato/*` family.

📖 **Docs:** https://rtorcato.github.io/supabase-common

## Description

`supabase-common` is a collection of small, focused helpers for working with
Supabase and PostgREST results — built the same way as the rest of the
`@rtorcato/*` family: TypeScript-first, ESM-only, tree-shakeable, with **zero
runtime dependencies**.

Helpers operate on the plain `{ data, error }` shape every Supabase call
returns, so the package works with any `@supabase/supabase-js` version (and
anything else that speaks PostgREST) without depending on it.

> **Early days.** The public API is still small and may change before `1.0`.
> See the [milestones](https://github.com/rtorcato/supabase-common/milestones) for what's planned.

## Installation

```bash
pnpm add @rtorcato/supabase-common
# or
npm install @rtorcato/supabase-common
# or
yarn add @rtorcato/supabase-common
```

## Usage

```ts
import { unwrap, unwrapMaybe, SupabaseError } from '@rtorcato/supabase-common'

// `unwrap` collapses `{ data, error }` into the value — or throws SupabaseError.
// No more `if (error) throw error` on every call.
const user = unwrap(await supabase.from('users').select().eq('id', id).single())
// → the row, or throws SupabaseError (with .code / .details from PostgREST)

// `unwrapMaybe` returns null for a missing row, still throws on a real error.
const maybe = unwrapMaybe(await supabase.from('users').select().eq('id', id).maybeSingle())
// → the row, or null

// The thrown error preserves PostgREST metadata.
try {
  unwrap(await supabase.from('locked').select().single())
} catch (e) {
  if (e instanceof SupabaseError) console.error(e.code, e.details)
}
```

The package is ESM-only and targets Node.js ≥22.

## Development

```bash
pnpm install        # install dependencies
pnpm build          # build the library (tsup)
pnpm test           # run tests (vitest)
pnpm verify         # typecheck + biome check + test + publint
```

### Scripts

- `pnpm typecheck` — type check TypeScript
- `pnpm check` / `pnpm check:fix` — lint & format with Biome
- `pnpm test` / `pnpm test:watch` — run tests
- `pnpm coverage` — generate test coverage
- `pnpm build` — build for production

## Documentation site

The docs live in [`apps/docs`](./apps/docs) (Docusaurus) and deploy to GitHub
Pages on every push to `main` that touches docs or `src/`.

```bash
pnpm --filter @rtorcato/supabase-common-docs dev     # local preview
pnpm --filter @rtorcato/supabase-common-docs build   # production build
```

## Project structure

```
supabase-common/
├── src/                  # library source
├── apps/docs/            # Docusaurus documentation site
├── package.json
├── tsconfig.json
├── biome.jsonc
├── vitest.config.ts
├── tsup.config.ts
└── .husky/               # git hooks
```

## Sibling projects

- [@rtorcato/db-common](https://rtorcato.github.io/db-common/) — database-agnostic query helpers
- [@rtorcato/js-common](https://rtorcato.github.io/js-common/) — general TypeScript utilities
- [@rtorcato/browser-common](https://rtorcato.github.io/browser-common/) — browser Web API wrappers
- [@rtorcato/js-tooling](https://rtorcato.github.io/js-tooling/) — shared Biome/TS/Vitest/release presets

## Contributing

This project follows [Conventional Commits](https://conventionalcommits.org/):
`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`.

## License

MIT © Richard Torcato

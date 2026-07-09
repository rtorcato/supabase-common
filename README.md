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

Everything is a pure function over strings and plain objects — result
unwrapping, error classification, pagination ranges, and storage URLs — so the
whole package stays zero-dependency. See the
[milestones](https://github.com/rtorcato/supabase-common/milestones) for what's
planned next.

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

### Error classification

Branch on *why* a call failed instead of matching messages. The guards read
`.code` structurally, so they work on a thrown `SupabaseError` or a raw
PostgREST error object:

```ts
import { isUniqueViolation, isRlsDenied, isNoRows, PG_ERROR } from '@rtorcato/supabase-common'

const { error } = await supabase.from('users').insert({ email })
if (isUniqueViolation(error)) return 'That email is already taken.'
if (isRlsDenied(error)) return 'Not allowed.'

// Also: isForeignKeyViolation, isNotNullViolation, isCheckViolation, isNoRows,
// plus the PG_ERROR / PGRST_ERROR code constants and errorCode(err).
```

### Pagination

Translate a 1-based page into Supabase's inclusive `.range()` tuple:

```ts
import { toRange, pageCount } from '@rtorcato/supabase-common'

const { from, to } = toRange(2, 25) // → { from: 25, to: 49 }
const { data, count } = await supabase
  .from('rows')
  .select('*', { count: 'exact' })
  .order('id') // order (with a unique tie-breaker) before range
  .range(from, to)

const pages = pageCount(count ?? 0, 25)
```

### Storage URLs

Pure URL/path builders — no client needed:

```ts
import { publicUrl, downloadUrl, storageFolder } from '@rtorcato/supabase-common'

publicUrl(url, 'avatars', 'user-1/a.png')      // …/storage/v1/object/public/avatars/user-1/a.png
downloadUrl(url, 'docs', 'report.pdf', 'q3.pdf') // adds ?download=q3.pdf
storageFolder('user-1/avatars/a.png')          // 'user-1' — the RLS foldername convention
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

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
Supabase — built the same way as the rest of the `@rtorcato/*` family:
TypeScript-first, ESM-only, tree-shakeable.

The **core** (`@rtorcato/supabase-common`) is **dependency-free**: its helpers
operate on the plain `{ data, error }` shape every Supabase call returns, so
they work with any `@supabase/supabase-js` version (and anything else that
speaks PostgREST) without importing it.

The optional **`/client`** subpath adds framework-agnostic client factories
(`createBrowserClient`, `createServerClient`, `createClient`) and pulls in
`@supabase/ssr` / `@supabase/supabase-js` as **peer dependencies** — installed
only if you import that subpath. It stays framework-agnostic (no Next.js
dependency): SSR callers pass their own cookie adapter, so it works with Next,
TanStack Start, SvelteKit, Node, or edge runtimes alike.

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

### Lists & pagination

```ts
import { unwrapArray, range, paged } from '@rtorcato/supabase-common'

// `unwrapArray` throws on error, else returns the rows (null → []), so it's always mappable.
const rows = unwrapArray(await supabase.from('users').select())

// `range` turns a 1-based page + size into PostgREST's [from, to] tuple.
// `paged` unwraps a count query into a ready-to-return envelope.
const result = await supabase
  .from('users')
  .select('*', { count: 'exact' })
  .range(...range(page, 20))

return paged(result, page, 20)
// → { rows, count, page, pageSize, pageCount, hasMore }
```

### Error codes

Stop hardcoding SQLSTATE / PostgREST strings — the predicates read the `.code`
off any Supabase error (or `SupabaseError`):

```ts
import { isUniqueViolation, isRlsViolation, isNotFound, isRetryable } from '@rtorcato/supabase-common'

try {
  unwrap(await supabase.from('users').insert(row).select().single())
} catch (e) {
  if (isUniqueViolation(e)) return { error: 'Already exists' }
  if (isRlsViolation(e)) return { error: 'Not allowed' }
  throw e
}
// Also: isForeignKeyViolation, isNotNullViolation, isCheckViolation, isNotFound,
// isRetryable (serialization failure / deadlock), getErrorCode, PG_ERROR_CODES.
```

### Storage URLs

Pure string builders for Supabase Storage object URLs — no client, no
`@supabase/supabase-js` dependency (Supabase's own `getPublicUrl` is just
string concatenation).

```ts
import { publicUrl, authenticatedUrl, downloadUrl, storageFolder } from '@rtorcato/supabase-common'

publicUrl('https://abc.supabase.co', 'avatars', 'a.png')
// → https://abc.supabase.co/storage/v1/object/public/avatars/a.png

downloadUrl(url, 'docs', 'report.pdf', 'My Report.pdf') // forces a browser download
authenticatedUrl(url, 'docs', 'x/y.pdf')                // needs a bearer token to fetch

// The top-level folder — matches what RLS checks via storage.foldername(name)[1].
storageFolder('user-123/avatars/a.png') // → 'user-123'
```

### Client factories (`/client` subpath)

Framework-agnostic Supabase client factories, so you stop copy-pasting client
setup into every app. Requires the `@supabase/ssr` + `@supabase/supabase-js`
peer deps — installed only when you import this subpath.

```bash
pnpm add @rtorcato/supabase-common @supabase/ssr @supabase/supabase-js
```

```ts
import { createBrowserClient, createServerClient, createClient } from '@rtorcato/supabase-common/client'

// Browser / SPA (React, TanStack, Vue…)
const supabase = createBrowserClient(url, anonKey)

// SSR — you pass the cookie adapter, so it's not tied to any framework.
// Next.js App Router example:
const store = await cookies()
const supabase = createServerClient(url, anonKey, {
  getAll: () => store.getAll(),
  setAll: (cs) => cs.forEach(({ name, value, options }) => store.set(name, value, options)),
})

// Plain client (node scripts, edge functions, tests)
const admin = createClient(url, serviceRoleKey, { auth: { persistSession: false } })
```

> Next.js-specific middleware/session helpers (`updateSession`) are intentionally
> **not** here — they'd force a `next` dependency. They belong in your app (or a
> future `@rtorcato/supabase-next` package).

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

---
title: supabase-common
description: Shared, tree-shakeable TypeScript helpers for Supabase.
sidebar_position: 0
---

# supabase-common

[![npm version](https://img.shields.io/npm/v/@rtorcato/supabase-common.svg)](https://www.npmjs.com/package/@rtorcato/supabase-common)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/supabase-common.svg)](https://www.npmjs.com/package/@rtorcato/supabase-common)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/supabase-common)](https://bundlephobia.com/package/@rtorcato/supabase-common)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Small, focused helpers for working with Supabase and PostgREST results — part
of the `@rtorcato/*` family.

- **Dependency-free core** — the root helpers operate on the plain
  `{ data, error }` shape every Supabase call returns, so they work with any
  `@supabase/supabase-js` version without importing it.
- **Optional `/client` subpath** — framework-agnostic client factories behind
  `@supabase/ssr` / `@supabase/supabase-js` peer deps (no Next.js dependency —
  SSR callers pass their own cookie adapter).
- **ESM-only, tree-shakeable** — `sideEffects: false`, fully typed, targets
  Node.js ≥22.
- **Just the ergonomics** — stop writing `if (error) throw error` on every call.

:::info Early days
The public API is still small and may change before `1.0`. See the
[milestones](https://github.com/rtorcato/supabase-common/milestones) for what's
planned.
:::

## Quick example

```ts
import { unwrap } from '@rtorcato/supabase-common'

// Throws SupabaseError on error, returns the row otherwise.
const user = unwrap(await supabase.from('users').select().eq('id', id).single())
```

Next: [install it](/docs/guides/installation) and read the [usage guide](/docs/guides/usage).

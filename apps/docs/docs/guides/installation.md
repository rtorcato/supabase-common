---
title: Installation
sidebar_position: 1
---

# Installation

```bash
pnpm add @rtorcato/supabase-common
# or
npm install @rtorcato/supabase-common
# or
yarn add @rtorcato/supabase-common
```

The package is **ESM-only** and targets **Node.js ≥22**.

The **core** has **no runtime dependencies** — not even `@supabase/supabase-js`.
Helpers work structurally on the `{ data, error }` result shape, so you keep
full control over which Supabase client version you use.

## Client factories (`/client`)

The optional `@rtorcato/supabase-common/client` subpath adds framework-agnostic
Supabase client factories. It requires the peer dependencies (installed only if
you import this subpath):

```bash
pnpm add @rtorcato/supabase-common @supabase/ssr @supabase/supabase-js
```

It has **no Next.js dependency** — SSR callers pass their own cookie adapter, so
it works with Next, TanStack Start, SvelteKit, Node, and edge runtimes.

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

It has **no runtime dependencies** — not even `@supabase/supabase-js`. Helpers
work structurally on the `{ data, error }` result shape, so you keep full
control over which Supabase client version you use.

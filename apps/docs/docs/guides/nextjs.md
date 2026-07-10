---
title: Next.js (supabase-next)
sidebar_position: 3
---

# Next.js App Router — `@rtorcato/supabase-next`

`@rtorcato/supabase-common/client` gives you **framework-agnostic** Supabase
client factories. For **Next.js App Router**, the sibling package
[`@rtorcato/supabase-next`](https://www.npmjs.com/package/@rtorcato/supabase-next)
adds the Next-specific wiring (cookie-bound server client + middleware session
refresh) that every `create-next-app -e with-supabase` project otherwise copies
by hand. It keeps `next` out of `supabase-common` so non-Next apps (TanStack,
SvelteKit, plain Node) aren't forced to install it.

## Install

```bash
pnpm add @rtorcato/supabase-next @supabase/ssr @supabase/supabase-js next
```

## Server client

```ts
// lib/supabase/server.ts
import { createServerClient } from '@rtorcato/supabase-next'

export function getSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
```

## Middleware session refresh

```ts
// middleware.ts
import { updateSession } from '@rtorcato/supabase-next'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return updateSession(request, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    // optional overrides (defaults shown):
    // isPublicPath: (p) => p === '/' || p.startsWith('/login') || p.startsWith('/auth'),
    // loginPath: '/auth/login',
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

That's the whole thing — no more copy-pasted `getAll`/`setAll` cookie adapters or
hand-rolled redirect logic. See the [demo app](https://github.com/rtorcato/supabase-common/tree/main/apps/demo)
for a full working example.

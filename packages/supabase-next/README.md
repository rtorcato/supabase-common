# @rtorcato/supabase-next

> Next.js App Router helpers for Supabase SSR — part of the `@rtorcato/*` family.

The cookie-wiring and middleware boilerplate that `create-next-app -e with-supabase`
copies into every project, factored into one package. Built on the
framework-agnostic factories in
[`@rtorcato/supabase-common/client`](https://www.npmjs.com/package/@rtorcato/supabase-common).

## Installation

```bash
pnpm add @rtorcato/supabase-next @supabase/ssr @supabase/supabase-js next
```

`@supabase/ssr`, `@supabase/supabase-js`, and `next` are peer dependencies.

## Usage

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

```ts
// middleware.ts
import { updateSession } from '@rtorcato/supabase-next'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return updateSession(request, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    // optional: override which paths skip auth (default: /, /login*, /auth*)
    // isPublicPath: (p) => p === '/' || p.startsWith('/public'),
    // loginPath: '/auth/login',
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

## API

- `createServerClient(url, key)` — Server Component / Route Handler / Server Action
  client wired to `next/headers` cookies. Create one per request.
- `updateSession(request, options)` — middleware session refresh + auth redirect.
- `isPublicPathDefault(pathname)` — the default public-path policy (pure).
- `createBrowserClient(url, key)` — re-exported from `@rtorcato/supabase-common/client`.

## License

MIT © Richard Torcato

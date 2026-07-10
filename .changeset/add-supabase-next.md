---
"@rtorcato/supabase-next": minor
---

Initial release: Next.js App Router helpers for Supabase SSR — `createServerClient`
(wired to `next/headers` cookies), `updateSession` middleware session refresh with a
parameterized public-path policy, and a re-exported `createBrowserClient`. Built on
`@rtorcato/supabase-common/client`; `@supabase/ssr`, `@supabase/supabase-js`, and
`next` are peer deps.

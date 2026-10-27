# @rtorcato/supabase-next

## 0.1.6

### Patch Changes

- 53c19e2: Add brand banner to package READMEs for npm display.
- 39fc9c4: Fix the built package. `dist/index.js` imported a `./policy.js` that was never emitted, so any import of the package failed with "Module not found". `next/headers` is now loaded lazily inside `createServerClient`, so middleware/proxy files can import `updateSession` without tripping Next's Server-Components-only check.
- Updated dependencies [53c19e2]
- Updated dependencies [bc4f016]
- Updated dependencies [3fa9fc2]
- Updated dependencies [d141e90]
- Updated dependencies [0213bf5]
- Updated dependencies [71f60da]
  - @rtorcato/supabase-common@1.9.0

## 0.1.5

### Patch Changes

- Updated dependencies [de9ed11]
- Updated dependencies [a40e94b]
  - @rtorcato/supabase-common@1.8.0

## 0.1.4

### Patch Changes

- Updated dependencies [caf77de]
  - @rtorcato/supabase-common@1.7.0

## 0.1.3

### Patch Changes

- Updated dependencies [89715cb]
  - @rtorcato/supabase-common@1.6.0

## 0.1.2

### Patch Changes

- Updated dependencies [68e134a]
  - @rtorcato/supabase-common@1.5.0

## 0.1.1

### Patch Changes

- Updated dependencies [45eb614]
  - @rtorcato/supabase-common@1.4.0

## 0.1.0

### Minor Changes

- 7bad3ef: Initial release: Next.js App Router helpers for Supabase SSR — `createServerClient`
  (wired to `next/headers` cookies), `updateSession` middleware session refresh with a
  parameterized public-path policy, and a re-exported `createBrowserClient`. Built on
  `@rtorcato/supabase-common/client`; `@supabase/ssr`, `@supabase/supabase-js`, and
  `next` are peer deps.

### Patch Changes

- Updated dependencies [a045986]
  - @rtorcato/supabase-common@1.3.0

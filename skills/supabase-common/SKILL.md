---
name: supabase-common
description: Use when writing TypeScript that talks to Supabase in a project that depends on @rtorcato/supabase-common — unwrapping `{ data, error }` results, paginating with `.range()`, classifying Postgres/PostgREST error codes or mapping them to HTTP statuses, building Storage URLs, reading JWT claims, building Realtime channel names and filters, or creating browser/server/plain Supabase clients. Triggers on "supabase", "PostgREST", "unwrap supabase result", "if (error) throw error", "unique violation 23505", "PGRST116", "RLS error", "supabase pagination", "storage public URL", "image transform URL", "decode supabase JWT", "postgres_changes", "createServerClient", "createBrowserClient", or "/supabase-common".
---

# Using @rtorcato/supabase-common

`@rtorcato/supabase-common` is a set of small, typed helpers for the Supabase boilerplate every app copies: result unwrapping, pagination, error classification, Storage URLs, JWT claims, Realtime naming and client factories. It does not wrap or replace the Supabase SDK. You still call `supabase.from(...)` yourself.

```sh
pnpm add @rtorcato/supabase-common
pnpm add @supabase/supabase-js @supabase/ssr   # only if you import the /client subpath
```

## Rules

1. **Two entry points, and only `/client` needs the SDK.** The root `@rtorcato/supabase-common` is structural and dependency-free: it works on anything shaped like `{ data, error }` and never imports `@supabase/supabase-js`. Client factories live in `@rtorcato/supabase-common/client`, which imports `@supabase/ssr` and `@supabase/supabase-js` (optional peers). Don't import from `dist/`.
   ```ts
   import { unwrap, isUniqueViolation, toHttpStatus } from '@rtorcato/supabase-common'
   import { createServerClient } from '@rtorcato/supabase-common/client'
   ```

2. **Unwrap results instead of writing `if (error) throw error`.** Pick the one that matches the query:
   - `unwrap(result)` for `.single()` and other must-exist reads. Throws `SupabaseError` on error, and also when `data` and `error` are both `null`.
   - `unwrapMaybe(result)` for `.maybeSingle()`. Returns `null` for a missing row, still throws on error.
   - `unwrapArray(result)` for list queries. Returns `[]` when `data` is `null`.

   `SupabaseError` keeps the PostgREST `code` and `details`. Narrow a `catch` value with `isSupabaseError(err)`.

3. **Classify errors by code, never by message.** The predicates accept `unknown`, so they drop straight into a `catch`, and they work on a raw PostgREST error or a `SupabaseError`: `isUniqueViolation` (`23505`), `isForeignKeyViolation` (`23503`), `isNotNullViolation` (`23502`), `isCheckViolation` (`23514`), `isRlsViolation` (`42501`), `isNotFound` (`PGRST116`, `.single()` matched zero rows), `isRetryable` (`40001` / `40P01`). `getErrorCode(err)` returns the raw code, and `PG_ERROR_CODES` names them, so don't hard-code `'23505'`. `isRetryable` only says the error qualifies, so write the retry loop yourself.

4. **Map to HTTP once with `toHttpStatus(err)`.** Unique, exclusion and foreign-key violations → 409. Not-null and check → 400. RLS → 403. JWT expired (`PGRST301`) → 401. No rows → 404. Serialization failure, deadlock and statement timeout → 503. Anything else, including non-errors → 500.

5. **`decodeClaims` does not verify the signature.** `decodeClaims`, `getUserId` and `getRole` only base64url-decode the payload. Use them to read a token you already trust (one the SDK just gave you). For an auth decision, verify with the SDK's `supabase.auth.getClaims()` first, because an unverified token can be forged.

6. **Create one server client per request.** `createServerClient(url, key, cookies)` takes a cookie adapter (`{ getAll, setAll }`) that you supply, so it works with any framework. Don't cache it in a module global. For Next.js App Router, use `@rtorcato/supabase-next` instead: it wires `next/headers` cookies for you and adds `updateSession` for middleware.

## Module map

All exports come from the root unless noted.

| Area | Exports | Notes |
|---|---|---|
| Results | `unwrap`, `unwrapMaybe`, `unwrapArray`, `SupabaseError`, `isSupabaseError`, types `PostgrestLike`, `PostgrestErrorLike` | Structural: any `{ data, error }` works |
| Pagination | `range(page, pageSize)`, `paged(result, page, pageSize)`, types `PostgrestListLike`, `PagedResult` | `page` is 1-based. `range` returns the 0-based inclusive `[from, to]` for `.range()`. `paged` returns `{ rows, count, page, pageSize, pageCount, hasMore }`. Without `{ count: 'exact' }`, `count` falls back to `rows.length` |
| Errors | `PG_ERROR_CODES`, `getErrorCode`, `isUniqueViolation`, `isForeignKeyViolation`, `isNotNullViolation`, `isCheckViolation`, `isRlsViolation`, `isNotFound`, `isRetryable`, `toHttpStatus` | Accept `unknown` |
| Storage | `publicUrl`, `authenticatedUrl`, `downloadUrl`, `transformUrl`, `parsePublicUrl`, `splitPath`, `storageFolder`, types `TransformOptions`, `UrlVersionOptions` | Pure string builders, no client and no network. Arguments are `(supabaseUrl, bucket, path)`. `publicUrl` and `authenticatedUrl` take an optional 4th argument `{ versionId?, cacheNonce? }` and `downloadUrl` an optional 5th (after `filename`); they add the `versionId` / `cacheNonce` query params the storage client uses. `transformUrl` takes `{ width?, height?, resize?, quality?, format? }` |
| Claims | `decodeClaims`, `getUserId`, `getRole`, `isExpired`, type `SupabaseClaims` | Unverified (rule 5). `decodeClaims` returns `null` for a malformed token. `isExpired(claims, nowMs?)` treats a missing `exp` as not expired |
| Realtime | `channelName(schema, table, id?)`, `postgresChangesFilter({ table, event?, schema?, filter? })` | `channelName` gives `schema:table[:id]`. The filter defaults to `event: '*'` and `schema: 'public'` |
| `/client` | `createBrowserClient(url, key)`, `createServerClient(url, key, cookies)`, `createClient(url, key, options?)`, re-exported SDK types | Needs the `@supabase/ssr` and `@supabase/supabase-js` peers |

## Recipes

**API route: read one row, map errors to a status:**
```ts
import { toHttpStatus, unwrap } from '@rtorcato/supabase-common'

// Never send err.message to the client: it names tables, constraints and policies.
const MESSAGES: Record<number, string> = {
  400: 'Invalid request',
  401: 'Not signed in',
  403: 'Forbidden',
  404: 'Not found',
  409: 'Conflict',
  503: 'Try again',
}

try {
  const user = unwrap(await supabase.from('users').select().eq('id', id).single())
  return Response.json(user)
} catch (err) {
  const status = toHttpStatus(err)
  return Response.json({ error: MESSAGES[status] ?? 'Internal error' }, { status })
}
```

**Insert and handle a duplicate:**
```ts
import { isUniqueViolation } from '@rtorcato/supabase-common'

const { error } = await supabase.from('profiles').insert({ handle })
if (isUniqueViolation(error)) return Response.json({ error: 'Handle taken' }, { status: 409 })
if (error) throw error
```

**Paginated list for a pager UI:**
```ts
import { paged, range } from '@rtorcato/supabase-common'

const result = await supabase
  .from('posts')
  .select('*', { count: 'exact' })
  .order('created_at', { ascending: false })
  .range(...range(page, 20))
return paged(result, page, 20) // { rows, count, page, pageSize, pageCount, hasMore }
```

**Storage URLs for the `${userId}/file` convention:**
```ts
import { publicUrl, storageFolder, transformUrl } from '@rtorcato/supabase-common'

const path = `${userId}/avatar.png`
const original = publicUrl(SUPABASE_URL, 'avatars', path)
const thumb = transformUrl(SUPABASE_URL, 'avatars', path, { width: 128, height: 128, resize: 'cover' })
storageFolder(path) // → userId, matches storage.foldername(name)[1] in an RLS policy
```

**Realtime subscription:**
```ts
import { channelName, postgresChangesFilter } from '@rtorcato/supabase-common'

supabase
  .channel(channelName('public', 'messages', roomId))
  .on('postgres_changes', postgresChangesFilter({ table: 'messages', event: 'INSERT', filter: `room_id=eq.${roomId}` }), onInsert)
  .subscribe()
```

**SSR client with your framework's cookies:**
```ts
import { createServerClient } from '@rtorcato/supabase-common/client'

const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  getAll: () => readRequestCookies(),
  setAll: (cookies) => cookies.forEach(({ name, value, options }) => setResponseCookie(name, value, options)),
})
```

**Script or test with a service-role key (server only, never ship it to a browser):**
```ts
import { createClient } from '@rtorcato/supabase-common/client'

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } })
```

## Testing

The root helpers are structural, so test them with plain `{ data, error }` objects. No Supabase instance or SDK mock is needed:
```ts
expect(() => unwrap({ data: null, error: { message: 'dup', code: '23505' } })).toThrow(SupabaseError)
```

For the full API, see the [docs site](https://docs.torcato.dev/supabase-common/) or the JSDoc in `packages/supabase-common/src/`.

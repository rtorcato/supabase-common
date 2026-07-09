---
title: Usage
sidebar_position: 2
---

# Usage

## `unwrap(result)`

Collapses a Supabase `{ data, error }` result into the value, or throws a
[`SupabaseError`](#supabaseerror). Also throws when both `data` and `error` are
`null` — so a value returned from `unwrap` is never `null` by accident.

```ts
import { unwrap } from '@rtorcato/supabase-common'

const user = unwrap(await supabase.from('users').select().eq('id', id).single())
// → the row, or throws SupabaseError
```

## `unwrapMaybe(result)`

Like `unwrap`, but returns `null` for a missing row instead of throwing. Still
throws on an actual PostgREST error. Use it for "find or nothing" reads.

```ts
import { unwrapMaybe } from '@rtorcato/supabase-common'

const user = unwrapMaybe(
  await supabase.from('users').select().eq('id', id).maybeSingle(),
)
// → the row, or null
```

## `SupabaseError`

The error type thrown by `unwrap` / `unwrapMaybe`. It preserves the PostgREST
error metadata so you can branch on it.

```ts
import { unwrap, SupabaseError } from '@rtorcato/supabase-common'

try {
  unwrap(await supabase.from('locked').select().single())
} catch (e) {
  if (e instanceof SupabaseError) {
    console.error(e.code)    // e.g. "42501" (insufficient privilege / RLS)
    console.error(e.details) // PostgREST details, when present
  }
}
```

| Property  | Type     | Description                                  |
| --------- | -------- | -------------------------------------------- |
| `message` | `string` | The PostgREST error message.                 |
| `code`    | `string?`| The PostgREST / Postgres error code, if any. |
| `details` | `string?`| Extra detail from PostgREST, if any.         |

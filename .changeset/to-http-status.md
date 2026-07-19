---
'@rtorcato/supabase-common': minor
---

Add `toHttpStatus` — map a Supabase/PostgREST error to the HTTP status an API route should return (409/403/404/400/401/503, else 500), built on the existing error-code predicates.

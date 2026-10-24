---
'@rtorcato/supabase-common': minor
---

`publicUrl`, `authenticatedUrl` and `downloadUrl` take an optional `{ versionId, cacheNonce }` argument that adds the same query params `@supabase/storage-js` uses, for object versioning and cache busting. New `UrlVersionOptions` type.

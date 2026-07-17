---
"@rtorcato/supabase-common": minor
---

Add Storage URL builders: `publicUrl`, `authenticatedUrl`, `downloadUrl`, and
`storageFolder`. Pure string builders (no client, no `@supabase/supabase-js`
dependency) for constructing Supabase Storage object URLs and reading the
top-level folder an RLS policy checks via `storage.foldername(name)[1]`.

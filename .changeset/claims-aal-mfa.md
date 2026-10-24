---
'@rtorcato/supabase-common': minor
---

Add `getAal`, `needsMfa` and `getClaim` claim helpers, plus the `Aal` type and typed `aal`/`amr` fields on `SupabaseClaims`, so apps can gate MFA step-up without hand-decoding the JWT.

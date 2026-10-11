---
'@rtorcato/supabase-next': patch
---

Fix the built package. `dist/index.js` imported a `./policy.js` that was never emitted, so any import of the package failed with "Module not found". `next/headers` is now loaded lazily inside `createServerClient`, so middleware/proxy files can import `updateSession` without tripping Next's Server-Components-only check.

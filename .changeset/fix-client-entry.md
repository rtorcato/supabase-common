---
'@rtorcato/supabase-common': patch
---

Fix build: emit the `./client` subpath (`dist/client.*`) again. Newer `@rtorcato/js-tooling` no longer auto-derives tsup entries, so `src/client.ts` is now listed explicitly — the `./client` export was unresolvable (broke `@rtorcato/supabase-next`'s build/typecheck).

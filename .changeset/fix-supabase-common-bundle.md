---
'@rtorcato/supabase-common': patch
---

Fix the built package. `dist/index.js` imported `./unwrap.js` and the other sibling modules, which were never emitted, so importing the root entry failed with "Cannot find module". Only `./client` worked. The root entry is now bundled.

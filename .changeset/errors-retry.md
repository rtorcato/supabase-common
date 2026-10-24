---
'@rtorcato/supabase-common': minor
---

`isRetryable` now also covers PostgREST's transient connection errors (`PGRST000`–`PGRST003`), and `toHttpStatus` maps them to 503. New `withRetry(fn, options?)` retries a write that fails with a retryable error (thrown or returned as `{ error }`) with exponential backoff.

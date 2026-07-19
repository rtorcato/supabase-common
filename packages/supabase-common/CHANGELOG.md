## [1.2.1](https://github.com/rtorcato/supabase-common/compare/v1.2.0...v1.2.1) (2026-07-10)

## 1.7.0

### Minor Changes

- caf77de: Add unverified JWT claim helpers — `decodeClaims`, `getUserId`, `getRole`, `isExpired` (base64url decode of the access-token payload, no client). Closes #32.

## 1.6.0

### Minor Changes

- 89715cb: Add `parsePublicUrl` (inverse of `publicUrl` → `{ bucket, path }`) and `splitPath` (`{ dir, name, ext }`), completing the pure Storage-path helpers from #38.

## 1.5.0

### Minor Changes

- 68e134a: Add `toHttpStatus` — map a Supabase/PostgREST error to the HTTP status an API route should return (409/403/404/400/401/503, else 500), built on the existing error-code predicates.

## 1.4.0

### Minor Changes

- 45eb614: Add `transformUrl` — a pure builder for Supabase's image render endpoint (width/height/resize/quality/format), alongside the existing Storage URL builders.

## 1.3.0

### Minor Changes

- a045986: Add Storage URL builders: `publicUrl`, `authenticatedUrl`, `downloadUrl`, and
  `storageFolder`. Pure string builders (no client, no `@supabase/supabase-js`
  dependency) for constructing Supabase Storage object URLs and reading the
  top-level folder an RLS policy checks via `storage.foldername(name)[1]`.

### Bug Fixes

- **docs:** pin typescript to 5.x so TypeDoc build works ([0521638](https://github.com/rtorcato/supabase-common/commit/0521638646cbe3d4a61dc0ce039fad816baeb58f))

# [1.2.0](https://github.com/rtorcato/supabase-common/compare/v1.1.0...v1.2.0) (2026-07-10)

### Features

- **client:** framework-agnostic Supabase client factories ([db9624c](https://github.com/rtorcato/supabase-common/commit/db9624cfc0f7ebd259e8d76f2866317fef1ca858)), closes [#34](https://github.com/rtorcato/supabase-common/issues/34)

# [1.1.0](https://github.com/rtorcato/supabase-common/compare/v1.0.0...v1.1.0) (2026-07-10)

### Bug Fixes

- **ci:** build before semantic-release so dist is published ([f2e633f](https://github.com/rtorcato/supabase-common/commit/f2e633fb98d90deb416faea04163507b5ee1bb44))
- **deps:** revert typescript to 5.x (7.0 breaks tsup dts build) ([99589df](https://github.com/rtorcato/supabase-common/commit/99589df0b326a2f7c9db7e3f6cd2b24dca5f0f86))
- **tsconfig:** drop baseUrl removed in TypeScript 7 ([5cc241c](https://github.com/rtorcato/supabase-common/commit/5cc241c897b0ff609453d72b07d1fb17c3107f6b))
- update lockfile for demo app deps ([b13dbf8](https://github.com/rtorcato/supabase-common/commit/b13dbf8fd49dd3424c70f17562779553e618dc14))

### Features

- add pagination, list and error-code helpers ([f541467](https://github.com/rtorcato/supabase-common/commit/f5414671446c8cac8cb9d951dc5292196436d322)), closes [#9](https://github.com/rtorcato/supabase-common/issues/9)

# 1.0.0 (2026-07-09)

### Bug Fixes

- **ci:** allow core-js/sharp builds so frozen install passes in CI ([5a77c51](https://github.com/rtorcato/supabase-common/commit/5a77c51f6e75f9bec31a37cb56707eaef746aec4))
- **ci:** drop pnpm version input, use packageManager as the single source ([e2e7d9a](https://github.com/rtorcato/supabase-common/commit/e2e7d9ae11db975ddc22c564aea2af42eee49980))
- **ci:** make knip monorepo-aware and clean docs deps ([2dd5e0c](https://github.com/rtorcato/supabase-common/commit/2dd5e0c25bb7d11ba3c7b8468eeefee0ff8c329c))
- **ci:** set packageManager so pnpm/action-setup resolves a version ([ec4e169](https://github.com/rtorcato/supabase-common/commit/ec4e169a69c3dd98e3daedc3fac5c966fbb839b0))

### Features

- scaffold supabase-common with unwrap helpers and docs site ([e86f569](https://github.com/rtorcato/supabase-common/commit/e86f5692c3b45ad1078c0484fbb2c0269f6c0e96))

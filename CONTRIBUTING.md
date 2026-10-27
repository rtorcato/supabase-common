# Contributing

Thanks for your interest in `supabase-common`, a monorepo of TypeScript helpers
for Supabase: `@rtorcato/supabase-common` (framework-agnostic) and
`@rtorcato/supabase-next` (Next.js App Router adapter).

## Prerequisites

- Node.js >= 22 (see `.nvmrc`)
- [pnpm](https://pnpm.io), the only supported package manager (never `npm` or `yarn`)

## Setup

```bash
pnpm install
```

The workspace holds `packages/*` (the published libraries) and `apps/*` (the
docs site and the demo app). Run the docs site with
`pnpm --filter @rtorcato/supabase-common-docs dev`.

## Workflow

1. Open (or pick up) an issue first. **One issue, one branch, one PR.** Don't
   batch unrelated fixes into a branch.
2. Branch off `main`, named after the issue (e.g. `fix/session-refresh-42`).
3. Make the change in the relevant `packages/<name>` and add or update tests
   (Vitest).
4. Add a changeset if the change reaches consumers (see below).
5. Run the checks below, push, and open a PR with `Closes #<N>` in the body.
   CI must pass before it merges.

## Checks before pushing

Run from the repo root:

| Task | Command |
| --- | --- |
| Everything CI runs, per package (typecheck, Biome, tests, publint) | `pnpm verify` |
| Tests only | `pnpm test` |
| Build | `pnpm build` |
| Lint + format check (and `AGENTS.md` sync) | `pnpm check` |
| Unused files, exports and deps | `pnpm knip` |
| Autofix lint/format | `pnpm check:fix` |

## Commits and PR titles

[Conventional Commits](https://www.conventionalcommits.org), enforced by
commitlint (`feat:`, `fix:`, `docs:`, `chore:`, …, with an optional scope such
as `feat(next): …`). PRs are squash-merged: the commit on `main` takes the
**PR title** (or the commit subject, for a one-commit PR), so both must follow
the same format.

## Changesets

Releases are driven by [changesets](https://github.com/changesets/changesets),
not by commit types. A consumer-facing change needs one:

```bash
pnpm changeset
```

Pick the affected package(s) and bump type (patch/minor/major), write a short
summary, and commit the generated file under `.changeset/`. Docs, CI and other
internal changes need no changeset.

## Releasing

Merging to `main` publishes nothing. Each push to `main` opens or updates a
"Version Packages" PR from the pending changesets. A maintainer merging that PR
is the release: its run waits for approval in the `release` environment, then
publishes the changed packages to npm with provenance.

## Security

Never report a vulnerability in a public issue. See [SECURITY.md](SECURITY.md).

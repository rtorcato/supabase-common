#!/usr/bin/env node
// Adapted from the canonical sync-agents in @rtorcato/repo-tooling
// (`repo-tooling copy claude-sync-agents`) for this monorepo layout.
//
// Regenerates packages/supabase-common/AGENTS.md from the SKILL.md body so the
// two can never drift. SKILL.md (with its YAML frontmatter) is the single source
// of truth; AGENTS.md is its frontmatter-stripped mirror for non-Claude AI tools,
// shipped in the npm package. The root AGENTS.md is the repo's dev guide, so the
// mirror lives in the package instead.
//
//   node scripts/sync-agents.mjs           # write AGENTS.md
//   node scripts/sync-agents.mjs --check   # exit 1 if AGENTS.md is stale (run by `pnpm check`)

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const skillRelative = 'skills/supabase-common/SKILL.md'
const agentsRelative = 'packages/supabase-common/AGENTS.md'
const SKILL = join(root, skillRelative)
const AGENTS = join(root, agentsRelative)

const HEADER = `<!-- Generated from ${skillRelative} by scripts/sync-agents.mjs — do not edit by hand; run \`pnpm sync:agents\`. -->\n\n`

// Strip the leading YAML frontmatter block, keep the markdown body.
const body = readFileSync(SKILL, 'utf8').replace(/^---\n[\s\S]*?\n---\n+/, '')
const expected = HEADER + body

if (process.argv.includes('--check')) {
	let current = ''
	try {
		current = readFileSync(AGENTS, 'utf8')
	} catch {
		// AGENTS.md missing → treat as stale below.
	}
	if (current !== expected) {
		console.error(
			`${agentsRelative} is out of sync with ${skillRelative} — run \`pnpm sync:agents\`.`
		)
		process.exit(1)
	}
	console.log(`${agentsRelative} is in sync with ${skillRelative}.`)
} else {
	writeFileSync(AGENTS, expected)
	console.log(`Wrote ${agentsRelative} from ${skillRelative}`)
}

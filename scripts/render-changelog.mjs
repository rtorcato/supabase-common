// Pure half of sync-changelog.mjs, split out so a test can import it without
// triggering the network fetch that script runs at the top level.

/** Cut `body` at the first `# ` line that is not inside a fenced code block. */
function cutAtH1(body) {
	let fence = null
	const kept = []
	for (const line of body.split('\n')) {
		const open = /^ {0,3}(`{3,}|~{3,})/.exec(line)
		if (fence) {
			// A closing fence uses the same char, is at least as long, and has no info string.
			if (
				open &&
				open[1][0] === fence[0] &&
				open[1].length >= fence.length &&
				!line.slice(open[0].length).trim()
			)
				fence = null
		} else if (open) {
			fence = open[1]
		} else if (line.startsWith('# ')) {
			break
		}
		kept.push(line)
	}
	return kept.join('\n')
}

export function render(releases) {
	// The API does not guarantee date order, and a release body already carries
	// its own version heading and date — so sort here and emit bodies verbatim.
	const sorted = releases
		.filter((r) => !r.draft && r.body?.trim())
		.sort((a, b) => new Date(b.published_at) - new Date(a.published_at))

	if (sorted.length === 0) throw new Error('no releases with a body')
	// Local deviation from the canonical copy: a Changesets release body has no
	// version heading and scoped tags make per-package releases ambiguous, while
	// semantic-release bodies lead with h1 or h2. Give every release one h2.
	// ponytail: re-sync from repo-tooling and keep this map until upstream does it.
	return sorted
		.map((r) => {
			const body = r.body.trim()
			return /^#{1,2} /.test(body)
				? body.replace(/^#{1,2} /, '## ')
				: // supabase-common@1.3.0's body embeds the old CHANGELOG.md (1.2.0 and
					// earlier) after its own notes; those have their own releases, so cut
					// at the first stray h1 — but not a `# ` line inside a code fence.
					`## ${r.tag_name} (${r.published_at.slice(0, 10)})\n\n${cutAtH1(body).trim()}`
		})
		.join('\n\n')
}

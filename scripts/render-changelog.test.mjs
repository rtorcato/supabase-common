import assert from 'node:assert/strict'
import { test } from 'node:test'
import { render } from './render-changelog.mjs'

const release = (body) => ({ tag_name: 'v1.0.0', published_at: '2026-01-02T00:00:00Z', body })

test('cuts a bodyless release at the first stray h1', () => {
	assert.equal(
		render([release('notes\n\n# old changelog\nold')]),
		'## v1.0.0 (2026-01-02)\n\nnotes'
	)
})

test('keeps a `# ` line inside a fenced code block', () => {
	const body = 'notes\n\n```sh\n# install\nnpm i\n```\n\nmore\n\n# old changelog'
	assert.equal(
		render([release(body)]),
		'## v1.0.0 (2026-01-02)\n\nnotes\n\n```sh\n# install\nnpm i\n```\n\nmore'
	)
})

test('a longer fence is not closed by a shorter one', () => {
	const body = '````md\n```\n# inner\n````\n# stray'
	assert.equal(render([release(body)]), '## v1.0.0 (2026-01-02)\n\n````md\n```\n# inner\n````')
})

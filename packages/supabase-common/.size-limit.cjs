const { builtinModules } = require('node:module')
const pkg = require('./package.json')

// Exports-driven size-limit config (the rtorcato/repo-tooling template): one
// budget per exported subpath, computed from package.json at run time so newly
// added modules are covered automatically. Unlike the template, the root '.'
// is budgeted too: here it is the main entry, not a barrel over many modules.

// Node built-ins never reach a consumer's bundle, and size-limit's bundler
// fails on them ("Could not resolve node:fs"), so one Node-only subpath would
// otherwise break the whole run.
const NODE_BUILTINS = builtinModules.flatMap((m) => [m, `node:${m}`])

// Peer dependencies are the consumer's install, not this package's weight.
const IGNORE = [...NODE_BUILTINS, ...Object.keys(pkg.peerDependencies || {})]

// Per-subpath budget overrides, e.g. { './client': '500 B' }.
// ~25% above the measured brotli size (root 1.97 kB, ./client 142 B, 2026-10-27).
const OVERRIDES = { './client': '180 B' }
const DEFAULT_LIMIT = '2.5 kB'

// Resolve the ESM entry file for an exports condition (string, or an object
// with a string `import`, or a nested `import.default`).
function importPath(cond) {
	if (typeof cond === 'string') return cond
	if (cond && typeof cond === 'object') {
		if (typeof cond.import === 'string') return cond.import
		if (cond.import && typeof cond.import === 'object') return cond.import.default
	}
	return undefined
}

module.exports = Object.entries(pkg.exports || {})
	.filter(([sub]) => sub !== './package.json')
	.map(([sub, cond]) => [sub, importPath(cond)])
	.filter(([, file]) => typeof file === 'string' && !file.endsWith('.json'))
	.map(([sub, file]) => ({
		name: `${pkg.name}${sub.slice(1)}`,
		path: file.replace(/^\.\//, ''),
		limit: OVERRIDES[sub] || DEFAULT_LIMIT,
		ignore: IGNORE,
	}))

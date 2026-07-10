import base from '@rtorcato/js-tooling/vitest/config'
import { defineConfig, mergeConfig } from 'vitest/config'

// Extend the shared js-tooling preset, adding only what's specific to this
// package: the setup file, and excluding the docs app's Playwright specs
// (apps/docs/tests/*.spec.ts) which are run by Playwright, not Vitest.
export default mergeConfig(
	base,
	defineConfig({
		test: {
			setupFiles: ['./vitest.setup.ts'],
			exclude: ['apps/**'],
		},
	})
)

import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		setupFiles: ['./vitest.setup.ts'],
		// The docs app's Playwright specs (apps/docs/tests/*.spec.ts) are run by
		// Playwright, not Vitest — keep them out of the library test run.
		exclude: [...configDefaults.exclude, 'apps/**'],
	},
})

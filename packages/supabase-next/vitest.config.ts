import base from '@rtorcato/repo-tooling/vitest/config'
import { defineConfig, mergeConfig } from 'vitest/config'

export default mergeConfig(
	base,
	defineConfig({
		test: {
			setupFiles: ['./vitest.setup.ts'],
		},
	})
)

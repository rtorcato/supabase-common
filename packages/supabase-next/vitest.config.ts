import base from '@rtorcato/js-tooling/vitest/config'
import { defineConfig, mergeConfig } from 'vitest/config'

export default mergeConfig(
	base,
	defineConfig({
		test: {
			setupFiles: ['./vitest.setup.ts'],
		},
	})
)

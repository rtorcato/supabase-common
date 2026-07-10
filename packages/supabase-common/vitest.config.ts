import base from '@rtorcato/js-tooling/vitest/config'
import { defineConfig, mergeConfig } from 'vitest/config'

// Extend the shared js-tooling preset, adding only the package-specific setup
// file. (Now scoped under packages/supabase-common, so the old apps/** exclude
// is unnecessary — this vitest run only sees this package's tests.)
export default mergeConfig(
	base,
	defineConfig({
		test: {
			setupFiles: ['./vitest.setup.ts'],
		},
	})
)

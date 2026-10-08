import { getConfig } from '@rtorcato/repo-tooling/tsup'

export default getConfig(
	{
		entry: ['src/index.ts'],
		// The preset defaults to bundle: false, which would leave dist/index.js
		// importing a ./policy.js that is never emitted. Deps stay external
		// via the preset's skipNodeModulesBundle.
		bundle: true,
		format: ['cjs', 'esm'],
		dts: true,
		clean: true,
		splitting: false,
		sourcemap: true,
	},
	process.env.NODE_ENV || 'development'
)

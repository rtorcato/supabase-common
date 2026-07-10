import { getConfig } from '@rtorcato/js-tooling/tsup'

export default getConfig(
	{
		entry: ['src/index.ts'],
		format: ['cjs', 'esm'],
		dts: true,
		clean: true,
		splitting: false,
		sourcemap: true,
	},
	process.env.NODE_ENV || 'development'
)

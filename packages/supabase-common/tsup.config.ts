import { getConfig } from '@rtorcato/js-tooling/tsup'

export default getConfig(
	{
		// Both the root and the `./client` subpath in package.json#exports must be
		// built as entries — newer @rtorcato/js-tooling no longer auto-derives them.
		entry: ['src/index.ts', 'src/client.ts'],
		format: ['cjs', 'esm'],
		dts: true,
		clean: true,
		splitting: false,
		sourcemap: true,
	},
	process.env.NODE_ENV || 'development'
)

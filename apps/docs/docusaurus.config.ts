import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'
import { GITHUB_PROFILE, copyright, projectFamilyItems } from '@rtorcato/shared-docs'
import { themes as prismThemes } from 'prism-react-renderer'

// The @rtorcato open-source family, from the shared single source of truth
// (@rtorcato/shared-docs). Surfaced as a navbar "Projects" dropdown and in the
// footer so every sibling site cross-links to the rest — edit the family once
// in shared-docs and each site picks it up on its next build.
const PROJECT_FAMILY = projectFamilyItems()

const config: Config = {
	title: 'supabase-common',
	tagline:
		'Tree-shakeable TypeScript helpers for Supabase — dependency-free core, optional client factories.',
	favicon: 'img/favicon.svg',

	url: 'https://rtorcato.github.io',
	baseUrl: '/supabase-common/',

	organizationName: 'rtorcato',
	projectName: 'supabase-common',

	onBrokenLinks: 'warn',

	markdown: {
		format: 'detect',
		hooks: {
			onBrokenMarkdownLinks: 'warn',
		},
	},

	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},

	presets: [
		[
			'classic',
			{
				docs: {
					sidebarPath: './sidebars.ts',
					// The marketing landing (src/pages/index.tsx) owns '/', so docs
					// live under '/docs'.
					routeBasePath: '/docs',
					editUrl: 'https://github.com/rtorcato/supabase-common/edit/main/apps/docs/',
				},
				blog: false,
				theme: {
					customCss: './src/css/custom.css',
				},
			} satisfies Preset.Options,
		],
	],

	plugins: [
		[
			'docusaurus-plugin-typedoc',
			{
				// Single barrel: TypeDoc resolves the whole public API from index.ts.
				entryPoints: ['../../src/index.ts'],
				tsconfig: '../../tsconfig.json',
				// The library typechecks on its own toolchain; skip TypeDoc's
				// redundant semantic check against the docs workspace's pinned TS.
				skipErrorChecking: true,
				out: 'docs/api',
				readme: 'none',
				includeVersion: false,
				excludePrivate: true,
				excludeInternal: true,
				excludeExternals: true,
				sort: ['source-order'],
				hidePageTitle: false,
				hideBreadcrumbs: false,
				sidebar: {
					// Let Docusaurus autogenerate the API sidebar from docs/api
					// (see sidebars.ts) rather than TypeDoc emitting a sidebar.cjs.
					autoConfiguration: false,
				},
			},
		],
		[
			'@easyops-cn/docusaurus-search-local',
			{
				hashed: true,
				indexDocs: true,
				indexBlog: false,
				docsRouteBasePath: '/docs',
				highlightSearchTermsOnTargetPage: true,
				searchBarShortcutHint: false,
			},
		],
	],

	themeConfig: {
		colorMode: {
			defaultMode: 'dark',
			respectPrefersColorScheme: true,
		},
		navbar: {
			// The wordmark (light + dark SVG) carries the "supabase-common" name,
			// so the text title stays empty to avoid rendering it twice.
			title: '',
			logo: {
				alt: 'supabase-common',
				src: 'img/logo.svg',
				srcDark: 'img/logo-dark.svg',
				width: 190,
				height: 26,
			},
			items: [
				{ to: '/docs', position: 'left', label: 'Docs' },
				{
					type: 'dropdown',
					label: 'Projects',
					position: 'left',
					items: [{ label: 'All on GitHub →', href: GITHUB_PROFILE }, ...PROJECT_FAMILY],
				},
				{
					href: 'https://github.com/rtorcato/supabase-common',
					label: 'GitHub',
					position: 'right',
				},
				{
					href: 'https://www.npmjs.com/package/@rtorcato/supabase-common',
					label: 'npm',
					position: 'right',
				},
			],
		},
		footer: {
			style: 'dark',
			links: [
				{
					title: 'Documentation',
					items: [
						{ label: 'Installation', to: '/docs/guides/installation' },
						{ label: 'Usage', to: '/docs/guides/usage' },
						{ label: 'Changelog', to: '/docs/changelog' },
					],
				},
				{
					title: 'Resources',
					items: [
						{ label: 'GitHub', href: 'https://github.com/rtorcato/supabase-common' },
						{ label: 'npm', href: 'https://www.npmjs.com/package/@rtorcato/supabase-common' },
						{ label: 'Supabase', href: 'https://supabase.com' },
					],
				},
				{
					title: 'Projects',
					items: PROJECT_FAMILY,
				},
				{
					title: 'Community',
					items: [
						{ label: '@rtorcato', href: GITHUB_PROFILE },
						{ label: 'Issues', href: 'https://github.com/rtorcato/supabase-common/issues' },
						{
							label: 'License (MIT)',
							href: 'https://github.com/rtorcato/supabase-common/blob/main/LICENSE',
						},
					],
				},
			],
			copyright: copyright(),
		},
		prism: {
			theme: prismThemes.vsDark,
			darkTheme: prismThemes.vsDark,
			additionalLanguages: ['bash', 'json', 'typescript'],
		},
	} satisfies Preset.ThemeConfig,
}

export default config

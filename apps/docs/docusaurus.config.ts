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
	tagline: 'Shared, tree-shakeable TypeScript helpers for Supabase — zero runtime dependencies.',
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
					// Docs own the site root; no separate marketing landing page.
					routeBasePath: '/',
					editUrl: 'https://github.com/rtorcato/supabase-common/edit/main/apps/docs/',
				},
				blog: false,
				theme: {
					customCss: './src/css/custom.css',
				},
			} satisfies Preset.Options,
		],
	],

	themeConfig: {
		colorMode: {
			defaultMode: 'dark',
			respectPrefersColorScheme: true,
		},
		navbar: {
			title: 'supabase-common',
			items: [
				{ to: '/', position: 'left', label: 'Docs', activeBasePath: '/' },
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
						{ label: 'Installation', to: '/guides/installation' },
						{ label: 'Usage', to: '/guides/usage' },
						{ label: 'Changelog', to: '/changelog' },
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

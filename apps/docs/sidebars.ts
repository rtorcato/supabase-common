import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

const sidebars: SidebarsConfig = {
	docs: [
		{
			type: 'category',
			label: 'Start here',
			collapsed: false,
			items: ['index', 'guides/installation', 'guides/usage'],
		},
		{
			type: 'category',
			label: 'Releases',
			items: ['changelog'],
		},
	],
}

export default sidebars

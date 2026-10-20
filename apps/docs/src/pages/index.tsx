import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import InstallTabs from '@rtorcato/shared-docs/components/InstallTabs'
import Siblings from '@rtorcato/shared-docs/components/Siblings'
import UseWithAI from '@rtorcato/shared-docs/components/UseWithAI'
import CodeBlock from '@theme/CodeBlock'
import Layout from '@theme/Layout'
import ThemedImage from '@theme/ThemedImage'
import type { ReactElement } from 'react'
import styles from './index.module.css'

const SAMPLE = `import { unwrap } from '@rtorcato/supabase-common'

// Throws SupabaseError on error, returns the row otherwise.
const user = unwrap(await supabase.from('users').select().single())`

export default function Home(): ReactElement {
	const { siteConfig } = useDocusaurusContext()
	const logo = useBaseUrl('img/logo.svg')
	const logoDark = useBaseUrl('img/logo-dark.svg')
	return (
		<Layout title="supabase-common" description={siteConfig.tagline}>
			<main>
				<section className={styles.hero}>
					<div className={styles.mark}>
						<ThemedImage sources={{ light: logo, dark: logoDark }} alt="" width={72} height={72} />
					</div>
					<h1 className={styles.wordmark}>
						supabase-<span className={styles.accent}>common</span>
					</h1>
					<p className={styles.tagline}>{siteConfig.tagline}</p>
					<div className={styles.cta}>
						<Link className={styles.btnPrimary} to="/docs">
							Get started
						</Link>
						<Link className={styles.btnGhost} to="/docs/guides/usage">
							Usage guide
						</Link>
					</div>
					<div className={styles.sample}>
						<CodeBlock language="ts">{SAMPLE}</CodeBlock>
					</div>
					<div className={styles.install}>
						<InstallTabs pkg="@rtorcato/supabase-common" />
					</div>
				</section>
				<UseWithAI
					repo="rtorcato/supabase-common"
					plugin="supabase-common"
					skill="supabase-common"
					pkg="@rtorcato/supabase-common"
				/>
				<Siblings self="@rtorcato/supabase-common" />
			</main>
		</Layout>
	)
}

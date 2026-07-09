import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import InstallTabs from '@rtorcato/shared-docs/components/InstallTabs'
import Siblings from '@rtorcato/shared-docs/components/Siblings'
import CodeBlock from '@theme/CodeBlock'
import Layout from '@theme/Layout'
import type { ReactElement } from 'react'
import styles from './index.module.css'

const SAMPLE = `import { unwrap } from '@rtorcato/supabase-common'

// Throws SupabaseError on error, returns the row otherwise.
const user = unwrap(await supabase.from('users').select().single())`

export default function Home(): ReactElement {
	const { siteConfig } = useDocusaurusContext()
	return (
		<Layout title="supabase-common" description={siteConfig.tagline}>
			<main>
				<section className={styles.hero}>
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
				<Siblings self="@rtorcato/supabase-common" />
			</main>
		</Layout>
	)
}

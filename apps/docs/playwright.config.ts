import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright config for the supabase-common docs site.
 *
 * - Boots the production build via `pnpm serve` (port 3000) — closer to what
 *   users hit on GitHub Pages and free of dev-server HMR flake.
 * - Two chromium projects: mobile (Pixel 7) and desktop (1280x720). The mobile
 *   nav drawer is the main thing worth smoke-testing.
 */

const PORT = 3000
const BASE_URL = `http://localhost:${PORT}/supabase-common/`

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
	use: {
		baseURL: BASE_URL,
		colorScheme: 'dark',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
	},
	projects: [
		{
			name: 'mobile',
			// Pixel 7 is chromium-based, so both projects stay in one engine.
			use: { ...devices['Pixel 7'] },
		},
		{
			name: 'desktop',
			use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } },
		},
	],
	webServer: {
		// `serve` requires a prior `build`; chain them so a clean `pnpm test:e2e` works.
		command: `pnpm run build && pnpm run serve --port ${PORT}`,
		url: BASE_URL,
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
		stdout: 'ignore',
		stderr: 'pipe',
	},
})

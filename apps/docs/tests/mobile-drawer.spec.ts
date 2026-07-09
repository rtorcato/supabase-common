import { expect, test } from '@playwright/test'

// Smoke test for the stock Docusaurus mobile nav drawer — the hamburger menu
// only renders on narrow viewports, so these run on the `mobile` project only.
test.describe('mobile drawer', () => {
	test.skip(({ viewport }) => (viewport?.width ?? 0) > 996, 'mobile viewport only')

	test('opens and shows the primary nav links', async ({ page }) => {
		await page.goto('/')
		const toggle = page.getByRole('button', { name: /toggle navigation/i })
		await expect(toggle).toHaveAttribute('aria-expanded', 'false')
		await toggle.click()
		await expect(toggle).toHaveAttribute('aria-expanded', 'true')

		const drawer = page.locator('.navbar-sidebar')
		await expect(drawer.getByRole('link', { name: 'Docs', exact: true })).toBeVisible()
		await expect(drawer.getByRole('link', { name: 'GitHub' })).toBeVisible()
	})

	test('tapping a link navigates and closes the drawer', async ({ page }) => {
		await page.goto('/')
		const toggle = page.getByRole('button', { name: /toggle navigation/i })
		await toggle.click()

		const docsLink = page
			.locator('.navbar-sidebar')
			.getByRole('link', { name: 'Docs', exact: true })
		await expect(docsLink).toBeVisible()
		await docsLink.click()

		await expect(page).toHaveURL(/\/docs\/?$/)
		await expect(toggle).toHaveAttribute('aria-expanded', 'false')
	})
})

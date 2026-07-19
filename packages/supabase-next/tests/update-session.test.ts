import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the underlying client so we control what getClaims() returns and never
// touch the network or @supabase/ssr internals.
const getClaims = vi.fn()
vi.mock('@rtorcato/supabase-common/client', () => ({
	createServerClient: () => ({ auth: { getClaims } }),
	createBrowserClient: () => ({}),
}))

const { updateSession } = await import('../src/index.js')

const opts = { supabaseUrl: 'https://x.supabase.co', supabaseKey: 'anon' }
const req = (path: string) => new NextRequest(`https://app.test${path}`)

describe('updateSession', () => {
	beforeEach(() => getClaims.mockReset())

	it('redirects unauthenticated requests to protected paths', async () => {
		getClaims.mockResolvedValue({ data: null })
		const res = await updateSession(req('/dashboard'), opts)
		expect(res.status).toBe(307)
		expect(res.headers.get('location')).toBe('https://app.test/auth/login')
	})

	it('lets authenticated requests through', async () => {
		getClaims.mockResolvedValue({ data: { claims: { sub: 'user-1' } } })
		const res = await updateSession(req('/dashboard'), opts)
		expect(res.status).toBe(200)
		expect(res.headers.get('location')).toBeNull()
	})

	it('does not redirect unauthenticated requests to public paths', async () => {
		getClaims.mockResolvedValue({ data: null })
		const res = await updateSession(req('/login'), opts)
		expect(res.status).toBe(200)
	})

	it('honours a custom loginPath and isPublicPath', async () => {
		getClaims.mockResolvedValue({ data: null })
		const res = await updateSession(req('/secret'), {
			...opts,
			loginPath: '/signin',
			isPublicPath: (p) => p === '/open',
		})
		expect(res.headers.get('location')).toBe('https://app.test/signin')
	})
})

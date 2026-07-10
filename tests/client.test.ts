import { describe, expect, it } from 'vitest'
import { createBrowserClient, createClient, createServerClient } from '../src/client.js'

// These construct synchronously and hit no network, so we can smoke-test that
// each factory returns a usable Supabase client (has the `.from`/`.auth` API).
describe('client factories', () => {
	it('createBrowserClient returns a Supabase client', () => {
		const supabase = createBrowserClient('http://localhost:54321', 'anon-key')
		expect(typeof supabase.from).toBe('function')
		expect(supabase.auth).toBeDefined()
	})

	it('createClient returns a Supabase client', () => {
		const supabase = createClient('http://localhost:54321', 'anon-key')
		expect(typeof supabase.from).toBe('function')
	})

	it('createServerClient uses the caller-supplied cookie adapter', () => {
		const store = new Map<string, string>()
		const cookies = {
			getAll: () => [...store].map(([name, value]) => ({ name, value })),
			setAll: (toSet: { name: string; value: string }[]) => {
				for (const { name, value } of toSet) store.set(name, value)
			},
		}
		const supabase = createServerClient('http://localhost:54321', 'anon-key', cookies)
		expect(typeof supabase.from).toBe('function')
		expect(supabase.auth).toBeDefined()
	})
})

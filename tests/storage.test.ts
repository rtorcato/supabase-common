import { describe, expect, it } from 'vitest'
import { authenticatedUrl, downloadUrl, publicUrl, storageFolder } from '../src/index.js'

const URL = 'https://abc.supabase.co'

describe('publicUrl / authenticatedUrl', () => {
	it('builds the storage object path', () => {
		expect(publicUrl(URL, 'avatars', 'a.png')).toBe(
			'https://abc.supabase.co/storage/v1/object/public/avatars/a.png'
		)
		expect(authenticatedUrl(URL, 'docs', 'x/y.pdf')).toBe(
			'https://abc.supabase.co/storage/v1/object/authenticated/docs/x/y.pdf'
		)
	})

	it('normalises stray slashes on the base url and path', () => {
		expect(publicUrl('https://abc.supabase.co/', 'b', '/nested/a.png')).toBe(
			'https://abc.supabase.co/storage/v1/object/public/b/nested/a.png'
		)
	})
})

describe('downloadUrl', () => {
	it('appends ?download, optionally with a filename', () => {
		expect(downloadUrl(URL, 'b', 'a.png')).toBe(
			'https://abc.supabase.co/storage/v1/object/public/b/a.png?download'
		)
		expect(downloadUrl(URL, 'b', 'a.png', 'my file.png')).toBe(
			'https://abc.supabase.co/storage/v1/object/public/b/a.png?download=my%20file.png'
		)
	})
})

describe('storageFolder', () => {
	it('returns the first path segment, or empty for a bare file', () => {
		expect(storageFolder('user-123/avatars/a.png')).toBe('user-123')
		expect(storageFolder('/user-123/a.png')).toBe('user-123')
		expect(storageFolder('a.png')).toBe('')
	})
})

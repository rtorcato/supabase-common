import { describe, expect, it } from 'vitest'
import {
	authenticatedUrl,
	downloadUrl,
	parsePublicUrl,
	publicUrl,
	splitPath,
	storageFolder,
	transformUrl,
} from '../src/index.js'

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

describe('transformUrl', () => {
	it('hits the render endpoint with no query when no options given', () => {
		expect(transformUrl(URL, 'avatars', 'a.png')).toBe(
			'https://abc.supabase.co/storage/v1/render/image/public/avatars/a.png'
		)
	})

	it('serialises transform options as query params', () => {
		expect(
			transformUrl(URL, 'avatars', 'a.png', {
				width: 100,
				height: 200,
				resize: 'contain',
				quality: 80,
				format: 'origin',
			})
		).toBe(
			'https://abc.supabase.co/storage/v1/render/image/public/avatars/a.png?width=100&height=200&resize=contain&quality=80&format=origin'
		)
	})

	it('omits unset options', () => {
		expect(transformUrl(URL, 'b', 'a.png', { width: 50 })).toBe(
			'https://abc.supabase.co/storage/v1/render/image/public/b/a.png?width=50'
		)
	})
})

describe('parsePublicUrl', () => {
	it('is the inverse of publicUrl', () => {
		expect(parsePublicUrl(publicUrl(URL, 'avatars', 'nested/a.png'))).toEqual({
			bucket: 'avatars',
			path: 'nested/a.png',
		})
	})

	it('ignores query/hash and decodes the path', () => {
		expect(parsePublicUrl(downloadUrl(URL, 'docs', 'a b.pdf', 'x'))).toEqual({
			bucket: 'docs',
			path: 'a b.pdf',
		})
		expect(parsePublicUrl('https://abc.supabase.co/storage/v1/object/public/b/a%20b.png')).toEqual({
			bucket: 'b',
			path: 'a b.png',
		})
	})

	it('returns null for non-public-object URLs', () => {
		expect(parsePublicUrl(authenticatedUrl(URL, 'b', 'a.png'))).toBeNull()
		expect(parsePublicUrl('https://example.com/whatever')).toBeNull()
		expect(parsePublicUrl('https://abc.supabase.co/storage/v1/object/public/b')).toBeNull()
	})
})

describe('splitPath', () => {
	it('splits dir / name / ext', () => {
		expect(splitPath('user-1/avatars/a.png')).toEqual({
			dir: 'user-1/avatars',
			name: 'a',
			ext: 'png',
		})
		expect(splitPath('a.png')).toEqual({ dir: '', name: 'a', ext: 'png' })
		expect(splitPath('a.tar.gz')).toEqual({ dir: '', name: 'a.tar', ext: 'gz' })
		expect(splitPath('/x/y/README')).toEqual({ dir: 'x/y', name: 'README', ext: '' })
		expect(splitPath('.gitignore')).toEqual({ dir: '', name: '.gitignore', ext: '' })
	})
})

describe('storageFolder', () => {
	it('returns the first path segment, or empty for a bare file', () => {
		expect(storageFolder('user-123/avatars/a.png')).toBe('user-123')
		expect(storageFolder('/user-123/a.png')).toBe('user-123')
		expect(storageFolder('a.png')).toBe('')
	})
})

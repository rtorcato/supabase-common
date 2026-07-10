import { describe, expect, it } from 'vitest'
import { isPublicPathDefault } from '../src/policy.js'

describe('isPublicPathDefault', () => {
	it('treats /, /login*, and /auth* as public', () => {
		expect(isPublicPathDefault('/')).toBe(true)
		expect(isPublicPathDefault('/login')).toBe(true)
		expect(isPublicPathDefault('/login/sso')).toBe(true)
		expect(isPublicPathDefault('/auth')).toBe(true)
		expect(isPublicPathDefault('/auth/callback')).toBe(true)
	})

	it('treats every other path as protected', () => {
		expect(isPublicPathDefault('/dashboard')).toBe(false)
		expect(isPublicPathDefault('/protected')).toBe(false)
		expect(isPublicPathDefault('/settings/login')).toBe(false)
	})
})

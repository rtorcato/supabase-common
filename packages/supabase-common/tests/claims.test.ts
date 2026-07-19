import { describe, expect, it } from 'vitest'
import { decodeClaims, getRole, getUserId, isExpired } from '../src/index.js'

// Build an unsigned JWT (header.payload.sig) with base64url — no padding, like real tokens.
const jwt = (claims: object) =>
	`eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.sig`

const CLAIMS = {
	sub: 'user-123',
	role: 'authenticated',
	email: 'a@b.co',
	exp: 2_000_000_000,
}

describe('decodeClaims', () => {
	it('decodes the payload (unverified)', () => {
		expect(decodeClaims(jwt(CLAIMS))).toEqual(CLAIMS)
	})

	it('handles non-ASCII claim values', () => {
		expect(decodeClaims(jwt({ email: 'josé@exämple.com' }))?.email).toBe('josé@exämple.com')
	})

	it('returns null for anything that is not a 3-part JWT', () => {
		expect(decodeClaims('not.a.jwt')).toBeNull() // payload not valid base64/JSON
		expect(decodeClaims('onlyonepart')).toBeNull()
		expect(decodeClaims('')).toBeNull()
	})
})

describe('getUserId / getRole', () => {
	it('pull sub and role', () => {
		expect(getUserId(jwt(CLAIMS))).toBe('user-123')
		expect(getRole(jwt(CLAIMS))).toBe('authenticated')
		expect(getUserId('garbage')).toBeUndefined()
	})
})

describe('isExpired', () => {
	it('compares exp (seconds) against now (ms)', () => {
		expect(isExpired({ exp: 1000 }, 2000 * 1000)).toBe(true) // 1000s < 2000s
		expect(isExpired({ exp: 3000 }, 2000 * 1000)).toBe(false) // 3000s > 2000s
	})

	it('treats a missing exp as not expired', () => {
		expect(isExpired({})).toBe(false)
	})
})

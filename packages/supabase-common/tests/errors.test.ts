import { describe, expect, it } from 'vitest'
import {
	getErrorCode,
	isForeignKeyViolation,
	isNotFound,
	isRetryable,
	isRlsViolation,
	isUniqueViolation,
	SupabaseError,
	toHttpStatus,
} from '../src/index.js'

describe('getErrorCode', () => {
	it('reads a string code off any error-like object', () => {
		expect(getErrorCode({ code: '23505' })).toBe('23505')
		expect(getErrorCode(new SupabaseError({ message: 'x', code: '42501' }))).toBe('42501')
	})

	it('returns undefined when there is no string code', () => {
		expect(getErrorCode({ code: 500 })).toBeUndefined()
		expect(getErrorCode(new Error('x'))).toBeUndefined()
		expect(getErrorCode(null)).toBeUndefined()
	})
})

describe('code predicates', () => {
	it('match their SQLSTATE / PostgREST codes', () => {
		expect(isUniqueViolation({ code: '23505' })).toBe(true)
		expect(isForeignKeyViolation({ code: '23503' })).toBe(true)
		expect(isRlsViolation({ code: '42501' })).toBe(true)
		expect(isNotFound({ code: 'PGRST116' })).toBe(true)
	})

	it('do not match unrelated codes', () => {
		expect(isUniqueViolation({ code: '23503' })).toBe(false)
		expect(isNotFound(new Error('x'))).toBe(false)
	})

	it('isRetryable covers serialization failure and deadlock only', () => {
		expect(isRetryable({ code: '40001' })).toBe(true)
		expect(isRetryable({ code: '40P01' })).toBe(true)
		expect(isRetryable({ code: '23505' })).toBe(false)
	})
})

describe('toHttpStatus', () => {
	it('maps error codes to HTTP statuses', () => {
		expect(toHttpStatus({ code: '23505' })).toBe(409) // unique
		expect(toHttpStatus({ code: '23503' })).toBe(409) // foreign key
		expect(toHttpStatus({ code: '23502' })).toBe(400) // not null
		expect(toHttpStatus({ code: '23514' })).toBe(400) // check
		expect(toHttpStatus({ code: '42501' })).toBe(403) // RLS
		expect(toHttpStatus({ code: 'PGRST301' })).toBe(401) // jwt expired
		expect(toHttpStatus({ code: 'PGRST116' })).toBe(404) // no rows
		expect(toHttpStatus({ code: '40001' })).toBe(503) // retryable
	})

	it('falls back to 500 for unknown or non-errors', () => {
		expect(toHttpStatus({ code: 'XX000' })).toBe(500)
		expect(toHttpStatus(new Error('boom'))).toBe(500)
		expect(toHttpStatus(null)).toBe(500)
	})
})

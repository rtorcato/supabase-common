import { describe, expect, it, vi } from 'vitest'
import {
	getErrorCode,
	isForeignKeyViolation,
	isNotFound,
	isRetryable,
	isRlsViolation,
	isUniqueViolation,
	SupabaseError,
	toHttpStatus,
	withRetry,
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

	it('isRetryable covers serialization, deadlock and PostgREST connection errors only', () => {
		for (const code of ['40001', '40P01', 'PGRST000', 'PGRST001', 'PGRST002', 'PGRST003']) {
			expect(isRetryable({ code })).toBe(true)
		}
		expect(isRetryable({ code: '23505' })).toBe(false)
		expect(isRetryable(new Error('fetch failed'))).toBe(false)
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
		expect(toHttpStatus({ code: 'PGRST002' })).toBe(503) // schema cache unavailable
	})

	it('falls back to 500 for unknown or non-errors', () => {
		expect(toHttpStatus({ code: 'XX000' })).toBe(500)
		expect(toHttpStatus(new Error('boom'))).toBe(500)
		expect(toHttpStatus(null)).toBe(500)
	})
})

describe('withRetry', () => {
	const transient = { code: '40001', message: 'serialization failure' }

	it('retries a retryable { error } result and returns the eventual success', async () => {
		vi.useFakeTimers()
		const fn = vi
			.fn()
			.mockResolvedValueOnce({ data: null, error: transient })
			.mockResolvedValueOnce({ data: 1, error: null })
		const p = withRetry(fn)
		await vi.runAllTimersAsync()
		await expect(p).resolves.toEqual({ data: 1, error: null })
		expect(fn).toHaveBeenCalledTimes(2)
		vi.useRealTimers()
	})

	it('retries a thrown retryable error, then rethrows once attempts run out', async () => {
		vi.useFakeTimers()
		const fn = vi.fn().mockRejectedValue(new SupabaseError(transient))
		const p = withRetry(fn, { attempts: 3 })
		const assertion = expect(p).rejects.toBeInstanceOf(SupabaseError)
		await vi.runAllTimersAsync()
		await assertion
		expect(fn).toHaveBeenCalledTimes(3)
		vi.useRealTimers()
	})

	it('returns a non-retryable error result immediately', async () => {
		const result = { data: null, error: { code: '23505', message: 'dup' } }
		const fn = vi.fn().mockResolvedValue(result)
		await expect(withRetry(fn)).resolves.toBe(result)
		expect(fn).toHaveBeenCalledTimes(1)
	})

	it('handles a fn that resolves with nothing, and honours shouldRetry', async () => {
		const fn = vi.fn().mockResolvedValue(undefined)
		await expect(withRetry(fn)).resolves.toBeUndefined()
		expect(fn).toHaveBeenCalledTimes(1)

		const flaky = vi.fn().mockRejectedValue(new Error('x'))
		await expect(withRetry(flaky, { shouldRetry: () => false })).rejects.toThrow('x')
		expect(flaky).toHaveBeenCalledTimes(1)
	})
})

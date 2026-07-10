import { describe, expect, it } from 'vitest'
import { isSupabaseError, SupabaseError, unwrap, unwrapArray, unwrapMaybe } from '../src/index.js'

describe('unwrap', () => {
	it('returns data when there is no error', () => {
		expect(unwrap({ data: { id: 1 }, error: null })).toEqual({ id: 1 })
	})

	it('throws SupabaseError carrying code/details when the result errors', () => {
		const call = () =>
			unwrap({ data: null, error: { message: 'nope', code: '42501', details: 'RLS' } })
		expect(call).toThrowError(SupabaseError)
		expect(call).toThrowError('nope')
		try {
			call()
		} catch (e) {
			expect((e as SupabaseError).code).toBe('42501')
			expect((e as SupabaseError).details).toBe('RLS')
		}
	})

	it('throws when both data and error are null', () => {
		expect(() => unwrap({ data: null, error: null })).toThrowError(SupabaseError)
	})
})

describe('unwrapMaybe', () => {
	it('returns null for a missing row instead of throwing', () => {
		expect(unwrapMaybe({ data: null, error: null })).toBeNull()
	})

	it('still throws on a real error', () => {
		expect(() => unwrapMaybe({ data: null, error: { message: 'boom' } })).toThrowError(
			SupabaseError
		)
	})
})

describe('unwrapArray', () => {
	it('returns the rows on success', () => {
		expect(unwrapArray({ data: [{ id: 1 }, { id: 2 }], error: null })).toEqual([
			{ id: 1 },
			{ id: 2 },
		])
	})

	it('coerces null data to an empty array', () => {
		expect(unwrapArray({ data: null, error: null })).toEqual([])
	})

	it('throws on a real error', () => {
		expect(() => unwrapArray({ data: null, error: { message: 'boom' } })).toThrowError(
			SupabaseError
		)
	})
})

describe('isSupabaseError', () => {
	it('narrows a SupabaseError', () => {
		expect(isSupabaseError(new SupabaseError({ message: 'x' }))).toBe(true)
	})

	it('rejects other values', () => {
		expect(isSupabaseError(new Error('x'))).toBe(false)
		expect(isSupabaseError({ message: 'x' })).toBe(false)
		expect(isSupabaseError(null)).toBe(false)
	})
})

import { describe, expect, it } from 'vitest'
import {
	errorCode,
	isForeignKeyViolation,
	isNoRows,
	isNotNullViolation,
	isRlsDenied,
	isUniqueViolation,
	PG_ERROR,
	PGRST_ERROR,
	SupabaseError,
} from '../src/index.js'

describe('errorCode', () => {
	it('reads the code off a raw PostgREST error object', () => {
		expect(errorCode({ code: '23505', message: 'dup' })).toBe('23505')
	})

	it('reads the code off a thrown SupabaseError', () => {
		expect(errorCode(new SupabaseError({ message: 'x', code: '42501' }))).toBe('42501')
	})

	it('returns undefined for non-errors and missing/non-string codes', () => {
		expect(errorCode(null)).toBeUndefined()
		expect(errorCode('boom')).toBeUndefined()
		expect(errorCode({ message: 'no code' })).toBeUndefined()
		expect(errorCode({ code: 42501 })).toBeUndefined()
	})
})

describe('guards', () => {
	it('match on the documented codes', () => {
		expect(isUniqueViolation({ code: PG_ERROR.uniqueViolation })).toBe(true)
		expect(isForeignKeyViolation({ code: PG_ERROR.foreignKeyViolation })).toBe(true)
		expect(isNotNullViolation({ code: PG_ERROR.notNullViolation })).toBe(true)
		expect(isRlsDenied({ code: PG_ERROR.insufficientPrivilege })).toBe(true)
		expect(isNoRows({ code: PGRST_ERROR.noRows })).toBe(true)
	})

	it('do not cross-match or match non-errors', () => {
		expect(isUniqueViolation({ code: '42501' })).toBe(false)
		expect(isRlsDenied(new SupabaseError({ message: 'dup', code: '23505' }))).toBe(false)
		expect(isNoRows(null)).toBe(false)
	})
})

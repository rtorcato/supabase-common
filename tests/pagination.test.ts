import { describe, expect, it } from 'vitest'
import { paged, range, SupabaseError } from '../src/index.js'

describe('range', () => {
	it('maps a 1-based page to a 0-based inclusive tuple', () => {
		expect(range(1, 20)).toEqual([0, 19])
		expect(range(2, 20)).toEqual([20, 39])
		expect(range(3, 10)).toEqual([20, 29])
	})

	it('clamps and floors bad input to page 1 / size 1', () => {
		expect(range(0, 20)).toEqual([0, 19])
		expect(range(-5, 20)).toEqual([0, 19])
		expect(range(1, 0)).toEqual([0, 0])
		expect(range(2.9, 10.9)).toEqual([10, 19])
	})
})

describe('paged', () => {
	it('builds the envelope from a count query', () => {
		const result = { data: [{ id: 1 }, { id: 2 }], error: null, count: 42 }
		expect(paged(result, 1, 20)).toEqual({
			rows: [{ id: 1 }, { id: 2 }],
			count: 42,
			page: 1,
			pageSize: 20,
			pageCount: 3,
			hasMore: true,
		})
	})

	it('reports no more pages on the last page', () => {
		const result = { data: [{ id: 1 }], error: null, count: 21 }
		expect(paged(result, 2, 20).hasMore).toBe(false)
	})

	it('falls back to row count when the query had no count', () => {
		const result = { data: [{ id: 1 }, { id: 2 }], error: null }
		expect(paged(result, 1, 20)).toMatchObject({ count: 2, pageCount: 1, hasMore: false })
	})

	it('coerces null data to an empty page', () => {
		const result = { data: null, error: null, count: 0 }
		expect(paged(result, 1, 20)).toMatchObject({ rows: [], count: 0, pageCount: 0 })
	})

	it('throws SupabaseError on a real error', () => {
		expect(() => paged({ data: null, error: { message: 'boom' } }, 1, 20)).toThrowError(
			SupabaseError
		)
	})
})

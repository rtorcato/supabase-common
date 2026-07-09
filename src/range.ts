/**
 * Supabase-specific pagination glue. `@rtorcato/db-common` owns the generic
 * page math; this only translates a 1-based page into the 0-based, inclusive
 * `{ from, to }` tuple that Supabase's `.range(from, to)` expects.
 *
 *   const { from, to } = toRange(2, 25) // page 2, 25/page → { from: 25, to: 49 }
 *   supabase.from('rows').select().order('id').range(from, to)
 *
 * Call `.order()` (with a unique tie-breaker column) before `.range()`, or rows
 * can repeat/skip across pages.
 */
export interface Range {
	/** 0-based index of the first row, inclusive. */
	from: number
	/** 0-based index of the last row, inclusive. */
	to: number
}

/**
 * Convert a 1-based page + page size into Supabase's inclusive `.range()`
 * tuple. Clamps both to a minimum of 1 and floors non-integers, since these
 * values usually arrive from query strings.
 */
export function toRange(page: number, size: number): Range {
	const limit = Math.max(1, Math.floor(size) || 1)
	const safePage = Math.max(1, Math.floor(page) || 1)
	const from = (safePage - 1) * limit
	return { from, to: from + limit - 1 }
}

/**
 * Total number of pages for a row `total` at page `size` — pair it with the
 * `count` Supabase returns when you pass `{ count: 'exact' }`.
 */
export function pageCount(total: number, size: number): number {
	const limit = Math.max(1, Math.floor(size) || 1)
	const safeTotal = Math.max(0, Math.floor(total) || 0)
	return Math.ceil(safeTotal / limit)
}

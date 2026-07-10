import { type PostgrestLike, unwrapArray } from './unwrap.js'

/**
 * A list result that may also carry PostgREST's `count` (populated when the
 * query was built with `.select('*', { count: 'exact' })` or similar).
 */
export interface PostgrestListLike<T> extends PostgrestLike<T[]> {
	count?: number | null
}

/** The envelope {@link paged} returns — rows plus everything a pager UI needs. */
export interface PagedResult<T> {
	rows: T[]
	/** Total matching rows. Falls back to `rows.length` when the query didn't ask for a count. */
	count: number
	page: number
	pageSize: number
	/** Total number of pages for `count` at this `pageSize`. */
	pageCount: number
	/** Whether another page exists after this one. */
	hasMore: boolean
}

/**
 * Turn a 1-based page + page size into the `[from, to]` tuple PostgREST's
 * `.range()` wants (0-based, inclusive). Spread it straight in:
 *
 *   supabase.from('users').select('*', { count: 'exact' }).range(...range(page, 20))
 *
 * `page` and `pageSize` are clamped to sane minimums (1) and floored.
 */
export function range(page: number, pageSize: number): [from: number, to: number] {
	const size = Math.max(1, Math.floor(pageSize))
	const p = Math.max(1, Math.floor(page))
	const from = (p - 1) * size
	return [from, from + size - 1]
}

/**
 * Unwrap a paginated count query into a ready-to-return envelope. Throws
 * {@link SupabaseError} on error. Pass the same `page`/`pageSize` you gave
 * {@link range}. If the query didn't request a count, `count` falls back to
 * the number of rows returned (so `pageCount`/`hasMore` degrade gracefully).
 *
 *   const result = await supabase.from('users').select('*', { count: 'exact' }).range(...range(page, 20))
 *   return paged(result, page, 20)
 */
export function paged<T>(
	result: PostgrestListLike<T>,
	page: number,
	pageSize: number
): PagedResult<T> {
	const rows = unwrapArray(result)
	const size = Math.max(1, Math.floor(pageSize))
	const p = Math.max(1, Math.floor(page))
	const count = result.count ?? rows.length
	return {
		rows,
		count,
		page: p,
		pageSize: size,
		pageCount: Math.ceil(count / size),
		hasMore: p * size < count,
	}
}

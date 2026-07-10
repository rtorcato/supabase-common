/**
 * The error shape PostgREST / Supabase attaches to a failed result. Structural
 * only, so it matches `@supabase/supabase-js` errors without depending on it.
 */
export interface PostgrestErrorLike {
	message: string
	code?: string
	details?: string
}

/**
 * The shape every Supabase / PostgREST call resolves to: exactly one of
 * `data` or `error` is meaningful. `unwrap` collapses that into the value
 * (or a throw), so callers stop writing `if (error) throw error` everywhere.
 *
 * Structural only — no `@supabase/supabase-js` dependency, so it works with
 * any result that carries `{ data, error }`.
 */
export interface PostgrestLike<T> {
	data: T | null
	error: PostgrestErrorLike | null
}

/** Error thrown by {@link unwrap} when the Supabase result carries an error. */
export class SupabaseError extends Error {
	readonly code?: string
	readonly details?: string
	constructor(error: PostgrestErrorLike) {
		super(error.message)
		this.name = 'SupabaseError'
		this.code = error.code
		this.details = error.details
	}
}

/** Type guard for narrowing an unknown `catch` value to {@link SupabaseError}. */
export function isSupabaseError(err: unknown): err is SupabaseError {
	return err instanceof SupabaseError
}

/**
 * Return `data`, or throw {@link SupabaseError} if the result carried an error.
 * Also throws when both `data` and `error` are null (an unexpected empty
 * result), so a `null` return always means the row genuinely doesn't exist.
 *
 *   const user = unwrap(await supabase.from('users').select().single())
 */
export function unwrap<T>(result: PostgrestLike<T>): T {
	if (result.error) throw new SupabaseError(result.error)
	if (result.data === null) {
		throw new SupabaseError({ message: 'Supabase result had no data and no error' })
	}
	return result.data
}

/**
 * Like {@link unwrap}, but returns `null` for a missing row instead of
 * throwing. Still throws on an actual error. Use for "find or nothing" reads.
 *
 *   const maybe = unwrapMaybe(await supabase.from('users').select().maybeSingle())
 */
export function unwrapMaybe<T>(result: PostgrestLike<T>): T | null {
	if (result.error) throw new SupabaseError(result.error)
	return result.data
}

/**
 * Unwrap a list query: throw on error, otherwise return the rows — coercing a
 * `null` payload to `[]` so callers can always `.map()`/`.length` the result.
 *
 *   const rows = unwrapArray(await supabase.from('users').select())
 */
export function unwrapArray<T>(result: PostgrestLike<T[]>): T[] {
	if (result.error) throw new SupabaseError(result.error)
	return result.data ?? []
}

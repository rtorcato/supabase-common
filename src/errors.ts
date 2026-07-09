/**
 * PostgREST / Supabase error codes as constants, plus structural guards so
 * callers can branch on *why* a call failed instead of string-matching
 * messages. Every guard reads `.code` structurally — it works on a thrown
 * {@link SupabaseError}, a raw PostgREST error object, or anything with a
 * `code` field, so there's no `@supabase/supabase-js` dependency.
 */

/** Native Postgres SQLSTATE codes surfaced by PostgREST in `error.code`. */
export const PG_ERROR = {
	uniqueViolation: '23505',
	foreignKeyViolation: '23503',
	notNullViolation: '23502',
	checkViolation: '23514',
	/** RLS policy denial / missing grant. */
	insufficientPrivilege: '42501',
} as const

/** PostgREST-native error codes (the `PGRSTxxx` family). */
export const PGRST_ERROR = {
	/** `.single()` / `.maybeSingle()` matched zero rows (or more than one). */
	noRows: 'PGRST116',
	/** JWT missing, expired, or invalid. */
	jwt: 'PGRST301',
} as const

/** Read the PostgREST / Postgres error code off any error-like value. */
export function errorCode(err: unknown): string | undefined {
	if (typeof err === 'object' && err !== null && 'code' in err) {
		const code = (err as { code?: unknown }).code
		return typeof code === 'string' ? code : undefined
	}
	return undefined
}

/** Unique-constraint violation (`23505`) — e.g. a duplicate insert. */
export function isUniqueViolation(err: unknown): boolean {
	return errorCode(err) === PG_ERROR.uniqueViolation
}

/** Foreign-key violation (`23503`). */
export function isForeignKeyViolation(err: unknown): boolean {
	return errorCode(err) === PG_ERROR.foreignKeyViolation
}

/** Not-null violation (`23502`). */
export function isNotNullViolation(err: unknown): boolean {
	return errorCode(err) === PG_ERROR.notNullViolation
}

/** Check-constraint violation (`23514`). */
export function isCheckViolation(err: unknown): boolean {
	return errorCode(err) === PG_ERROR.checkViolation
}

/** RLS policy denied the operation / caller lacks privilege (`42501`). */
export function isRlsDenied(err: unknown): boolean {
	return errorCode(err) === PG_ERROR.insufficientPrivilege
}

/** No rows for a `.single()` / `.maybeSingle()` query (`PGRST116`). */
export function isNoRows(err: unknown): boolean {
	return errorCode(err) === PGRST_ERROR.noRows
}

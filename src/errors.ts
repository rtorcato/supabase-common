/**
 * The error codes a Supabase dev checks for by hand over and over: Postgres
 * SQLSTATEs surfaced through PostgREST, plus PostgREST's own `PGRSTxxx` codes.
 * Named here so callers stop sprinkling magic strings like `'23505'`.
 */
export const PG_ERROR_CODES = {
	uniqueViolation: '23505',
	foreignKeyViolation: '23503',
	notNullViolation: '23502',
	checkViolation: '23514',
	exclusionViolation: '23P01',
	/** RLS / permission denied (`insufficient_privilege`). */
	insufficientPrivilege: '42501',
	/** Serialization failure — safe to retry. */
	serializationFailure: '40001',
	/** Deadlock — safe to retry. */
	deadlockDetected: '40P01',
	/** Statement timeout (`query_canceled`). */
	queryCanceled: '57014',
	/** PostgREST: query for a single row matched zero rows. */
	noRows: 'PGRST116',
	/** PostgREST: JWT expired. */
	jwtExpired: 'PGRST301',
} as const

/**
 * Pull the error code off any Supabase/PostgREST error (or {@link SupabaseError}),
 * or `undefined` if there isn't one. Accepts `unknown` so it drops straight into
 * a `catch (err)`.
 */
export function getErrorCode(err: unknown): string | undefined {
	if (err && typeof err === 'object' && 'code' in err) {
		const code = (err as { code?: unknown }).code
		if (typeof code === 'string') return code
	}
	return undefined
}

/** Duplicate key — a `UNIQUE` constraint was violated (`23505`). */
export function isUniqueViolation(err: unknown): boolean {
	return getErrorCode(err) === PG_ERROR_CODES.uniqueViolation
}

/** A `FOREIGN KEY` constraint was violated (`23503`). */
export function isForeignKeyViolation(err: unknown): boolean {
	return getErrorCode(err) === PG_ERROR_CODES.foreignKeyViolation
}

/** A `NOT NULL` constraint was violated (`23502`). */
export function isNotNullViolation(err: unknown): boolean {
	return getErrorCode(err) === PG_ERROR_CODES.notNullViolation
}

/** A `CHECK` constraint was violated (`23514`). */
export function isCheckViolation(err: unknown): boolean {
	return getErrorCode(err) === PG_ERROR_CODES.checkViolation
}

/** RLS or role permission denied (`42501`) — usually "not allowed", not "broken". */
export function isRlsViolation(err: unknown): boolean {
	return getErrorCode(err) === PG_ERROR_CODES.insufficientPrivilege
}

/** A `.single()` query matched zero rows (PostgREST `PGRST116`). */
export function isNotFound(err: unknown): boolean {
	return getErrorCode(err) === PG_ERROR_CODES.noRows
}

/**
 * A transient failure worth retrying: serialization failure or deadlock.
 * Wrap the retry loop yourself; this just tells you the error qualifies.
 */
export function isRetryable(err: unknown): boolean {
	const code = getErrorCode(err)
	return code === PG_ERROR_CODES.serializationFailure || code === PG_ERROR_CODES.deadlockDetected
}

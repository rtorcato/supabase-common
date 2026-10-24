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
	/** PostgREST: could not connect to the database (503) — transient. */
	connectionFailed: 'PGRST000',
	/** PostgREST: internal connection error (503) — transient. */
	connectionError: 'PGRST001',
	/** PostgREST: schema cache not available yet (503) — transient. */
	schemaCacheUnavailable: 'PGRST002',
	/** PostgREST: timed out acquiring a pool connection (504) — transient. */
	poolTimeout: 'PGRST003',
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

const TRANSIENT_CODES: ReadonlySet<string> = new Set([
	PG_ERROR_CODES.serializationFailure,
	PG_ERROR_CODES.deadlockDetected,
	PG_ERROR_CODES.connectionFailed,
	PG_ERROR_CODES.connectionError,
	PG_ERROR_CODES.schemaCacheUnavailable,
	PG_ERROR_CODES.poolTimeout,
])

/**
 * A transient failure worth retrying: serialization failure, deadlock, or a
 * PostgREST connection / schema-cache / pool error (`PGRST000`–`PGRST003`, the
 * 503-class errors the Supabase client's own GET/HEAD retry targets). Network
 * failures carry no code, so they are not detected here.
 * Wrap the retry loop yourself, or use {@link withRetry}.
 */
export function isRetryable(err: unknown): boolean {
	const code = getErrorCode(err)
	return code !== undefined && TRANSIENT_CODES.has(code)
}

export interface WithRetryOptions {
	/** Total tries, including the first. Default `3`. */
	attempts?: number
	/** Delay before the first retry in ms, doubled each time. Default `200`. */
	baseDelayMs?: number
	/** Which errors to retry. Default {@link isRetryable}. */
	shouldRetry?: (err: unknown) => boolean
}

/**
 * Run `fn`, retrying while it fails with a retryable error — thrown, or carried
 * on a resolved `{ data, error }` result. The supabase-js client already retries
 * GET/HEAD itself and never retries writes; this is for writes. Backoff is
 * exponential (no jitter). Returns the last result, or rethrows the last throw.
 *
 * A write that fails mid-flight may or may not have committed, so use it for
 * idempotent writes (upsert, a client-supplied id) or rolled-back errors like
 * `40001` / `40P01`.
 *
 *   await withRetry(() => supabase.from('t').upsert(row))
 */
export async function withRetry<T>(
	fn: () => Promise<T>,
	options: WithRetryOptions = {}
): Promise<T> {
	const { attempts = 3, baseDelayMs = 200, shouldRetry = isRetryable } = options
	for (let attempt = 1; ; attempt++) {
		const last = attempt >= attempts
		try {
			const result = await fn()
			const err = (result as { error?: unknown } | null | undefined)?.error
			if (!err || last || !shouldRetry(err)) return result
		} catch (thrown) {
			if (last || !shouldRetry(thrown)) throw thrown
		}
		await new Promise((resolve) => setTimeout(resolve, baseDelayMs * 2 ** (attempt - 1)))
	}
}

/**
 * Map a Supabase/PostgREST error to the HTTP status an API route should return,
 * so you stop rewriting the same `if (isUniqueViolation) return 409` switch.
 * Anything unrecognised (including non-errors) falls back to `500`.
 *
 *   return new Response(msg, { status: toHttpStatus(error) })
 */
export function toHttpStatus(err: unknown): number {
	switch (getErrorCode(err)) {
		case PG_ERROR_CODES.uniqueViolation:
		case PG_ERROR_CODES.exclusionViolation:
		case PG_ERROR_CODES.foreignKeyViolation:
			return 409 // conflicts with existing / related data
		case PG_ERROR_CODES.notNullViolation:
		case PG_ERROR_CODES.checkViolation:
			return 400 // caller sent invalid data
		case PG_ERROR_CODES.insufficientPrivilege:
			return 403 // RLS / role denied
		case PG_ERROR_CODES.jwtExpired:
			return 401
		case PG_ERROR_CODES.noRows:
			return 404
		case PG_ERROR_CODES.serializationFailure:
		case PG_ERROR_CODES.deadlockDetected:
		case PG_ERROR_CODES.queryCanceled:
		case PG_ERROR_CODES.connectionFailed:
		case PG_ERROR_CODES.connectionError:
		case PG_ERROR_CODES.schemaCacheUnavailable:
		case PG_ERROR_CODES.poolTimeout:
			return 503 // transient — retry
		default:
			return 500
	}
}

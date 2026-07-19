/**
 * Read Supabase auth-token claims **without verifying the signature** — pure
 * base64url decode of the JWT payload, no `@supabase/supabase-js`, no network.
 *
 * Use only for reading claims from a token you already trust (e.g. one the SDK
 * just handed you). For an auth decision, verify first with the SDK's
 * `auth.getClaims()` — a decoded-but-unverified token can be forged.
 */

/** The claims Supabase puts on an access token (open-ended — extra claims pass through). */
export interface SupabaseClaims {
	/** User id (`auth.users.id`). */
	sub?: string
	role?: string
	email?: string
	phone?: string
	aud?: string | string[]
	/** Expiry, seconds since epoch. */
	exp?: number
	/** Issued-at, seconds since epoch. */
	iat?: number
	session_id?: string
	app_metadata?: Record<string, unknown>
	user_metadata?: Record<string, unknown>
	[claim: string]: unknown
}

/**
 * Decode a JWT's payload into its claims, or `null` if it isn't a well-formed
 * JWT. **Does not verify the signature.**
 */
export function decodeClaims(accessToken: string): SupabaseClaims | null {
	const parts = accessToken.split('.')
	if (parts.length !== 3 || !parts[1]) return null
	try {
		const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
		const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
		const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0))
		const claims = JSON.parse(new TextDecoder().decode(bytes))
		return claims && typeof claims === 'object' ? (claims as SupabaseClaims) : null
	} catch {
		return null
	}
}

/** The `sub` (user id) claim, or `undefined`. Unverified — see {@link decodeClaims}. */
export function getUserId(accessToken: string): string | undefined {
	return decodeClaims(accessToken)?.sub
}

/** The `role` claim (e.g. `authenticated`), or `undefined`. Unverified. */
export function getRole(accessToken: string): string | undefined {
	return decodeClaims(accessToken)?.role
}

/**
 * Whether the token's `exp` is in the past (no `exp` → not expired). `nowMs`
 * defaults to `Date.now()`; pass it to test or to add a refresh skew.
 */
export function isExpired(claims: SupabaseClaims, nowMs: number = Date.now()): boolean {
	return typeof claims.exp === 'number' && claims.exp * 1000 <= nowMs
}

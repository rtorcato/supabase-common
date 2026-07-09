/**
 * Pure builders for Supabase Storage URLs and paths. Supabase's own
 * `getPublicUrl` is just string concatenation (no network), so these stay
 * structural — no client, no `@supabase/supabase-js` dependency.
 */

function joinUrl(supabaseUrl: string, ...segments: string[]): string {
	const base = supabaseUrl.replace(/\/+$/, '')
	const path = segments
		.map((s) => s.replace(/^\/+|\/+$/g, ''))
		.filter(Boolean)
		.join('/')
	return `${base}/${path}`
}

/** Public object URL: `${url}/storage/v1/object/public/${bucket}/${path}`. */
export function publicUrl(supabaseUrl: string, bucket: string, path: string): string {
	return joinUrl(supabaseUrl, 'storage/v1/object/public', bucket, path)
}

/** Authenticated object URL — requires a bearer token to fetch. */
export function authenticatedUrl(supabaseUrl: string, bucket: string, path: string): string {
	return joinUrl(supabaseUrl, 'storage/v1/object/authenticated', bucket, path)
}

/**
 * Public URL with a `?download` flag so the browser saves rather than renders.
 * Pass `filename` to override the saved file name.
 */
export function downloadUrl(
	supabaseUrl: string,
	bucket: string,
	path: string,
	filename?: string
): string {
	const url = publicUrl(supabaseUrl, bucket, path)
	return url + (filename ? `?download=${encodeURIComponent(filename)}` : '?download')
}

/**
 * The top-level folder of a storage path — matches what RLS policies check via
 * `storage.foldername(name)[1]`, handy for the `${userId}/file` convention.
 *
 *   storageFolder('user-123/avatars/a.png') // → 'user-123'
 *   storageFolder('a.png')                   // → ''
 */
export function storageFolder(path: string): string {
	const clean = path.replace(/^\/+/, '')
	const slash = clean.indexOf('/')
	return slash === -1 ? '' : clean.slice(0, slash)
}

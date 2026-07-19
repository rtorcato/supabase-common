/**
 * Pure builders for Supabase Storage URLs and paths. Supabase's own
 * `getPublicUrl` is just string concatenation (no network), so these stay
 * structural — no client, no `@supabase/supabase-js` dependency.
 */

// Linear slash trimming — avoids the polynomial backtracking a `/\/+$/`-style
// regex would incur on caller-supplied paths (js/polynomial-redos).
function trimSlashes(s: string): string {
	let start = 0
	let end = s.length
	while (start < end && s[start] === '/') start++
	while (end > start && s[end - 1] === '/') end--
	return s.slice(start, end)
}

function joinUrl(supabaseUrl: string, ...segments: string[]): string {
	let end = supabaseUrl.length
	while (end > 0 && supabaseUrl[end - 1] === '/') end--
	const base = supabaseUrl.slice(0, end)
	const path = segments.map(trimSlashes).filter(Boolean).join('/')
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

/** Image transformation options for Supabase's render endpoint. */
export interface TransformOptions {
	width?: number
	height?: number
	/** How the image fits the target box. Supabase default is `cover`. */
	resize?: 'cover' | 'contain' | 'fill'
	/** 20–100. Lower = smaller file. */
	quality?: number
	/** `origin` keeps the source format instead of auto-negotiating (e.g. webp). */
	format?: 'origin'
}

/**
 * Transformed (resized) public image URL via the render endpoint:
 * `${url}/storage/v1/render/image/public/${bucket}/${path}?width=…`.
 * Pure string work like the other builders — the transform happens server-side.
 */
export function transformUrl(
	supabaseUrl: string,
	bucket: string,
	path: string,
	options: TransformOptions = {}
): string {
	const url = joinUrl(supabaseUrl, 'storage/v1/render/image/public', bucket, path)
	const params = new URLSearchParams()
	if (options.width != null) params.set('width', String(options.width))
	if (options.height != null) params.set('height', String(options.height))
	if (options.resize) params.set('resize', options.resize)
	if (options.quality != null) params.set('quality', String(options.quality))
	if (options.format) params.set('format', options.format)
	const query = params.toString()
	return query ? `${url}?${query}` : url
}

/**
 * Inverse of {@link publicUrl}: pull `{ bucket, path }` back out of a public
 * object URL, or `null` if it isn't one. Query string / hash (e.g. `?download`)
 * is ignored; the path is percent-decoded when it decodes cleanly.
 *
 *   parsePublicUrl('https://abc.supabase.co/storage/v1/object/public/avatars/a.png')
 *   // → { bucket: 'avatars', path: 'a.png' }
 */
export function parsePublicUrl(url: string): { bucket: string; path: string } | null {
	const marker = '/storage/v1/object/public/'
	const i = url.indexOf(marker)
	if (i === -1) return null
	let rest = url.slice(i + marker.length)
	const q = rest.search(/[?#]/)
	if (q !== -1) rest = rest.slice(0, q)
	const slash = rest.indexOf('/')
	if (slash < 1) return null // need a non-empty bucket and a path
	const bucket = rest.slice(0, slash)
	const raw = rest.slice(slash + 1)
	if (!raw) return null
	let path = raw
	try {
		path = decodeURIComponent(raw)
	} catch {
		// malformed %-encoding — keep the raw segment
	}
	return { bucket, path }
}

/**
 * Split a storage path into `{ dir, name, ext }` (a leading dot is a hidden
 * file, not an extension; only the last `.` splits the extension).
 *
 *   splitPath('user-1/avatars/a.png') // → { dir: 'user-1/avatars', name: 'a', ext: 'png' }
 *   splitPath('.gitignore')           // → { dir: '', name: '.gitignore', ext: '' }
 */
export function splitPath(path: string): { dir: string; name: string; ext: string } {
	const clean = trimSlashes(path)
	const slash = clean.lastIndexOf('/')
	const dir = slash === -1 ? '' : clean.slice(0, slash)
	const base = slash === -1 ? clean : clean.slice(slash + 1)
	const dot = base.lastIndexOf('.')
	if (dot <= 0) return { dir, name: base, ext: '' }
	return { dir, name: base.slice(0, dot), ext: base.slice(dot + 1) }
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

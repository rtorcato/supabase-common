/**
 * Default public-path policy: paths that need no authentication. Everything
 * else is treated as protected by {@link updateSession}. Pure (no `next`
 * import) so it's trivially testable and overridable.
 */
export function isPublicPathDefault(pathname: string): boolean {
	return pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/auth')
}

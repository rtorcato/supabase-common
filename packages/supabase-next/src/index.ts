/**
 * Next.js App Router helpers for Supabase SSR — the cookie/middleware boilerplate
 * `create-next-app -e with-supabase` copies into every project, factored out.
 *
 * Built on the framework-agnostic factories in `@rtorcato/supabase-common/client`;
 * this package adds the Next-specific wiring (`next/headers` cookies, middleware
 * session refresh). `@supabase/ssr`, `@supabase/supabase-js`, and `next` are peer
 * deps.
 */
import { createServerClient as createServerClientBase } from '@rtorcato/supabase-common/client'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { isPublicPathDefault } from './policy.js'

export { isPublicPathDefault } from './policy.js'
// Browser client is framework-agnostic — re-export so Next apps have one import.
export { createBrowserClient } from '@rtorcato/supabase-common/client'

/**
 * Server (Server Component / Route Handler / Server Action) Supabase client,
 * wired to Next's request cookies. Don't cache it in a module global — with
 * Fluid compute the request scope changes; create one per call.
 *
 *   const supabase = await createServerClient(url, anonKey)
 */
export async function createServerClient(supabaseUrl: string, supabaseKey: string) {
	const cookieStore = await cookies()
	return createServerClientBase(supabaseUrl, supabaseKey, {
		getAll() {
			return cookieStore.getAll()
		},
		setAll(cookiesToSet) {
			try {
				for (const { name, value, options } of cookiesToSet) {
					cookieStore.set(name, value, options)
				}
			} catch {
				// setAll was called from a Server Component — safe to ignore when
				// middleware (updateSession) refreshes the session.
			}
		},
	})
}

export interface UpdateSessionOptions {
	supabaseUrl: string
	supabaseKey: string
	/**
	 * Return `true` if the path needs no auth. Default: `/`, `/login*`, `/auth*`
	 * ({@link isPublicPathDefault}). Unauthenticated requests to any other path
	 * are redirected to `loginPath`.
	 */
	isPublicPath?: (pathname: string) => boolean
	/** Where to send unauthenticated users. Default `/auth/login`. */
	loginPath?: string
}

/**
 * Middleware session refresh. Keeps the Supabase auth cookie fresh on every
 * request and (by default) redirects unauthenticated users to the login page.
 * Call from `middleware.ts` and return its result verbatim.
 *
 *   export async function middleware(request: NextRequest) {
 *     return updateSession(request, { supabaseUrl, supabaseKey })
 *   }
 */
export async function updateSession(
	request: NextRequest,
	options: UpdateSessionOptions
): Promise<NextResponse> {
	const {
		supabaseUrl,
		supabaseKey,
		isPublicPath = isPublicPathDefault,
		loginPath = '/auth/login',
	} = options

	let response = NextResponse.next({ request })

	const supabase = createServerClientBase(supabaseUrl, supabaseKey, {
		getAll() {
			return request.cookies.getAll()
		},
		setAll(cookiesToSet) {
			for (const { name, value } of cookiesToSet) {
				request.cookies.set(name, value)
			}
			response = NextResponse.next({ request })
			for (const { name, value, options: cookieOptions } of cookiesToSet) {
				response.cookies.set(name, value, cookieOptions)
			}
		},
	})

	// Do not run code between createServerClient and getClaims(): a stray await
	// here can randomly log users out. See the with-supabase template notes.
	const { data } = await supabase.auth.getClaims()
	const user = data?.claims

	if (!user && !isPublicPath(request.nextUrl.pathname)) {
		const url = request.nextUrl.clone()
		url.pathname = loginPath
		return NextResponse.redirect(url)
	}

	return response
}

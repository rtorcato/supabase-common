/**
 * Framework-agnostic Supabase client factories — the boilerplate every app
 * copies, centralised so you pin the client version and config in one place.
 *
 * Unlike the structural helpers at the package root (`unwrap`, `paged`, …),
 * this module imports `@supabase/ssr` and `@supabase/supabase-js`, declared as
 * optional peer deps. Importing `@rtorcato/supabase-common` never pulls them
 * in; only importing `@rtorcato/supabase-common/client` does.
 *
 * Deliberately NO framework imports (no `next`, no cookies source): SSR callers
 * pass their own cookie adapter, so this works with Next, TanStack Start,
 * SvelteKit, Remix, plain Node, or edge runtimes alike.
 */
import {
	createBrowserClient as createBrowserClientBase,
	createServerClient as createServerClientBase,
	type CookieMethodsServer,
} from '@supabase/ssr'
import {
	createClient as createClientBase,
	type SupabaseClient,
	type SupabaseClientOptions,
} from '@supabase/supabase-js'

/**
 * Browser (SPA / client component) Supabase client. Reads/writes the auth
 * session from `document.cookie`. Works in any browser app — React, TanStack,
 * Vue, plain JS.
 *
 *   const supabase = createBrowserClient(url, anonKey)
 */
export function createBrowserClient(supabaseUrl: string, supabaseKey: string): SupabaseClient {
	return createBrowserClientBase(supabaseUrl, supabaseKey)
}

/**
 * Server (SSR) Supabase client wired to request cookies. The caller supplies
 * the cookie adapter, so this stays framework-agnostic:
 *
 *   // Next.js App Router
 *   const store = await cookies()
 *   const supabase = createServerClient(url, key, {
 *     getAll: () => store.getAll(),
 *     setAll: (cs) => cs.forEach(({ name, value, options }) => store.set(name, value, options)),
 *   })
 *
 * Don't cache the returned client in a module global — create one per request.
 */
export function createServerClient(
	supabaseUrl: string,
	supabaseKey: string,
	cookies: CookieMethodsServer
): SupabaseClient {
	return createServerClientBase(supabaseUrl, supabaseKey, { cookies })
}

/**
 * Plain Supabase client with no cookie/SSR handling — for Node scripts, edge
 * functions, tests, or any non-cookie context. Pass a service-role key for
 * admin access (server-side only).
 *
 *   const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } })
 */
export function createClient(
	supabaseUrl: string,
	supabaseKey: string,
	options?: SupabaseClientOptions<'public'>
): SupabaseClient {
	return createClientBase(supabaseUrl, supabaseKey, options)
}

// Convenience re-exports of the real Supabase types (now that it's a peer dep),
// so consumers of the client subpath don't need a second import.
export type { CookieMethodsServer } from '@supabase/ssr'
export type {
	PostgrestError,
	PostgrestResponse,
	PostgrestSingleResponse,
	SupabaseClient,
	SupabaseClientOptions,
} from '@supabase/supabase-js'

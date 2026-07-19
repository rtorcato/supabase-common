/**
 * Pure builders for Supabase Realtime conventions — no client, no
 * `@supabase/supabase-js`. Opening/subscribing a channel needs the SDK; these
 * just assemble the strings and the filter object you hand it.
 */

/** Postgres change event to listen for. */
export type PostgresChangesEvent = '*' | 'INSERT' | 'UPDATE' | 'DELETE'

/** Input to {@link postgresChangesFilter} — `table` required, the rest defaulted. */
export interface PostgresChangesFilterInput {
	/** Default `'*'` (all events). */
	event?: PostgresChangesEvent
	/** Default `'public'`. */
	schema?: string
	table: string
	/** Row filter, e.g. `'user_id=eq.123'`. Omitted from the result when empty. */
	filter?: string
}

/** The object passed to `.on('postgres_changes', ..., cb)`. */
export interface PostgresChangesFilter {
	event: PostgresChangesEvent
	schema: string
	table: string
	filter?: string
}

/**
 * The `schema:table[:id]` channel-name convention.
 *
 *   channelName('public', 'messages')     // → 'public:messages'
 *   channelName('public', 'messages', 42) // → 'public:messages:42'
 */
export function channelName(schema: string, table: string, id?: string | number): string {
	const parts = [schema, table]
	if (id != null && id !== '') parts.push(String(id))
	return parts.join(':')
}

/**
 * Build the plain filter object for `.on('postgres_changes', ...)`, defaulting
 * `event` to `'*'` and `schema` to `'public'`. `filter` is dropped when empty.
 *
 *   postgresChangesFilter({ table: 'messages', filter: 'room_id=eq.1' })
 *   // → { event: '*', schema: 'public', table: 'messages', filter: 'room_id=eq.1' }
 */
export function postgresChangesFilter(input: PostgresChangesFilterInput): PostgresChangesFilter {
	const { event = '*', schema = 'public', table, filter } = input
	const out: PostgresChangesFilter = { event, schema, table }
	if (filter) out.filter = filter
	return out
}

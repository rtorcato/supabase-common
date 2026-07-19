import { describe, expect, it } from 'vitest'
import { channelName, postgresChangesFilter } from '../src/index.js'

describe('channelName', () => {
	it('joins schema:table, appending id when given', () => {
		expect(channelName('public', 'messages')).toBe('public:messages')
		expect(channelName('public', 'messages', 42)).toBe('public:messages:42')
		expect(channelName('public', 'messages', 'abc')).toBe('public:messages:abc')
	})

	it('drops an empty/undefined id', () => {
		expect(channelName('public', 'messages', '')).toBe('public:messages')
		expect(channelName('public', 'messages', undefined)).toBe('public:messages')
	})
})

describe('postgresChangesFilter', () => {
	it('defaults event to * and schema to public', () => {
		expect(postgresChangesFilter({ table: 'messages' })).toEqual({
			event: '*',
			schema: 'public',
			table: 'messages',
		})
	})

	it('passes through event, schema, and a row filter', () => {
		expect(
			postgresChangesFilter({
				event: 'INSERT',
				schema: 'app',
				table: 'orders',
				filter: 'user_id=eq.123',
			})
		).toEqual({ event: 'INSERT', schema: 'app', table: 'orders', filter: 'user_id=eq.123' })
	})

	it('omits filter when empty', () => {
		expect(postgresChangesFilter({ table: 't', filter: '' })).not.toHaveProperty('filter')
	})
})

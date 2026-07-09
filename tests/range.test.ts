import { describe, expect, it } from 'vitest'
import { pageCount, toRange } from '../src/index.js'

describe('toRange', () => {
	it('translates a 1-based page to an inclusive 0-based tuple', () => {
		expect(toRange(1, 25)).toEqual({ from: 0, to: 24 })
		expect(toRange(2, 25)).toEqual({ from: 25, to: 49 })
		expect(toRange(3, 10)).toEqual({ from: 20, to: 29 })
	})

	it('clamps junk page/size to >= 1 and floors non-integers', () => {
		expect(toRange(0, 0)).toEqual({ from: 0, to: 0 })
		expect(toRange(-5, 10)).toEqual({ from: 0, to: 9 })
		expect(toRange(2.9, 10.7)).toEqual({ from: 10, to: 19 })
	})
})

describe('pageCount', () => {
	it('ceils total/size', () => {
		expect(pageCount(100, 25)).toBe(4)
		expect(pageCount(101, 25)).toBe(5)
		expect(pageCount(0, 25)).toBe(0)
	})

	it('clamps junk input', () => {
		expect(pageCount(-10, 0)).toBe(0)
	})
})

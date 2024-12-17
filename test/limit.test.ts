import { delay, noop, range } from 'es-toolkit'
import { expect, describe, it } from 'vitest'
import { createLimitedVersionOfFn, pLimit } from '../src'
import { approximateCostTime } from './_shared'

describe('concurrency invalid check', () => {
  describe('pLimit(concurrency)', () => {
    it('should throws when concurrency is invalid', () => {
      expect(() => pLimit(0)).toThrowError('concurrency must be greater than 0')
      expect(() => pLimit(Infinity)).toThrowError('concurrency must be finite')
    })
  })

  describe('createLimitedVersionOfFn(fn, concurrency)', () => {
    it('should throws when concurrency is invalid', () => {
      expect(() => createLimitedVersionOfFn(noop, 0)).toThrowError(
        'concurrency must be greater than 0',
      )
      expect(() => createLimitedVersionOfFn(noop, Infinity)).toThrowError(
        'concurrency must be finite',
      )
    })
  })
})

describe('concurrency control is correct', () => {
  it('pLimit', async function () {
    let arr = range(5) // [0 .. 4]
    async function measureCostTime(concurrency: number) {
      let start = performance.now()

      async function work(x: number) {
        await delay(x * 10)
        return x * 10
      }

      const limit = pLimit(concurrency)
      const result = await Promise.all(arr.map((value) => limit(() => work(value))))
      expect(result).toEqual(arr.map((value) => value * 10))

      const cost = performance.now() - start
      return cost
    }

    function approximateCostTime(time: number, tolerance: number) {
      return function satisfy(val: number) {
        return Math.abs(val - time) <= Math.abs(tolerance)
      }
    }

    const tolerance = 10

    // Infinity
    expect(await measureCostTime(arr.length)).toSatisfy(approximateCostTime(40, tolerance))

    // executor-0: 0ms	 20ms  40ms
    // executor-1: 10ms  30ms
    expect(await measureCostTime(2)).toSatisfy(approximateCostTime(60, tolerance))

    // executor-0: 0ms	 30ms
    // executor-1: 10ms  40ms
    // executor-2: 20ms
    expect(await measureCostTime(3)).toSatisfy(approximateCostTime(50, tolerance))
  })

  it('createLimitedVersionOfFn', async function () {
    let arr = range(5) // [0 .. 4]
    async function measureCostTime(concurrency: number) {
      let start = performance.now()

      async function work(x: number) {
        await delay(x * 10)
        return x * 10
      }

      const workWithLimit = createLimitedVersionOfFn(work, concurrency)
      const result = await Promise.all(arr.map((x) => workWithLimit(x)))
      expect(result).toEqual(arr.map((value) => value * 10))

      const cost = performance.now() - start
      return cost
    }

    const tolerance = 10

    // Infinity
    expect(await measureCostTime(arr.length)).toSatisfy(approximateCostTime(40, tolerance))

    // executor-0: 0ms	 20ms  40ms
    // executor-1: 10ms  30ms
    expect(await measureCostTime(2)).toSatisfy(approximateCostTime(60, tolerance))

    // executor-0: 0ms	 30ms
    // executor-1: 10ms  40ms
    // executor-2: 20ms
    expect(await measureCostTime(3)).toSatisfy(approximateCostTime(50, tolerance))
  })
})

import { delay, range } from 'es-toolkit'
import { describe, it, expect } from 'vitest'
import pmap from '../src'

describe('pmap', function () {
  it('it works', async function () {
    let arr = range(5) // [0 .. 4]
    arr = await pmap(
      arr,
      async (x) => {
        await delay(x * 10)
        return x * 2
      },
      Infinity,
    )
    expect(arr.length).toBe(5)
    expect(arr).toEqual([0, 2, 4, 6, 8])
  })

  it('concurrency control is correct', async function () {
    async function measureCostTime(concurrency: number) {
      let arr = range(5) // [0 .. 4]
      let start = performance.now()
      arr = await pmap(
        arr,
        async function (x) {
          await delay(x * 10)
          return x * 10
        },
        concurrency,
      )
      return performance.now() - start
    }

    function approximateCostTime(time: number, tolerance: number) {
      return function satisfy(val: number) {
        return Math.abs(val - time) <= Math.abs(tolerance)
      }
    }

    const tolerance = 10

    // Infinity
    expect(await measureCostTime(Infinity)).toSatisfy(approximateCostTime(40, tolerance))

    // executor-0: 0ms	 20ms  40ms
    // executor-1: 10ms  30ms
    expect(await measureCostTime(2)).toSatisfy(approximateCostTime(60, tolerance))

    // executor-0: 0ms	 30ms
    // executor-1: 10ms  40ms
    // executor-2: 20ms
    expect(await measureCostTime(3)).toSatisfy(approximateCostTime(50, tolerance))
  })

  it('should not start new after errored', async () => {
    const arr = [1, 2, 3, 4, 5, 6]
    const called: number[] = []
    await expect(
      pmap(
        arr,
        async (x: number) => {
          called.push(x)
          if (x === 3) {
            throw new Error('test error')
          }
          return x
        },
        2,
      ),
    ).rejects.toThrow('test error')
    expect(called).toEqual([1, 2, 3])
  })
})

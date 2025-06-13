import { performance } from 'node:perf_hooks'
import { delay, range } from 'es-toolkit'
import { describe, expect, it } from 'vitest'
import { pmapWorker } from '../src'

describe('pmapWorker works', () => {
  it('simple API', async () => {
    const arr = range(100) // [0 .. 99]
    const aboutTime = 50 // suppose 20 ms
    const expectCostTime = (100 / 10) * aboutTime

    const workers = range(0, 10).map((i) => {
      return {
        index: i,
        someHeavyWork(input: number): Promise<number> {
          return new Promise((r) => {
            setTimeout(function () {
              r(input * input)
            }, aboutTime)
          })
        },
      }
    })

    const pmapStart = performance.now()
    const result = await pmapWorker(
      arr,
      async function (item, index, arr, worker) {
        return await worker.someHeavyWork(item)
      },
      workers,
    )
    const costTime = performance.now() - pmapStart

    // result
    expect(result).toEqual(arr.map((x) => x * x))

    // time
    expect(costTime).toBeGreaterThanOrEqual(expectCostTime - 40)
    expect(costTime).toBeLessThanOrEqual(expectCostTime + 40)
  })

  it('should not start new after errored', async () => {
    const arr = [1, 2, 3, 4, 5, 6]
    const called: number[] = []
    const workers = range(2).map((i) => {
      return {
        index: i,
        async someHeavyWork(input: number): Promise<number> {
          await delay(100)
          return input * input
        },
      }
    })
    await expect(() =>
      pmapWorker(
        arr,
        async (x: number, index, arr, worker) => {
          called.push(x)
          if (x === 3) {
            throw new Error('test error')
          }
          return await worker.someHeavyWork(x)
        },
        workers,
      ),
    ).rejects.toThrowError('test error')
    expect(called).toEqual([1, 2, 3])
  })
})

import { performance } from 'perf_hooks'
import { describe, it, expect } from 'vitest'
import { pmapWorker } from '../src'
import { range } from 'es-toolkit'

describe('pmapWorker works', () => {
  it('simple API', async () => {
    let arr = range(100) // [0 .. 99]
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
})

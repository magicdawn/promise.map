import { delay, range } from 'es-toolkit'
import { describe, it, expect } from 'vitest'
import pmap from '../src'

describe('It works', function () {
  it('simple API', async function () {
    let arr = range(5) // [0 .. 4]

    arr = await pmap(
      arr,
      async function (x: number) {
        await delay(x * 5)
        return x * 2
      },
      Infinity,
    )

    expect(arr.length).toBe(5)
    expect(arr).toEqual([0, 2, 4, 6, 8])
  })
})

describe('Feature', function () {
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

    expect(called.length).toBe(3)
    expect(called).toEqual([1, 2, 3])
  })
})

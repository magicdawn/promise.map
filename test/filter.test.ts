/* eslint-disable require-await */

import { describe, expect, it } from 'vitest'
import { pFilter } from '../src'

describe('pFilter', () => {
  it('should works', async () => {
    const arr = [1, 2, 3, 4, 5, 6]
    expect(await pFilter(arr, (x) => x % 2 === 0, 2)).toEqual([2, 4, 6])
    expect(await pFilter(arr, async (x) => x % 2 === 0, 1)).toEqual([2, 4, 6])
  })
})

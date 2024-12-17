import { describe, expect, it } from 'vitest'
import { Dispatcher } from '../src'

describe('constructor check', () => {
  it('should throws when executors is empty', () => {
    expect(() => new Dispatcher([])).toThrow('executors can not be empty')
  })
})

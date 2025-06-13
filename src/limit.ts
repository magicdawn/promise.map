import { Dispatcher } from './dispatcher'

// api same as `p-limit` package
export function pLimit(concurrency: number) {
  const dispatcher = Dispatcher.fromConcurrency(concurrency, 'pLimit')
  return function limit<T extends unknown[], R>(fn: (...args: T) => R, ...args: NoInfer<T>) {
    return dispatcher.dispatch(() => fn(...args))
  }
}

// `p-limit.limitFunction`
export const limitFunction = createLimitedVersionOfFn

export function createLimitedVersionOfFn<T extends unknown[], R>(fn: (...args: T) => R, concurrency: number) {
  const dispatcher = Dispatcher.fromConcurrency(concurrency, 'createLimitedVersionOfFn')
  return function limitedVersionOfFn(...args: NoInfer<T>) {
    return dispatcher.dispatch(() => fn(...args))
  }
}

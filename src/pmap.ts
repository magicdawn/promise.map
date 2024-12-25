import { Dispatcher } from './dispatcher'

export async function pmap<T, R>(
  arr: T[],
  fn: (item: T, index: number, arr: T[]) => R,
  concurrency: number,
) {
  if (!arr.length) return []
  concurrency = Math.min(concurrency, arr.length)
  const dispatcher = Dispatcher.fromConcurrency(concurrency, 'pmap')
  try {
    return await Promise.all(
      arr.map((item, index) => dispatcher.dispatch(() => fn(item, index, arr))),
    )
  } catch (e) {
    dispatcher.abort()
    throw e
  }
}

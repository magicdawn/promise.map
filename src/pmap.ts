import { Dispatcher } from './dispatcher'

export async function pmap<T, R>(
  arr: T[],
  fn: (item: T, index: number, arr: T[]) => R,
  concurrency: number,
) {
  concurrency = Math.min(concurrency, arr.length)
  const executors = new Array(concurrency).fill(0).map((_, index) => `pmap.executor.${index}`)
  const dispatcher = new Dispatcher(executors)
  try {
    return await Promise.all(
      arr.map((item, index) => dispatcher.dispatch(() => fn(item, index, arr))),
    )
  } catch (e) {
    dispatcher.abort()
    throw e
  }
}

import { Dispatcher } from './dispatcher'

export async function pmapWorker<T, R, W>(
  arr: T[],
  fn: (item: T, index: number, arr: T[], worker: W) => R,
  workers: W[],
) {
  const dispatcher = new Dispatcher(workers)
  try {
    return await Promise.all(
      arr.map((item, index) => dispatcher.dispatch((worker) => fn(item, index, arr, worker))),
    )
  } catch (e) {
    dispatcher.abort()
    throw e
  }
}

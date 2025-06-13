import { pmap } from './pmap'

// API same as `p-filter` package
export async function pFilter<T>(
  arr: T[],
  fn: (item: T, index: number, arr: T[]) => boolean | Promise<boolean>,
  concurrency: number,
) {
  const results = await pmap(arr, fn, concurrency)
  return arr.filter((_, index) => results[index])
}

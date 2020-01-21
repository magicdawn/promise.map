export default function pmap<IN, OUT>(
  arr: IN[],
  fn: (item: IN, index: number, arr: IN[]) => Promise<OUT> | OUT,
  concurrency: number
): Promise<OUT[]>

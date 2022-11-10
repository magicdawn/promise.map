import { expectType } from 'tsd'
import pmap, { pmapWorker } from './'

type Item = { a: number; b: string }

function normal(i: Item): number {
  return 1
}
function asyncFn(i: Item): Promise<number> {
  return Promise.resolve(1)
}

const arr: Item[] = [
  { a: 1, b: 'input1' },
  { a: 2, b: 'input2' },
]

expectType<Promise<number[]>>(pmap(arr, normal, 10))
expectType<Promise<number[]>>(pmap(arr, asyncFn, 10))

type Worker = { action: () => number }

async function mapWithWorker(i: Item, index: number, arr: Item[], worker: Worker) {
  return worker.action()
}

const workers: Worker[] = [
  {
    action() {
      return 1
    },
  },
  {
    action() {
      return 2
    },
  },
]

expectType<Promise<number[]>>(pmapWorker(arr, mapWithWorker, workers))

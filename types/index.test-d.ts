import {expectType} from 'tsd'
import pmap from './'

type Item = {a: number; b: string}

function normal(i: Item): number {
  return 1
}
function asyncFn(i: Item): Promise<number> {
  return Promise.resolve(1)
}

const arr: Item[] = [
  {a: 1, b: 'input1'},
  {a: 2, b: 'input2'},
]

expectType<Promise<number[]>>(pmap(arr, normal, 10))
expectType<Promise<number[]>>(pmap(arr, asyncFn, 10))

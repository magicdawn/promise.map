## API

### pmap

```ts
export default function pmap<IN, OUT>(
  arr: IN[],
  fn: (item: IN, index: number, arr: IN[]) => Promise<OUT> | OUT,
  concurrency: number
): Promise<OUT[]>
```

```js
var p = pmap(
  arr,
  function (item, index, arr) {
    return getOtherPromise(item)
  },
  concurrency
)
```

### map on Workers: `pmapWorker`

for cpu heavy work, you can map on workers

```ts
export function pmapWorker<IN, OUT, AnyWorker extends Object>(
  arr: IN[],
  fn: (item: IN, index: number, arr: IN[], worker: AnyWorker) => Promise<OUT>,
  workers: AnyWorker[]
): Promise<OUT[]>
```

## Why

- bluebird is awesome, and provide tons of convience methods, such as Promise.map, it provides `async.parallelLimit`
  but, it got some opinioned ways, like [this warn](https://github.com/petkaantonov/bluebird/issues/508#issuecomment-193173681).
  So we'd better split things out.
- package `promise-map` simply use `Array.prototype.map`, that lost a `concurrency` or `parallelLimit` control

## See Also

- [promise.timeout](https://github.com/magicdawn/promise.timeout)
- [promise.retry](https://github.com/magicdawn/promise.retry)
- [promise.map](https://github.com/magicdawn/promise.map)
- [promise.ify](https://github.com/magicdawn/promise.ify)
- [promise.cb](https://github.com/magicdawn/promise.cb)
- [promise.obj](https://github.com/magicdawn/promise.obj)
- [promise.sleep](https://github.com/magicdawn/promise.sleep)

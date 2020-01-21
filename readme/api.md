## API

```js
var pmap = require('promise.map')

var p = pmap(
  arr,
  function(item, index, arr) {
    return getOtherPromise(item)
  },
  concurrency
)
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

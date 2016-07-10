# promise.map
> Promise.map in Bluebird

[![Build Status](https://img.shields.io/travis/magicdawn/promise.map.svg?style=flat-square)](https://travis-ci.org/magicdawn/promise.map)
[![Coverage Status](https://img.shields.io/coveralls/magicdawn/promise.map.svg?style=flat-square)](https://coveralls.io/github/magicdawn/promise.map?branch=master)
[![npm version](https://img.shields.io/npm/v/promise.map.svg?style=flat-square)](https://www.npmjs.com/package/promise.map)
[![npm downloads](https://img.shields.io/npm/dm/promise.map.svg?style=flat-square)](https://www.npmjs.com/package/promise.map)
[![npm license](https://img.shields.io/npm/l/promise.map.svg?style=flat-square)](http://magicdawn.mit-license.org)

## Note
this is target ES5 environment.

## Install
```
$ npm i promise.map --save
```

## API

```
var map = require('promise.map');
var p = map(arr, function(item, index, arr){
  return getOtherPromise(item);
}, concurrency);
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
- [promise.delay](https://github.com/magicdawn/promise.delay)

## License

the MIT License http://magicdawn.mit-license.org
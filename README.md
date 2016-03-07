# promise.map
> Promise.map in Bluebird

[![Build Status](https://travis-ci.org/magicdawn/promise.map.svg)](https://travis-ci.org/magicdawn/promise.map)
[![Coverage Status](https://coveralls.io/repos/github/magicdawn/promise.map/badge.svg?branch=master)](https://coveralls.io/github/magicdawn/promise.map?branch=master)
[![npm version](https://img.shields.io/npm/v/promise.map.svg)](https://www.npmjs.com/package/promise.map)
[![npm downloads](https://img.shields.io/npm/dm/promise.map.svg)](https://www.npmjs.com/package/promise.map)
[![npm license](https://img.shields.io/npm/l/promise.map.svg)](http://magicdawn.mit-license.org)

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

## License

the MIT License http://magicdawn.mit-license.org
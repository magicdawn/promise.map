# promise.map
> Promise.map in Bluebird

[![Build Status](https://travis-ci.org/magicdawn/promise.map.svg)](https://travis-ci.org/magicdawn/promise.map)
[![Coverage Status](https://coveralls.io/repos/magicdawn/promise.map/badge.svg?branch=master)](https://coveralls.io/github/magicdawn/promise.map?branch=master)
[![node version](https://img.shields.io/node/v/promise.map.svg)](https://www.npmjs.com/package/promise.map)
[![npm version](https://img.shields.io/npm/v/promise.map.svg)](https://www.npmjs.com/package/promise.map)
[![npm downloads](https://img.shields.io/npm/dm/promise.map.svg)](https://www.npmjs.com/package/promise.map)
[![npm license](https://img.shields.io/npm/l/promise.map.svg)](http://magicdawn.mit-license.org)

## install

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

## License

the MIT License http://magicdawn.mit-license.org
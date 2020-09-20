/**
 * Promise.map(arr, fn, concurrency) in Bluebird
 *
 * code take from caolan/async
 */

module.exports = function map(arr, fn, concurrency) {
  // concurrency
  concurrency = concurrency || Infinity
  if (typeof concurrency !== 'number') {
    throw new TypeError(String(concurrency) + ' is not a number')
  }

  return new Promise(function (resolve, reject) {
    let completed = 0
    let started = 0
    let running = 0
    let results = new Array(arr.length)

    ;(function replenish() {
      if (completed >= arr.length) {
        return resolve(results)
      }

      while (running < concurrency && started < arr.length) {
        running++
        started++
        ;(function (index) {
          let cur = arr[index]
          Promise.resolve(fn.call(cur, cur, index, arr))
            .then(function (result) {
              running--
              completed++
              results[index] = result

              replenish()
            })
            .catch(reject)
        })(started - 1)
      }
    })()
  })
}

const pmapWorker = require('./worker')
module.exports.pmapWorker = pmapWorker

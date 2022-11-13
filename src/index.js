/**
 * Promise.map(arr, fn, concurrency) in Bluebird
 * code take from caolan/async
 */

module.exports = function pmap(arr, fn, concurrency) {
  // concurrency
  concurrency = concurrency || Infinity
  if (typeof concurrency !== 'number') {
    throw new TypeError(String(concurrency) + ' is not a number')
  }

  return new Promise(function (resolve, reject) {
    var completed = 0
    var started = 0
    var running = 0
    var results = new Array(arr.length)
    var rejected = false

    function start(index) {
      var cur = arr[index]
      Promise.resolve(fn.call(cur, cur, index, arr))
        .then(function (result) {
          running--
          completed++
          results[index] = result

          replenish()
        })
        .catch(function (err) {
          rejected = true
          reject(err)
        })
    }

    function replenish() {
      // if any previous item rejected, do not start others
      if (rejected) return

      if (completed >= arr.length) {
        return resolve(results)
      }

      while (running < concurrency && started < arr.length) {
        running++
        started++
        start(started - 1)
      }
    }

    replenish()
  })
}

var pmapWorker = require('./worker')
module.exports.pmapWorker = pmapWorker

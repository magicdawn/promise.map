export async function pmapPlain<T, R>(
  arr: T[],
  fn: (item: T, index: number, arr: T[]) => R,
  concurrency: number,
) {
  return new Promise(function (resolve, reject) {
    var completed = 0
    var started = 0
    var running = 0
    var results = new Array(arr.length).fill(undefined)
    var rejected = false

    function start(index: number) {
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
        start(started)
        running++
        started++
      }
    }

    replenish()
  })
}

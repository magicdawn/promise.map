export async function pmapPlain<T, R>(arr: T[], fn: (item: T, index: number, arr: T[]) => R, concurrency: number) {
  return new Promise(function (resolve, reject) {
    let completed = 0
    let started = 0
    let running = 0
    const results = Array.from({ length: arr.length }).fill(undefined)
    let rejected = false

    function start(index: number) {
      const cur = arr[index]
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

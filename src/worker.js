module.exports = async function mapOnWorker(arr, fn, workers) {
  return new Promise(function (resolve, reject) {
    let completed = 0
    let started = 0
    let running = 0
    let results = new Array(arr.length)

    const workerIsUnsing = new WeakMap()
    const getWorker = (index) => {
      for (let i = 0; i < workers.length; i++) {
        const worker = workers[i]
        if (workerIsUnsing.get(worker)) {
          continue
        } else {
          workerIsUnsing.set(worker, index) // mark `index` is using this worker
          return worker
        }
      }
    }

    ;(function replenish() {
      if (completed >= arr.length) {
        return resolve(results)
      }

      while (running < workers.length && started < arr.length) {
        ;(function (index) {
          let cur = arr[index]
          const worker = getWorker(index)
          Promise.resolve(fn.call(cur, cur, index, arr, worker))
            .then(function (result) {
              // count down
              workerIsUnsing.delete(worker)
              running--

              // mark complete
              results[index] = result
              completed++

              replenish()
            })
            .catch(reject)
        })(started)
        started++
        running++
      }
    })()
  })
}

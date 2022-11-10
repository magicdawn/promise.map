const { performance } = require('perf_hooks')
const _ = require('lodash')
require('should')
const { pmapWorker } = require('../')

describe('pmapWorker works', () => {
  it('simple API', async () => {
    let arr = _.range(100) // [0 .. 99]
    const aboutTime = 50 // suppose 20 ms
    const expectCostTime = (100 / 10) * aboutTime

    const workers = _.range(0, 10).map((i) => {
      return {
        index: i,
        someHeavyWork(input) {
          return new Promise((r) => {
            setTimeout(function () {
              r(input * input)
            }, aboutTime)
          })
        },
      }
    })

    const pmapStart = performance.now()
    const result = await pmapWorker(
      arr,
      async function (item, index, arr, worker) {
        return await worker.someHeavyWork(item)
      },
      workers
    )
    const costTime = performance.now() - pmapStart

    // result
    result.should.eql(arr.map((x) => x * x))

    // time
    costTime.should.approximately(expectCostTime, 40)
  })
})

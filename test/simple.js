require('should')
const _ = require('lodash')
const chance = require('chance')
const map = require('../')

describe('It works', function () {
  it('simple API', async function () {
    let arr = _.range(5) // [0 .. 4]

    arr = await map(arr, function (x) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve(x * 2)
        }, x * 5)
      })
    })

    arr.length.should.equal(5)
    _.times(5, function (x) {
      arr[x].should.equal(x * 2)
    })
  })
})

describe('Error should be reported', function () {
  it('concurrency not number', function () {
    try {
      map(
        [1, 2, 3],
        function (x) {
          return Promise.resolve(x)
        },
        {
          concurrency: 1,
        }
      )
    } catch (e) {
      e.should.instanceOf(TypeError)
      e.message.should.match(/is not a number/)
    }
  })
})

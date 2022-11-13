require('should')
const _ = require('lodash')
const chance = require('chance')
const pmap = require('../')

describe('It works', function () {
  it('simple API', async function () {
    let arr = _.range(5) // [0 .. 4]

    arr = await pmap(arr, function (x) {
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
      pmap(
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

describe('Feature', function () {
  it('should not start new after errored', async () => {
    const arr = [1, 2, 3, 4, 5, 6]
    const called = []

    try {
      await pmap(
        arr,
        (val) => {
          return new Promise((resolve, reject) => {
            setTimeout(function () {
              if (val === 3) {
                return reject(new Error('boom when val = 3'))
              }

              called.push(val)
              resolve(val)
            }, 10) // (10ms * val) cost per item
          })
        },
        2
      )
    } catch (e) {
      e.message.includes('boom').should.be.ok()
    }

    called.includes(1).should.ok()
    called.includes(2).should.ok()
    called.includes(3).should.not.ok()
    called.includes(4).should.not.ok()
    called.includes(5).should.not.ok()
    called.includes(6).should.not.ok()
  })
})

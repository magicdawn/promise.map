const map = require('../')
const _ = require('lodash')
const chance = require('chance')
require('should')

describe('It works', function() {
  it('simple API', function(done) {
    let arr = _.range(5) // [0 .. 4]

    map(arr, function(x) {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve(x * 2)
        }, x * 5)
      })
    })
      .then(function(arr) {
        arr.length.should.equal(5)

        _.times(5, function(x) {
          arr[x].should.equal(x * 2)
        })

        done()
      })
      .catch(done)
  })
})

describe('Error should be reported', function() {
  it('concurrency not number', function() {
    try {
      map(
        [1, 2, 3],
        function(x) {
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

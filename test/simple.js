'use strict';

var map = require('../');
var _ = require('lodash');
var chance = require('chance');
require('should');

describe('It works', function() {
  it('simple API', function(done) {
    var arr = _.range(5); // [0 .. 4]

    map(arr, function(x) {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve(x * 2);
        }, x * 10);
      });
    }).then(function(arr) {
      arr.length.should.equal(5);

      _.times(5, function(x) {
        arr[x].should.equal(x * 2);
      });

      done();
    }).catch(done);
  });
});
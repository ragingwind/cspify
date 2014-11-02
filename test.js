'use strict';

var assert = require('assert');
var cspify = require('./');

it('should componentize ploymer elements', function(done) {
  var pf = cspify('bundle', {
    i: './fixture/index.html'
  }, function() {
    done();
  });
});

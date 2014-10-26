'use strict';

var assert = require('assert');
var polyflow = require('./');

it('should componentize ploymer elements', function(done) {
  var pf = polyflow('bundle', {
    i: './fixture/index.html'
  }, function() {
    done();
  });
});

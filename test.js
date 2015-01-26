'use strict';

var path = require('path');
var assert = require('assert');
var cspify = require('./');
var bowercfg = require('bower-config');
var glob = require("glob");

process.chdir('fixture');

it('should be separated Polymer elements into html/js files', function(done) {
  var bowerpath = bowercfg.read();
  var globpattern = path.join(path.join(bowerpath.cwd, bowerpath.directory), '**', '*.html');
  var components = glob.sync(globpattern).filter(function(c) {
    return !/(test|demo|demo2|index).html$/.test(c);
  });

  assert(components.length > 0, 'components.length should be greater than zero');

  cspify(components, {verbose: true}, function() {
    // +TODO: add more specific test
    assert(1);
    done();
  });
});

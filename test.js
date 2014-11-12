'use strict';

process.chdir('fixture');

var path = require('path');
var assert = require('assert');
var cspify = require('./');
var bowercfg = require('bower-config').read();
var bowerpath = path.join(bowercfg.cwd, bowercfg.directory);
var glob = require("glob");

it('should componentize Polymer elements', function(done) {
  var exclusive = new RegExp('(test|demo|demo2|index).html$');
  var component = path.join(path.join(bowercfg.cwd, bowercfg.directory), '**', '*.html');
  var components = glob.sync(component).filter(function(c) {
    return !exclusive.test(c);
  });

  if (components.length === 0) {
    console.error('Could find any components');
    return;
  }

  cspify(components, function() {
    assert(1);
    done();
  });
});

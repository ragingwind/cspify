#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var cspify = require('./');
var meow = require('meow');
var glob = require("glob");
var bowercfg = require('bower-config').read();

var opts = meow({
  help: [
    'Usage',
    '   cspify',
    '   cspify -b ./fixture/bower_component',
    '   cspify -e (test|demo|demo2|index).html$',
    '',
    'Options',
    '   --basepath, base path. change base base for cspify',
    '   --exclusive, exclusive pattern as regexp. set the pattern what you want to exclusive. default pattern is /(test|demo|demo2|index).html$/',
    '   --verbose, show detailed logs'
  ].join('\n'),
  requireInput: false
}, {
  default: {
    exclusive: '(test|demo|demo2|index).html$',
    basepath: path.join(bowercfg.cwd, bowercfg.directory)
  }
});

var components = [];
var componentsPath = path.join(opts.flags.basepath, '**', '*.html');
components = components.concat(glob.sync(componentsPath).filter(function(c) {
  return !opts.flags.exclusive.test(c);
}));

if (components.length === 0) {
  console.error('Could find any components');
  process.exit(-1);
}

cspify(components, opts, function() {
  console.debug('fin');
});

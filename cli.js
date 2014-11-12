#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var cspify = require('./cspify');
var meow = require('meow');
var glob = require("glob");
var bowercfg = require('bower-config').read();
var opts = {input: [], flags: {}};

opts = meow({
  help: [
    'Usage',
    '   cspify',
    '   cspify -b ./fixture/bower_component -e (test|demo|demo2|index).html$',
    '   cspify -e (test|demo|demo2|index).html$',
    '',
    'Options',
    '-e: exclusive file. default files pattern is /(test|demo|demo2|index).html$/'
  ].join('\n'),
  requireInput: false
}, {default: {unknown: true, '--': false}});

var exclusive = new RegExp(opts.flags.e ? opts.flags.e : '(test|demo|demo2|index).html$');
var basepath = opts.flags.b ? opts.flags.b : path.join(bowercfg.cwd, bowercfg.directory);
var components = [];

var component = path.join(basepath, '**', '*.html');
components = components.concat(glob.sync(component).filter(function(c) {
  return !exclusive.test(c);
}));

if (components.length === 0) {
  console.error('Could find any components');
  return;
}

cspify(components, function() {});

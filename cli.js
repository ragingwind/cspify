#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var cspify = require('./cspify');
var meow = require('meow');
var _ = require('lodash');
var glob = require("glob");
var bowercfg = require('bower-config').read();
var opts = {input: '**', flags: {}};

if (process.argv.length > 3) {
  opts = meow({
    help: [
      'Usage',
      '   cspify [target components pattern]',
      '   cspify paper-*/*.html',
      '   cspify core-*/ -e ^demo.html|^index.html',
      '   cspify -b bower_component',
      '',
      'Options',
      '-b: bower component directory. .bowerrc config will be ignored',
      '-e: exclusive file. default files pattern is /(test|demo|index).html/'
    ].join('\n')
  }, {default: {unknown: true, '--': false}});
}

var exclusive = new RegExp(opts.flags.e ? opts.flags.e : '(test|demo|index|pre_csp).html');
var components = [];
var bowerpath = opts.flags.b ? opts.flags.b : path.join(bowercfg.cwd, bowercfg.directory);

console.log(opts.input, opts.flags);

// all html files under bower path
if (opts.input.length === 0) {
  opts.input.push('*');
}

_.forEach(opts.input.slice(0, opts.input.length), function(t) {
  console.log(t);
  var component = path.join(bowerpath, t, !/.html/.test(t) ? '/*.html' : '');
  console.log(component);
  _.merge(components, glob.sync(component).filter(function(c) {
    return !exclusive.test(c);
  }));
});

if (components.length === 0) {
  console.error('Could find any components');
  return;
}

console.log(components);

cspify(components, opts.flags);

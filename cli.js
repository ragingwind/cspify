#!/usr/bin/env node

'use strict';

var polyflow = require('./polyflow');
var meow = require('meow');
var q = require('q');

var cli = meow({
  help: [
    'Usage',
    '   polyflow [action] options',
    '',
    'Actions',
    '   components: Do make components.js'
  ].join('\n')
});

polyflow(cli.input[0], cli.flags);

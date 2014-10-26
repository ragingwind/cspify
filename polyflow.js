'use strict';

var fs = require('fs');
var path = require('path');
var whacko = require('whacko');
var async = require('async');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function PathMap () {
  EventEmitter.call(this);

  this.length = 0;
  this.paths = {};
};

util.inherits(PathMap, EventEmitter);

PathMap.prototype.insert = function(filename, param) {
  if (this.find(filename)) {
    return this;
  }

  param = param || {};

  this.paths[filename] = {param: param};
  this.length++;
  this.emit('insert', filename);

  return this;
};

PathMap.prototype.erase = function(filename) {
  if (this.find(filename)) {
    delete this.paths[filename];
    this.length--;
  }

  this.emit('erase', filename);

  return this;
};

PathMap.prototype.find = function(filename) {
  return this.paths[filename];
};

PathMap.prototype.empty = function() {
  return this.length === 0;
};

function Bundler (opts) {
  EventEmitter.call(this);

  this.opts = opts || {};

  // create a map for components
  this._components = new PathMap();

  // create a output file
  this._fd = fs.openSync(opts.output, 'w');

  // create a write queue
  this._writeq = async.queue(function (task, done) {
    fs.write(this._fd, task.data, null, null, function(err) {
      done(err, task);
    });
  }.bind(this), opts.workerCount || 4);

  // save options
  this._excludes = opts.excludes;

  // create components map
  this._components.on('erase', function() {
    this.emit('erase');
    if (this._components.empty()) {
      fs.closeSync(this._fd);
      this.emit('fin');
    }
  }.bind(this));

  // status information
  this.status = {
    writens: [],
    reads: []
  };

  // bind write / read events
  this.on('writen', function(filename) {
    this.status.writens.push(filename);
  }).on('read', function(filename) {
    this.status.reads.push(filename);
  });
};

util.inherits(Bundler, EventEmitter);

Bundler.prototype._import = function (filename, parent) {
  var self = this;
  var components = self._components;

  // exclude the file that already read
  if (components.find(filename)) {
    return;
  }

  // register the file to the list that it will be concatenated with output file
  components.insert(filename, parent ? 'root' : path.basename(filename) + '|' + parent);

  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }

    var $ = whacko.load(data);

    self.emit('read', filename);

    // tie links existing on the file in the bundle
    $('link[rel="import"][href]').each(function() {
      var to = path.resolve(path.dirname(filename), $(this).attr('href'));
      self._import(to, parent);
    });

    // exclude the file then erase filename on the list
    if (self._excludes.test(filename)) {
      components.erase(filename);
      return;
    }

    // push filedata to writing queue, then erase filename on the list
    self._writeq.push({
      filename: filename,
      basename: path.basename(filename),
      data: data
    }, function(err, task) {
      components.erase(task.filename);
      self.emit('writen', task.filename);
    });
  });
}

Bundler.prototype.tieup = function () {
  this._import(this.opts.input);
}

function polyflow(action, flags, done) {
  var bundler = new Bundler({
    excludes: /\/elements\/|polymer.html$/,
    input: flags.i,
    output: path.resolve(path.dirname(flags.i), flags.o ? flags.o : 'components.html')
  });

  bundler.on('fin', function() {
    console.log('GOT SIGNAL, SEND SIGNAL');
    console.log(bundler.status);
    process.exit(0);
  });

  bundler.tieup();

  process.stdin.resume();
}

module.exports = polyflow;

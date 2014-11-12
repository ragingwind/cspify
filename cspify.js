'use strict';

var fs = require('fs');
var path = require('path');
var whacko = require('whacko');
var async = require('async');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function FilepathMap () {
  this.length = 0;
  this.components = {};
};

FilepathMap.prototype.insert = function(filepath, param) {
  if (this.find(filepath)) {
    return this;
  }

  this.components[filepath] = path.basename(filepath);
  this.length++;

  return this;
};

FilepathMap.prototype.erase = function(filepath) {
  if (this.find(filepath)) {
    delete this.components[filepath];
    this.length--;
  }

  return this;
};

FilepathMap.prototype.find = function(filepath) {
  return this.components[filepath];
};

FilepathMap.prototype.empty = function() {
  return this.length === 0;
};

function Bundler (opts) {
  EventEmitter.call(this);

  this.opts = opts || {};

  // create a map for paths
  this.components = new FilepathMap();

  // bind queued data handling method
  this.queue = async.queue(this.parseQueuedData.bind(this), 4);

  return this;
};

util.inherits(Bundler, EventEmitter);

Bundler.prototype.parseQueuedData = function (task, done) {
  var $ = task.$;
  var $script = $('script:not([type]):not([src]), script[type="text/javascript"]:not([src])');

  // getting inline script
  if ($script && $script.length > 0) {
    var scripts = '';
    var scriptName = path.basename(task.filename, '.html') + '-0.js';

    $script.each(function(a) {
      scripts += $($script[a]).html();
    });

    // backup origin file
    fs.writeFileSync(task.filename + '.pre_csp', fs.readFileSync(task.filename), 'utf8');

    // replace inline script to outter
    $script.replaceWith('<script src="' + path.basename(scriptName) + '"></script>');
    fs.writeFileSync(path.join(path.dirname(task.filename), scriptName), scripts, 'utf8');

    // change the file updated
    fs.writeFileSync(task.filename, $.html(), 'utf8');
  }

  done(null, task);
}

Bundler.prototype.import = function (filename) {
  var self = this;
  var components = this.components;

  // exclude the file that already read
  if (components.find(filename)) {
    return;
  }

  // register the file to the list that will be concatenated with output file
  components.insert(filename);

  // read and parse the file
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) {
      if (components.erase(filename).empty()) {
        self.emit('fin');
      }
      return;
    }

    var $ = whacko.load(data);

    // recall import if there were linked existing
    $('link[rel="import"][href]').each(function() {
      var to = path.resolve(path.dirname(filename), $(this).attr('href'));
      self.import(to);
    });

    // push parsed data to writing queue, then erase filename on the list
    self.queue.push({
      filename: filename,
      basename: path.basename(filename),
      $: $
    }, function(err, task) {
      if (components.erase(task.filename).empty()) {
        self.emit('fin');
      }
    });
  });
}

Bundler.prototype.tieup = function () {
  this.opts.components.forEach(function(c) {
    this.import(c);
  }.bind(this));

  return this;
}

function cspify(components, done) {
  var bundler = new Bundler({
    components: components
  })
  .on('fin', function() {
    done();
    process.exit(0);
  })
  .tieup();

  process.stdin.resume();
}

module.exports = cspify;

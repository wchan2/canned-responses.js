var cli = require('./cli'),
    _ = require('lodash');

;(function(globals) {
  'use strict';
  var File = function(options) {
    if (!(this instanceof File)) {
      throw new Error("File must be called as a constructor: new File(<filepath>)");
    }

    options = options || {};
    this.responseDirPath = options.path || 'responses';
    this.ext = options.format || 'json';
  };

  File.prototype.getResponseDirPath = function() {
    var responseDirOption;
    if (this.responseDirPath) {
      responseDirOption = [
        process.cwd(),
        this.responseDirPath.replace(/(^\/)|(\/$)/g, '')
      ].join('/');
    }
    return responseDirOption;
  };

  File.prototype.getExt = function(extension) {
    return this.ext;
  };

  File.prototype.getResponseFilename = function(method, url) {
    var filename = [method.toLowerCase()].
      concat( _.compact(url.split('/'))).
      join('.');
    return [filename, this.getExt()].join('.');
  };

  globals.File = File;
}(exports));
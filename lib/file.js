var cli = require('./cli'),
    _ = require('lodash');

;(function(globals) {
  'use strict';
  var File = function(options) {
    if (!(this instanceof File)) {
      throw new Error("File must be called as a constructor: new File(<filepath>)");
    }

    this.responseDirPath = options.path;
    this.ext = options.format;
  };

  File.prototype.getResponseDirPath = function() {
    var responseDirOption;

    if (this.responseDirPath) {
      responseDirOption = [
        process.cwd(),
        this.responseDirPath.replace(/(^\/)|(\/$)/g, '')
      ].join('/');
    }
    return responseDirOption || './responses';
  };

  File.prototype.getExt = function(extension) {
    return this.ext || 'json';
  };

  File.prototype.getResponseFileName = function(method, url) {
    var urlParts = _.compact(url.split('/'));
    return [method.toLowerCase()].concat(urlParts.concat(this.getExt())).join('.');
  };

  globals.File = File;
}(exports))
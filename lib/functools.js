
"use strict";

var _ = require('lodash');

// ====
// TODO:
// for PUT or POST requests, it might make sense to dynamically add and update the list
// watch for the file changes to reload the cache
// inject the command arguments instead of calling the function directly
// write a logger

// TODO
// throw errors for invalid command line options
// allow for managing different command line options
// - port
// - format
// - responses folder path
// - configfile to read from a configuration file
var getCommandLineOptions = function(option) {
  var optionIndex; 
  optionIndex = process.argv.indexOf('-' + option);
  if (optionIndex != -1 && optionIndex <= process.argv.length - 1) {
    return process.argv[optionIndex + 1];
  }
};

// ====
// RESPONSE DIR
var getResponseDirPath = (function(responseDirPath) {
  var responseDirOption;
  if (responseDirPath) {
    responseDirOption = [
      process.cwd(),
      responseDirPath.replace(/(^\/)|(\/$)/g, '')
    ].join('/');
  }
  return function() {
    return responseDirOption || './responses';
  };
})(getCommandLineOptions('path'));

// ====
// FILE EXTENSION
var getExt = (function(extension) {
  return function() {
    return extension || 'json';
  };
})(getCommandLineOptions('format'));

// ====
// RESPONSE FILE
var getResponseFileName = function(method, url) {
  var urlParts = _.compact(url.split('/'));

  return [method.toLowerCase()].concat(urlParts.concat(getExt())).join('.');
};

// ====
// CACHE
var Cache = function() {};
_(Cache.prototype).extend({
  _cache: {},
  set: function(key, data) {
    this._cache[key] = data;
  },
  get: function(key) {
    return this._cache[key];
  }
});

// ====
// URI
var isValidUri = function(uri) {
  return uri !== '/favicon.ico';
};

// ====
// HTTP RESPONSE
var sendResponse = function(code) {
  var contentType = {"Content-Type": "application/" + getExt() };
  return function(response, data) {
    response.writeHead(code, contentType);
    response.write(data);
    response.end();
  };
};
var sendErrorResponse = sendResponse(404);
var sendSuccessResponse = sendResponse(200);


// ====
// EXPORTING FUNCTIONS
exports.Cache = Cache;

exports.getExt = getExt;
exports.getResponseDirPath = getResponseDirPath;
exports.getResponseFileName = getResponseFileName;

exports.isValidUri = isValidUri;
exports.sendErrorResponse = sendErrorResponse;
exports.sendSuccessResponse = sendSuccessResponse;

exports.getCommandLineOptions = getCommandLineOptions;
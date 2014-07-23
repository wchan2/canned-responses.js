


var cli = require('./cli'),
    _ = require('lodash');

// ====
// RESPONSE DIR
;(function(globals) {
  'use strict';

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
  })(cli.getCommandLineOptions('path'));

  // ====
  // FILE EXTENSION
  var getExt = (function(extension) {
    return function() {
      return extension || 'json';
    };
  })(cli.getCommandLineOptions('format'));

  // ====
  // RESPONSE FILE
  var getResponseFileName = function(method, url) {
    var urlParts = _.compact(url.split('/'));

    return [method.toLowerCase()].concat(urlParts.concat(getExt())).join('.');
  };

  globals.getExt = getExt;
  globals.getResponseDirPath = getResponseDirPath;
  globals.getResponseFileName = getResponseFileName;
})(exports);
#!/usr/local/bin/node

var http = require('http'),
    fs = require('fs'),
    _ = require('lodash');


// ====
// TODO:
// for PUT or POST requests, it might make sense to dynamically add and update the list
// watch for the file changes to reload teh cache
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
// PORT NUMBER
var port = getCommandLineOptions('port') || '8080';

// ====
// RESPONSE FILE
var ResponseFile = function(options) {
  this.options = options;
};
_(ResponseFile.prototype).extend({
  getAbsolutePath: function(responseDir) {
    var urlParts = _.compact(this.options.url.split('/')),
        filename = [this.options.method.toLowerCase()].concat(urlParts.concat(getExt())).join('.');

    return [responseDir, filename].join('/');
  }
});

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
var URI = function(uri) {
  this.uri = uri;
};
_(URI.prototype).extend({
  isValid: function() {
    return this.url !== '/favicon.ico';
  }
});

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
// CREATING THE SERVER
var server = http.createServer(function(request, response) {
  var cache = new Cache(),
      uri = new URI(request.url),
      responseFile = new ResponseFile(request),
      responseFileAbsolutePath = responseFile.getAbsolutePath(getResponseDirPath());

  fs.exists(responseFileAbsolutePath, function(exists) {
    if (uri.isValid() && exists) {
      if (cache.get(responseFileAbsolutePath)) {
        sendSuccessResponse(response, cache.get(responseFileAbsolutePath));
      } else {
        fs.readFile(responseFileAbsolutePath, function(err, data) {
          cache.set(responseFileAbsolutePath, data);
          sendSuccessResponse(response, cache.get(responseFileAbsolutePath));
        });
      }
    } else if (uri.isValid() && !exists) {
      console.log(['404:', responseFileAbsolutePath, 'not found.'].join(' '));
      sendErrorResponse(response, JSON.stringify({
        status: 404,
        message: 'Not Found'
      }));
    }
  });
});

// ====
// SETTING UP THE PORT
server.listen(port);
console.log(_.template('Listening to port <%= port %>...', { port: port }));


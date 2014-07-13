#!/usr/local/bin/node

var http = require('http'),
    fs = require('fs'),
    _ = require('lodash');


// ====
// TODO:
// for PUT or POST requests, it might make sense to dynamically add and update the list
// watch for the file changes to reload teh cache
// inject the command arguments instead of calling the function directly

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
// HTTP Response
var HTTPResponse = function(response) {
  this.response = response;
};
_(HTTPResponse.prototype).extend({
  sendFoundResponse: function(data) {
    this.response.writeHead(200, {"Content-Type": "application/" + getExt() });
    this.response.write(data);
    this.response.end();
  },
  sendError: function() {
    this.response.writeHead(404);
    this.response.write(JSON.stringify({
      status: 404,
      message: "Not Found"
    }));
    this.response.end();
  }
});

// ====
// CREATING THE SERVER
var server = http.createServer(function(request, response) {
  var cache = new Cache(),
      uri = new URI(request.url),
      httpResponse = new HTTPResponse(response),
      responseFile = new ResponseFile(request),
      responseFileAbsolutePath = responseFile.getAbsolutePath(getResponseDirPath());
  fs.exists(responseFileAbsolutePath, function(exists) {
    if (uri.isValid() && exists) {
      if (cache.get(responseFileAbsolutePath)) {
        httpResponse.send(cache.get(responseFileAbsolutePath));
      } else {
        fs.readFile(responseFileAbsolutePath, function(err, data) {
          cache.set(responseFileAbsolutePath, data);
          httpResponse.sendFoundResponse(cache.get(responseFileAbsolutePath));
        });
      }
    } else if (uri.isValid() && !exists) {
      httpResponse.sendError();
      console.log(['404:', responseFileAbsolutePath, 'not found.'].join(' '));
    }
  });
});

// ====
// SETTING UP THE PORT
server.listen(port);
console.log(_.template('Listening to port <%= port %>...', { port: port }));


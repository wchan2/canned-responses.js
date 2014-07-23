#!/usr/local/bin/node

'use strict';

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

var http = require('http'),
    fs = require('fs'),
    _ = require('lodash'),
    httpResponse = require('./lib/httpResponse'),
    cache = require('./lib/cache'),
    cli = require('./lib/cli'),
    file = require('./lib/file');

// COMMAND LINE OPTIONS
// ====
var options = cli.getCommandLineOptions(process.argv);

// ====
// URI
var isValidUri = function(uri) {
  return uri !== '/favicon.ico';
};

// ====
// CREATING THE SERVER
var server = http.createServer(function(request, response) {
  var responseCache = new cache.Cache(),
      responseFileAbsolutePath = [
        file.getResponseDirPath(),
        file.getResponseFileName(request.method, request.url)
      ].join('/');

  fs.exists(responseFileAbsolutePath, function(exists) {
    if (isValidUri(request.url) && exists) {
      if (responseCache.get(responseFileAbsolutePath)) {
        httpResponse.sendSuccessResponse(response, responseCache.get(responseFileAbsolutePath));
      } else {
        fs.readFile(responseFileAbsolutePath, function(err, data) {
          responseCache.set(responseFileAbsolutePath, data);
          httpResponse.sendSuccessResponse(response, responseCache.get(responseFileAbsolutePath));
        });
      }
    } else if (isValidUri(request.url) && !exists) {
      console.log(['404:', responseFileAbsolutePath, 'not found.'].join(' '));
      httpResponse.sendErrorResponse(response, JSON.stringify({
        status: 404,
        message: 'Not Found'
      }));
    }
  });
});

// ====
// SETTING UP THE PORT
server.listen(options.port || 8080);
console.log(_.template('Listening to port <%= port %>...', { port: options.port || 8080 }));


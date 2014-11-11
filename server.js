#!/usr/local/bin/node

var http = require('http'),
    fs = require('fs'),
    _ = require('lodash'),
    Http = require('./lib/http').Http,
    cache = require('./lib/cache'),
    cli = require('./lib/cli'),
    File = require('./lib/file').File;

;(function() {
  'use strict';

  var options, file, server, httpResponse;

  var isValidUri = function(uri) {
    return uri !== '/favicon.ico';
  };

  options = cli.getCommandLineOptions(process.argv);
  file = new File(options);
  httpResponse = new Http(options.format || 'json');

  // ====
  // CREATING AND STARTING THE SERVER
  server = http.createServer(function(request, response) {
    var responseCache,
        responseFileAbsolutePath;

    responseCache = new cache.Cache(),
    responseFileAbsolutePath = [file.getResponseDirPath(), file.getResponseFilename(request.method, request.url)].join('/');

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

  console.log(_.template('Listening to port <%= port %>...', { port: options.port || 8080 }));
  server.listen(options.port || 8080);
}());
#!/usr/local/bin/node

"use strict";

var http = require('http'),
    fs = require('fs'),
    _ = require('lodash'),
    functools = require('./lib/functools');

// ====
// PORT NUMBER
var port = functools.getCommandLineOptions('port') || '8080';

// ====
// CREATING THE SERVER
var server = http.createServer(function(request, response) {
  var cache = new functools.Cache(),
      responseFileAbsolutePath = [
        functools.getResponseDirPath(),
        functools.getResponseFileName(request.method, request.url)
      ].join('/');

  fs.exists(responseFileAbsolutePath, function(exists) {
    if (functools.isValidUri(request.url) && exists) {
      if (cache.get(responseFileAbsolutePath)) {
        functools.sendSuccessResponse(response, cache.get(responseFileAbsolutePath));
      } else {
        fs.readFile(responseFileAbsolutePath, function(err, data) {
          cache.set(responseFileAbsolutePath, data);
          functools.sendSuccessResponse(response, cache.get(responseFileAbsolutePath));
        });
      }
    } else if (uri.isValid() && !exists) {
      console.log(['404:', responseFileAbsolutePath, 'not found.'].join(' '));
      functools.sendErrorResponse(response, JSON.stringify({
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


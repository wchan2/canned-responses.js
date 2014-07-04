#!/usr/local/bin/node

var http = require('http'),
    fs = require('fs'),
    _ = require('lodash');

// TODO: allow the directory of which to service the static requests to be changed
// for PUT or POST requests, it might make sense to dynamically add and update the list
// allow file extensions options
// allow an option to read from configuration file
// allow ports to be changed
// reload the server on addition of response files
var getFileName = function(method, url) {
  var urlParts = _.compact(url.split('/')),
      fileName = [method.toLowerCase()];

  fileName = fileName.concat(urlParts).join('.') + '.json';
  return fileName;
};

var getResponseDirPath = function(fileName) {
  var indexOfResponsePath,
      responsePath,
      responseDirWithoutSlashes;

  indexOfResponsePath = process.argv.indexOf('-path');

  if (indexOfResponsePath != -1 && indexOfResponsePath <= process.argv.length - 1) {
    responseDirWithoutSlashes = process.argv[indexOfResponsePath + 1].replace(/(^\/)|(\/$)/g, '');
    responsePath = [process.cwd(), responseDirWithoutSlashes].join('/');
  } else {
    responsePath = './responses';
  }

  return [responsePath, fileName].join('/');
};

var sendResponse = function(responseFilePath, response) {
  return function(exists) {
    if (exists) {
      fs.readFile(responseFilePath, function(err, data) {
        response.writeHead(200, {"Content-Type": "text/json"});
        response.write(data);
        response.end();
      });
    } else {
      response.writeHead(404);
      response.write(JSON.stringify({
        status: 404,
        message: "Not Found"
      }));
      response.end();
    }
  }
};

var server = http.createServer(function(request, response) {
  var fileName = getFileName(request.method, request.url),
    responseFilePath = getResponseDirPath(fileName);
  if (request.url !== '/favicon.ico') {
    fs.exists(responseFilePath, sendResponse(responseFilePath, response));
  }
});

server.listen('8080');
console.log('Listening to port 8080...');
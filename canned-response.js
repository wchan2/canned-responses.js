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
// properly throw errors for invalid command line options
// cache the results if it had previously read from the server unless updated
var getCommandLineOptions = function(option) {
  var optionIndex; 
  optionIndex = process.argv.indexOf('-' + option);
  if (optionIndex != -1 && optionIndex <= process.argv.length - 1) {
    return process.argv[optionIndex + 1];
  }
};

// ====
// RESPONSE CONSTRUCTOR
var Response = function(options) {
  this.options = options;
  this.method = options.method;
  this.url = options.url;
};
_(Response.prototype).extend({
  send: function(response) {
    fs.exists(this.getFilePath(), this.readResponseFile(this.getFilePath(), response));
  },
  getFilePath: function() {
    var urlParts = _.compact(this.url.split('/')),
        filename = [this.method.toLowerCase()].concat(urlParts).join('.') + '.json';
    return [this.getResponseDirPath(), filename].join('/');
  },
  getResponseDirPath: function() {
    var responsePath,
        responseDirWithoutSlashes;

    if (getCommandLineOptions('path')) {
      responseDirWithoutSlashes = getCommandLineOptions('path').replace(/(^\/)|(\/$)/g, '');
      responsePath = [process.cwd(), responseDirWithoutSlashes].join('/');
    } else {
      responsePath = './responses';
    }

    return responsePath;
  },
  responseIsValid: function() {
    return this.url !== '/favicon.ico';
  },
  readResponseFile: function(responseFilePath, response) {
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
  }
});

// ====
// CREATING THE SERVER
var server = http.createServer(function(request, response) {
  var responseSender = new Response({
    method: request.method,
    url: request.url
  });
  if (responseSender.responseIsValid()) {
    responseSender.send(response);
  }
});

// ====
// SETTING UP THE PORT
server.listen(getCommandLineOptions('port') || '8080');
console.log(_.template('Listening to port <%= port %>...', {
  port: getCommandLineOptions('port') || '8080'
}));
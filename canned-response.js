#!/usr/local/bin/node

var http = require('http'),
    fs = require('fs'),
    _ = require('lodash');

// TODO:
// for PUT or POST requests, it might make sense to dynamically add and update the list
// cache the results if it had previously read from the server unless updated

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
// RESPONSE FILE
var ResponseFile = function() {};
_(ResponseFile.prototype).extend({
  getFilePath: function(method, url) {
    var urlParts = _.compact(url.split('/')),
        filename = [method.toLowerCase()].concat(urlParts).join('.') + this.getFileFormat();

    return [this.getResponseDirPath(), filename].join('/');
  },
  getFileFormat: function() {
      return '.' + (getCommandLineOptions('format') || 'json');
  },
  getResponseDirPath: function() {
    var responsePath,
        responseDirWithoutSlashes;

    // TODO: create a commands object to allow this to be overridden
    if (getCommandLineOptions('path')) {
      responseDirWithoutSlashes = getCommandLineOptions('path').replace(/(^\/)|(\/$)/g, '');
      responsePath = [process.cwd(), responseDirWithoutSlashes].join('/');
    } else {
      responsePath = './responses';
    }

    return responsePath;
  }
});

ResponseFile.get = (function() {
  var instance;
  return function() {
    if (!instance) {
      instance = new ResponseFile();
    }
    return instance;
  };
})();

// ====
// RESPONSE
var ResponseSender = function(options) {
  this.options = options;
  this.method = options.method;
  this.url = options.url;
};
_(ResponseSender.prototype).extend({
  send: function(response, responseFile) {
    var filePath = responseFile.getFilePath(this.method, this.url);
    fs.exists(filePath, this.readResponseFile(filePath, response));
  },
  urlIsValid: function() {
    return this.url !== '/favicon.ico';
  },
  readResponseFile: function(responseFilePath, response) {
    return function(exists) {
      if (exists) {
        fs.readFile(responseFilePath, function(err, data) {
          response.writeHead(200, {"Content-Type": "application/" + (getCommandLineOptions('format') || 'json') });
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
var server = http.createServer(function(request, httpResponse) {
  var responseSender = new ResponseSender({
    method: request.method,
    url: request.url
  });
  if (responseSender.urlIsValid()) {
    responseSender.send(httpResponse, ResponseFile.get());
  }
});

// ====
// SETTING UP THE PORT
server.listen(getCommandLineOptions('port') || '8080');
console.log(_.template('Listening to port <%= port %>...', {
  port: getCommandLineOptions('port') || '8080'
}));
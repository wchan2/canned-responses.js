var http = require('http'),
    fs = require('fs'),
    _ = require('lodash');

// TODO: allow the directory of which to service the static requests to be changed
// for PUT or POST requests, it might make sense to dynamically add and update the list
// allow file extensions options
// allow an option to read from configuration file
var getFileName = function(method, url) {
  var urlParts = _.compact(url.split('/')),
      fileName = [method.toLowerCase()];

  fileName = fileName.concat(urlParts).join('.') + '.json';
  return fileName;
};

var getResponsePath = function(fileName) {
  return ['.', 'responses', fileName].join('/');
};

var server = http.createServer(function(request, response) {
  var fileName = getFileName(request.method, request.url);
  if (request.url !== '/favicon.ico') {
    fs.readFile(getResponsePath(fileName), function(err, data) {
      response.writeHead(200, {"Content-Type": "text/json"});
      response.write(data);
      response.end();
    });
  }
});

// TODO: allow the ports to be changed
server.listen('8080');
console.log('Listening to port 8080...');
var http = require('http'),
    fs = require('fs'),
    _ = require('lodash');

// TODO: allow the directory of which to service the static requests to be changed
// for PUT or POST requests, it might make sense to dynamically add and update the list
// allow file extensions options
// allow an option to read from configuration file
var parseRequest = function(request) {
  var urlParts = _.compact(request.url.split('/')),
      fileName = [request.method.toLowerCase()];

  fileName = fileName.concat(urlParts).join('.') + '.json';
  return fileName;
};

var server = http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/json"});
  response.write(parseRequest(request));
  response.end();
});

// TODO: allow the ports to be changed
server.listen('8080');
console.log('Listening to port 8080...');
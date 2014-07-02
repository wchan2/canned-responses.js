var http = require('http'),
    fs = require('fs'),
    _ = require('lodash');

var parseRequest = function(request) {
  var urlParts = _.compact(request.url.split('/')),
      fileName = [request.method.toLowerCase()];

  fileName = fileName.concat(urlParts).join('.') + '.json';
};

var server = http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/json"});
  response.write(parseRequest(request));
  response.end();
});


server.listen('8080');
console.log('Listening to port 8080...');
var request = require('request'),
    _ = require('lodash'),
    fs = require('fs');


// TODO: generating a README.md for documentation
var resty = {
  defaultOptions: {
    json: true
  },
  extendDefaults: function(options) {
    return _.extend({}, this.defaultOptions, options);
  },
  decorate: function(arguments) {
    return function() {

    };
  }
};


// ALL OF THE FUNCTIONS ARE TIGHTLY COUPLED TO READ DATA FROM FILE
var findFilename = function(method, url, openFile) {
  var pathParts = url.split('/').slice(3),
      jsonFile = [method].concat(pathParts).join('.');

  return function(_, doneFn) {
    openFile(jsonFile, doneFn);
  };
};

var readDataFromFile = function(jsonFile, callback) {
  fs.readFile(jsonFile, 'utf8', function(err, jsonBody) {
    var options;
    if (!err) {
      JSON.parse(json);
    }

    callback(resty.defaultOptions);
  });
};

get = function(url, jsonFile) {
  var setBodyFn = readDataFromFile;
  if (!jsonFile) {
    setBodyFn = findFilename('get', url, readDataFromFile);
  }
  return function(doneFn) {
    setBodyFn(jsonFile, function(options) {
      request.get(url, options).pipe(doneFn);
    });
  };
};


// TODO: interfaces to support
// url
// missing file name
// missing header options
get('http://localhost:3000/test', 'get.test.test2.json').call(function(response) {

});

get('http://localhost:3000/test').call(function(response) {

});
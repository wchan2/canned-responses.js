
var file = require('./file');

// ====
// HTTP RESPONSE
;(function(globals) {
  'use strict';

  var sendResponse = function(code) {
    var contentType = {"Content-Type": "application/" + file.getExt() };
    return function(response, data) {
      response.writeHead(code, contentType);
      response.write(data);
      response.end();
    };
  };
  var sendErrorResponse = sendResponse(404);
  var sendSuccessResponse = sendResponse(200);

  globals.sendErrorResponse = sendErrorResponse;
  globals.sendSuccessResponse = sendSuccessResponse;
})(exports);
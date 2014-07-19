
"use strict";

var file = require('./file');

// ====
// HTTP RESPONSE
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

exports.sendErrorResponse = sendErrorResponse;
exports.sendSuccessResponse = sendSuccessResponse;
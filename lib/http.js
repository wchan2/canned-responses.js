
var File = require('./file').File;

// ====
// HTTP RESPONSE
;(function(globals) {
  'use strict';

  var NOT_FOUND = 404,
      STATUS_OK = 200;

  var Http = function(contentType) {
    if (!(this instanceof Http)) {
      throw new Error("Http must be called as a constructor: new Http (<filepath>)");
    }

    this.contentType = {"Content-Type": "application/" + contentType };
  };

  Http.prototype.sendResponse = function(status, response, data) {
    response.writeHead(status, this.contentType);
    response.write(data);
    response.end();
  };

  Http.prototype.sendErrorResponse = function(response, data) {
    this.sendResponse(NOT_FOUND, response, data);
  };

  Http.prototype.sendSuccessResponse = function(response, data) {
    this.sendResponse(STATUS_OK, response, data);
  };
  
  globals.Http = Http;
})(exports);
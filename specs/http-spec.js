
var Http = require('../lib/http').Http;

;(function() {
	'use strict';

	describe('http package', function() {
		describe('Http class', function() {
			it('exists', function() {
				expect(Http).toEqual(jasmine.any(Function));
			});

			it('throws an error when called without the `new` keyword', function() {
				expect(function() { Http(); }).toThrow();
			});

			it('throws an error when called without a parameter', function() {
				expect(function() { new Http(); }).toThrow();
			});

			it('assigns the `.contentType` as an object with `Content-Type` as the key value', function () {
				var fakeHttp = new Http('json');

				expect(fakeHttp.contentType).toBeDefined();
				expect(fakeHttp.contentType['Content-Type']).toEqual('application/json');
			});

			describe('.sendResponse(<status>, <response>, <data>)', function() {
				var testHttp,
						responseStub,
						fakeData,
						fakeStatus;
				beforeEach(function() {
					testHttp = new Http('json');
					responseStub = jasmine.createSpyObj('response', ['writeHead', 'write', 'end']);
					fakeData = { hello: 'world' };
					fakeStatus = 200;
				});

				it('exists', function() {
					expect(testHttp.sendResponse).toEqual(jasmine.any(Function));
				});

				it('calls `response.writeHead` to write the headers', function() {
					testHttp.sendResponse(fakeStatus, responseStub, fakeData);
					expect(responseStub.writeHead).toHaveBeenCalledWith(fakeStatus, testHttp.contentType);
				});

				it('calls `response.write` to write data to the response body', function() {
					testHttp.sendResponse(fakeStatus, responseStub, fakeData);
					expect(responseStub.write).toHaveBeenCalledWith(fakeData);
				});

				it('calls `response.end` to close writing to the response', function() {
					testHttp.sendResponse(fakeStatus, responseStub, fakeData);
					expect(responseStub.end).toHaveBeenCalled();
				});
			});

			describe('.sendErrorResponse(<response>, <data>)', function() {
				var testHttp,
						fakeResponse,
						fakeData;
				beforeEach(function() {
					testHttp = new Http('json');
					fakeResponse = { sample: 'response' };
					fakeData = { sample: 'data' };
					spyOn(testHttp, 'sendResponse');
				});

				it('exists', function() {
					expect(testHttp.sendErrorResponse).toEqual(jasmine.any(Function));
				});

				it('calls `.sendResponse()` to send a response', function() {
					testHttp.sendErrorResponse(fakeResponse, fakeData);
					expect(testHttp.sendResponse).toHaveBeenCalledWith(404, fakeResponse, fakeData);
				});
			});

			describe('.sendSuccessResponse(<response>, <data>)', function() {
				var testHttp,
						fakeResponse,
						fakeData;
				beforeEach(function() {
					testHttp = new Http('json');
					fakeResponse = { sample: 'response' };
					fakeData = { sample: 'data' };
					spyOn(testHttp, 'sendResponse');
				});

				it('exists', function() {
					expect(testHttp.sendSuccessResponse).toEqual(jasmine.any(Function));
				});

				it('calls `.sendResponse()` to send a response', function() {
					testHttp.sendSuccessResponse(fakeResponse, fakeData);
					expect(testHttp.sendResponse).toHaveBeenCalledWith(200, fakeResponse, fakeData);
				});
			});				
		});
	});
}());
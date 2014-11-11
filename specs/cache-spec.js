
var Cache = require('../lib/cache').Cache;

;(function() {
	'use strict';

	describe('cache package', function() {
		describe('Cache class', function() {
			it('exists', function() {
				expect(Cache).toEqual(jasmine.any(Function));
			});

			it('throws an error when called without the `new` keyword', function() {
				expect(function() { Cache(); }).toThrow();
			});

			it('sets `._cache` to an empty object', function() {
				var testCache = new Cache();
				expect(testCache._cache).toEqual(jasmine.any(Object));
			});

			describe('.set(<key>, <data>)', function() {
				var testCache;
				beforeEach(function() {
					testCache = new Cache();
				});

				it('exists', function() {
					expect(testCache.set).toEqual(jasmine.any(Function));
				});

				it('sets `._cache` object with the provided key and the data as the value', function() {
					var fakeObj = { test: 'object' };
					testCache.set('testKey', fakeObj);
					expect(testCache._cache.testKey).toEqual(fakeObj);
				});
			});

			describe('.get(<key>)', function() {
				var testCache;
				beforeEach(function() {
					testCache = new Cache();
				});

				it('exists', function() {
					expect(testCache.get).toEqual(jasmine.any(Function));
				});

				it('returns a value for given `key` that exists', function() {
					testCache._cache.testKey = 'cachedValue';
					expect(testCache.get('testKey')).toEqual('cachedValue');
				});

				it('returns an undefined value given a `key` that does not exist', function() {
					expect(testCache.get('testKey')).toBeUndefined();
				});
			});
		});
	});
}());
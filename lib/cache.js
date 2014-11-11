
var _ = require('lodash');

// ====
// CACHE
;(function(globals) {
  'use strict';

  var Cache = function() {
    if (!(this instanceof Cache)) {
      throw new Error('Cache must be called as a constructor: new Cache()');
    }
    this._cache = {};
  };
  _(Cache.prototype).extend({
    set: function(key, data) {
      this._cache[key] = data;
    },
    get: function(key) {
      return this._cache[key];
    }
  });

  globals.Cache = Cache;
})(exports);



var _ = require('lodash');

// ====
// CACHE
;(function(globals) {
  'use strict';

  var Cache = function() {};
  _(Cache.prototype).extend({
    _cache: {},
    set: function(key, data) {
      this._cache[key] = data;
    },
    get: function(key) {
      return this._cache[key];
    }
  });

  globals.Cache = Cache;
})(exports);
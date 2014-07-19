
"use strict";

var _ = require('lodash');

// ====
// CACHE
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

exports.Cache = Cache;
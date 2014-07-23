
var cli = require('../lib/cli'),
    assert = require('assert');

;(function() {
  'use strict';

  describe('cli package', function() {
    describe('.getCommandLineOptions', function() {
      it('returns an object where the property name and property value is option name and option value, respectively', function() {
        var options = cli.getCommandLineOptions(['testCommand', '-testOpt', 'testOptValue']);
        assert.equal(options.testOpt, 'testOptValue');
      });
    });
  });
})();
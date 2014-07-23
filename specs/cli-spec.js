
var cli = require('../lib/cli'),
    assert = require('assert');

;(function() {
  'use strict';

  describe('cli package', function() {
    describe('.getCommandLineOptions', function() {
      it('returns an object where the property name and property value is option name and option value, respectively', function() {
        var options = cli.getCommandLineOptions(['testCommand', '-testOpt', 'testOptValue', '-anotherTestOpt', 'anotherTestOptValue']);
        assert.equal(options.testOpt, 'testOptValue');
        assert.equal(options.anotherTestOpt, 'anotherTestOptValue');
      });

      it('should not return undefined property values for specified options without specified values', function() {
        var options = cli.getCommandLineOptions(['testCommand', '-testOpt', '-anotherTestOpt']);
        console.log("OPTIONS", options);
        assert.equal(options.testOpt, undefined);
        assert.equal(options.anotherTestOpt, undefined);
      });
    });
  });
})();
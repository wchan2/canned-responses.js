
var getCommandLineOptions = require('../lib/cli').getCommandLineOptions;

;(function() {
  'use strict';

  describe('cli package', function() {
    describe('.getCommandLineOptions', function() {
      it('is to be a function', function() {
        expect(typeof getCommandLineOptions).toEqual('function');
      });

      it('returns an object where the property name and property value is option name and option value, respectively', function() {
        var options = getCommandLineOptions(['testCommand', '-testOpt', 'testOptValue', '-anotherTestOpt', 'anotherTestOptValue']);
        expect(options.testOpt).toEqual('testOptValue');
        expect(options.anotherTestOpt).toEqual('anotherTestOptValue');
      });

      it('should not return undefined property values for specified options without specified values', function() {
        var options = getCommandLineOptions(['testCommand', '-testOpt', '-anotherTestOpt']);
        expect(options.testOpt).toEqual(undefined);
        expect(options.anotherTestOpt).toEqual(undefined);
      });
    });
  });
})();
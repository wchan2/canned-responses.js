(function(canned, assert) {
  "use strict";

  describe('getCommandLineOptions', function() {
    // beforeEach(function() {
    //   process.argv = "node canned-response.js -path testPath";
    // });
    it('returns the option value given the option flag', function() {
      assert.equal(getCommandLineOptions('path'), 'testPath');
    });
  });

})(require('../canned-response'), require('assert'));
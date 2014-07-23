var _ = require('lodash');

;(function(globals) {
  'use strict';

  var getCommandLineOptions = function(commandLineArgs) {
    var options = {},
        optionIndices;

    optionIndices = _.chain(commandLineArgs).map(function(value, index) {
      if (value[0] === '-') {
        return index;
      }
    }).compact().value();

    options = _(optionIndices).reduce(function(memo, index) {
      memo[commandLineArgs[index].substring(1)] = commandLineArgs[index + 1];
      return memo;
    }, options);

    return options;
  };

  globals.getCommandLineOptions = getCommandLineOptions;
})(exports);
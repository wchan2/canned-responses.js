var sys = require('sys'),
    exec = require('child_process').exec;

var regExes = {
  specs: new RegExp(/specs\/.*\.js/i)
};

var runTests = function() {
  exec('npm test', function(error, stdout, stderror) {
    sys.print(stdout, stderror);
  });
};

var watchedEvents = {
  "canned-response.js": function() {
    runTests();      
  },
};

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['canned-response.js', 'specs/**/*-spec.js'],
      options: {
        globals: {
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('default', ['jshint', 'test']);

  grunt.event.on('watch', function(action, filepath, target) {
    var triggerFn = watchedEvents[filepath];

    if (triggerFn) {
      triggerFn();
    } else {
      if (regExes.specs.test(filepath)) {
        runTests();
      }
    }
  });
};
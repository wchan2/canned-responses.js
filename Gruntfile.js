var sys = require('sys'),
    exec = require('child_process').exec;

var watchedEvents = {
  "server.js": function() {
    runTests();      
  },
};

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['server.js', 'lib/**/*.js', 'specs/**/*-spec.js'],
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

  grunt.event.on('watch', function() {
    exec('npm test', function(error, stdout, stderror) {
      sys.print(stdout, stderror);
    });
  });
};
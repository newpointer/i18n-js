//
module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {}
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint']);
};

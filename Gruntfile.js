//
module.exports = function(grunt) {
    /*
    grunt.initConfig({
        jshint: {}
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint']);
    */

    /*
    grunt.initConfig({

        // server-side tests
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/*_test.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', ['mochaTest']);
    */

    //
    var testServerPort = 9000;

    grunt.initConfig({
        clean: ['node_modules', 'bower_components'],

        bower: {
            install: {
                options: {
                    targetDir: './lib',
                    layout: 'byComponent',
                    install: true,
                    verbose: true,
                    cleanTargetDir: true,
                    cleanBowerDir: false,
                    bowerOptions: {
                        forceLatest: true,
                        production: true
                    }
                }
            }
        },

        connect: {
            'test-server': {
                options: {
                    port: testServerPort,
                    base: '.'
                }
            }
        },

        shell: {
            'mocha-phantomjs-tests': {
                command: 'node_modules/mocha-phantomjs/bin/mocha-phantomjs -R spec http://localhost:' + testServerPort + '/test/test.html',
                options: {
                    stdout: true,
                    stderr: true
                }
            }
        },

        jshint: {
            options: {
                force: true,
                browser: true,
                '-W069': true
            },
            src: ['src/**/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('init', ['bower']);
    grunt.registerTask('test', ['connect', 'shell:mocha-phantomjs-tests']);
    grunt.registerTask('build', ['bower', 'jshint:src', 'connect', 'shell:mocha-phantomjs-tests']);
};

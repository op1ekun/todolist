module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },
        watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: [ 
                    'index.html',
                    'app/*.js',
                    'app/modules/*/*.js',
                ],
                tasks: [ 
                    // 'karma',
                    'build',
                ]
            },
        },
        ngAnnotate: {
            options: {
                add: true,
                singleQuotes: true
                // sourceMap: 'dist/bundle.js'
            },
            dist: {
                files: {
                    'dist/bundle.js': [ 'app/modules/*/*.js', 'app/*.js']
                }
            }
        },
        uglify: {
            options: {
                sourceMap: true,
                sourceMapName: 'dist/bundle.map'
            },
            build: {
                src: 'dist/bundle.js',
                dest: 'dist/bundle.min.js'
            }            
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-ng-annotate');

    // Default task(s).
    grunt.registerTask('build', ['ngAnnotate', 'uglify']);
    grunt.registerTask('default', ['karma', 'build']);
};

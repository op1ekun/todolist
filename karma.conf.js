// Karma configuration
// Generated on Tue Nov 11 2014 23:28:35 GMT+0000 (GMT Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    // keep the order as in test runner html file, IT DOES MATTER!
    files: [
        'bower_components/angular/angular.min.js',
        'bower_components/angular-mocks/angular-mocks.js',
        // 'app/modules/notification/notification.services.js',
        // 'app/modules/notification/notification.module.js',
        'app/modules/list/list.directives.js',
        'app/modules/list/list.decorators.js',
        'app/modules/list/list.module.js',
        'app/modules/todolist/todolist.directives.js',
        'app/modules/todolist/todolist.module.js',
        'app/modules/itemvalidator/itemvalidator.directives.js',
        'app/modules/itemvalidator/itemvalidator.module.js',
        'app/app.controllers.js',
        'app/app.js',
        'test/spec/**/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    plugins: [
        'karma-phantomjs-launcher',
        'karma-spec-reporter',
        'karma-jasmine'
    ],


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
        // 'Chrome', 
        // 'Firefox', 
        // 'IE', 
        'PhantomJS'
    ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};

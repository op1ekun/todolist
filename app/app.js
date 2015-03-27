angular.module('todoApp', [
    'todoApp.Controllers',
    'todolist',
    'itemValidator'
])
.config(function() {
    'use strict';

    // DEBUG
    // console.log('app configured');
})
.run(function($rootScope) {
    'use strict';

    // add app version to the "global" namespace
    $rootScope.app = {
        version : '0.0.3'
    };

    // DEBUG
    // console.log('app run');
});
angular.module('todoApp', [
    'todoApp.Controllers',
    // 'todolist',
    'list.Decorators',
    'itemValidator'
])
.config(function() {
    'use strict';

    // DEBUG
    // console.log('app configured');
})
.run(function($rootScope) {
    'use strict';

    // add app version to the global scope
    $rootScope.app = {
        version : '0.0.5'
    };

    // DEBUG
    console.log('app run');
});
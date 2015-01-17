angular.module('todoApp', [
    'todoApp.Controllers',
    'todolist',
    'itemValidator'
])
.config(function() {
    console.log('app configured');
})
.run(function($rootScope) {

    // add app version to the "global" namespace
    $rootScope.app = {
        version : '0.0.2'
    };

    console.log('app run');
});
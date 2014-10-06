/**
 * a package for ALL the test services and directives
 * by DEFAULT the module should have only a single responsibility
 * sometimes it's better to have all the similar responsibilites
 * grouped under one module
 */
angular.module('test', [
    'test.Controllers',
    'test.Services',
    'test.Directives'    
]);
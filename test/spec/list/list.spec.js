/* global describe */
/* global beforeEach */
/* global inject */
/* global it */
describe('List module', function() {
    'use strict';

    var scope, compile, elem, cleanedHTML;

    // initialize the app
    beforeEach(module('todoApp'));

    // inject services
    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        compile = $compile;
    }));

    // setup test environment
    beforeEach(function() {
        elem = angular.element('<list items="items" removable-items></list>');

        scope.items = [
            {
                name: 'item1'
            },
            {
                name: 'item2',
                cssClass: 'someTestClass'
            }    
        ];

        // we are outside of angular context
        // no apply, no scope :)
        scope.$apply(function() {
            compile(elem)(scope);
        });

        // removes <!-- ngRepeat: item in items --> and similar $compile comments
        // TODO make it more reusable to not repeat it in every place when we need to test directives
        cleanedHTML = elem[0].outerHTML.replace(/<!--[^(-->)]+-->/g, '');
    });

    it('directive renders', function() {
        expect(cleanedHTML).toContain(
            '<ul class="list ng-scope ng-isolate-scope" items="items" removable-items="">' +
                '<li ng-repeat="item in items" ng-class="item.cssClass" class="listItem ng-scope">' +
                    '<span ng-transclude=""></span>' +
                    '<span class="itemText ng-binding">item1</span>' +
                    '<a href="#" ng-if="removableItems" ng-click="removeItem(item)" class="itemRemoveButton ng-scope"> [x] </a>' +
                '</li>' +
                '<li ng-repeat="item in items" ng-class="item.cssClass" class="listItem ng-scope someTestClass">' +
                    '<span ng-transclude=""></span>' +
                    '<span class="itemText ng-binding">item2</span>' +
                    '<a href="#" ng-if="removableItems" ng-click="removeItem(item)" class="itemRemoveButton ng-scope"> [x] </a>' +
                '</li>' +
            '</ul>'
        );
    });
});
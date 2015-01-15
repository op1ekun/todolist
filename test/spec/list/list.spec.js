describe('List module', function() {
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
                '<li ng-repeat="item in items" ng-class="item.cssClass" class="listItem ng-binding ng-scope" inject="">' +
                    '<span ng-transclude=""></span> item1 ' +
                    '<span ng-if="removableItems" ng-click="removeItem(item)" class="ng-scope"> [x] </span>' +
                '</li>' +
                '<li ng-repeat="item in items" ng-class="item.cssClass" class="listItem ng-binding ng-scope someTestClass" inject="">' +
                    '<span ng-transclude=""></span> item2 ' +
                    '<span ng-if="removableItems" ng-click="removeItem(item)" class="ng-scope"> [x] </span>' +
                '</li>' +
            '</ul>'
        );
    });
});
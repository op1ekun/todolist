describe('TODO List module', function() {
    'use strict';

    var scope, compile, elem, cleanedHTML;

    // all kudos to Dsyko
    // http://stackoverflow.com/questions/16802795/click-not-working-in-mocha-phantomjs-on-certain-elements#answer-16803781
    var clickElement = function (elem) {
        var ev = document.createEvent('MouseEvent');
        ev.initMouseEvent(
          'click',
          true /* bubble */, true /* cancelable */,
          window, null,
          0, 0, 0, 0, /* coordinates */
          false, false, false, false, /* modifier keys */
          0 /*left*/, null
        );

        elem.dispatchEvent(ev);
    };

    // initialize the app
    beforeEach(module('todoApp'));

    // inject services
    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        compile = $compile;
    }));

    // setup test environment
    beforeEach(function() {
        // I'm not sure about unit testing dependency 
        elem = angular.element('<todolist items="todo.items"></todolist>');

        scope.todo = {
            items : [
                {
                    name: 'item1'
                },
                {
                    name: 'item2'
                }    
            ]
        };

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
            '<div class="todolist ng-scope ng-isolate-scope" items="todo.items">' +
                '<strong>Show: </strong>' +
                '<ul>' +
                    '<li>' + 
                        '<a href="">ACTIVE</a>' + 
                    '</li>' +
                    '<li>' +
                        '<a href="">DONE</a>' +
                    '</li>' +
                    '<li>' + 
                        '<a href="">ALL</a>' +
                    '</li>' +
                '</ul>' +
                '<ul class="list ng-isolate-scope" items="items" removable-items="">' +
                    '<li ng-repeat="item in items" ng-class="item.cssClass" class="listItem ng-binding ng-scope" inject="">' +
                        '<a href="" ng-click="$parent.$parent.$parent.markAsDone(item)" class="itemDoneButton ng-scope">DONE</a>' +
                        '<span ng-transclude=""></span>' + 
                        ' item1 ' + 
                        '<a href="#" ng-if="removableItems" ng-click="removeItem(item)" class="itemRemoveButton ng-scope"> [x] </a>' +
                    '</li>' +
                    '<li ng-repeat="item in items" ng-class="item.cssClass" class="listItem ng-binding ng-scope" inject="">' +
                        '<a href="" ng-click="$parent.$parent.$parent.markAsDone(item)" class="itemDoneButton ng-scope">DONE</a>' +
                        '<span ng-transclude=""></span>' + 
                        ' item2 ' +
                        '<a href="#" ng-if="removableItems" ng-click="removeItem(item)" class="itemRemoveButton ng-scope"> [x] </a>' +
                    '</li>' + 
                '</ul>' + 
            '</div>');
    });

    // FIXME
    it('marks element as DONE', function() {
        var listItems = elem[0].querySelectorAll('.listItem .itemDoneButton');

        clickElement(listItems[0]);
        clickElement(listItems[1]);

        expect(scope.todo.items[0].done).toBeTruthy();
        expect(scope.todo.items[1].done).toBeTruthy();
    });
});
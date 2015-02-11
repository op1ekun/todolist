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
                    name: 'item1',
                    done: true,
                    // this once is passed down to list directive
                    // so it's completely abstracted from the DONE behavior
                    cssClass: 'done'
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
                        '<a href="#active" ng-click="filterBy(\'active\')" class="filterBy">ACTIVE</a>' + 
                    '</li>' +
                    '<li>' +
                        '<a href="#done" ng-click="filterBy(\'done\')" class="filterBy">DONE</a>' +
                    '</li>' +
                    '<li>' + 
                        '<a href="#all" ng-click="filterBy(\'all\')" class="filterBy">ALL</a>' +
                    '</li>' +
                '</ul>' +
                '<ul class="list ng-isolate-scope" items="filteredItems" removable-items="">' +
                    '<li ng-repeat="item in items" ng-class="item.cssClass" class="listItem ng-scope done" inject="">' +
                        '<a href="" ng-click="$parent.$parent.$parent.markAsDone(item)" class="itemDoneButton ng-scope">DONE</a>' +
                        '<span ng-transclude=""></span>' + 
                        '<span class="itemText ng-binding">item1</span>' +
                        '<a href="#" ng-if="removableItems" ng-click="removeItem(item)" class="itemRemoveButton ng-scope"> [x] </a>' +
                    '</li>' +
                    '<li ng-repeat="item in items" ng-class="item.cssClass" class="listItem ng-scope" inject="">' +
                        '<a href="" ng-click="$parent.$parent.$parent.markAsDone(item)" class="itemDoneButton ng-scope">DONE</a>' +
                        '<span ng-transclude=""></span>' + 
                        '<span class="itemText ng-binding">item2</span>' +
                        '<a href="#" ng-if="removableItems" ng-click="removeItem(item)" class="itemRemoveButton ng-scope"> [x] </a>' +
                    '</li>' + 
                '</ul>' + 
            '</div>');
    });

    it('marks element as DONE', function() {
        var listItems = elem[0].querySelectorAll('.listItem .itemDoneButton');

        clickElement(listItems[0]);
        clickElement(listItems[1]);

        expect(scope.todo.items[0].done).toBeTruthy();
        expect(scope.todo.items[1].done).toBeTruthy();
    });

    it('filters list by ACTIVE items', function() {
        var filters = elem[0].querySelectorAll('.filterBy'),
            items;

        clickElement(filters[0]);

        items = elem[0].querySelectorAll('.listItem');

        expect(items.length).toEqual(1);
        expect(items[0].querySelector('.itemText').innerHTML).toContain('item2');
    });

    it('filters list by DONE items', function() {
        var filters = elem[0].querySelectorAll('.filterBy'),
            items;

        clickElement(filters[1]);

        items = elem[0].querySelectorAll('.listItem');

        expect(items.length).toEqual(1);
        expect(items[0].querySelector('.itemText').innerHTML).toContain('item1');
    });

    it('it show all items', function() {
        var filters = elem[0].querySelectorAll('.filterBy'),
            items;

        clickElement(filters[2]);

        items = elem[0].querySelectorAll('.listItem');
        
        expect(items.length).toEqual(2);
    });
});
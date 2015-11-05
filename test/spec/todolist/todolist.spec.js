describe('TODO List module', function() {
    'use strict';

    var scope, compile, elem, cleanedHTML, filters;

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
    beforeEach(module('todolist.Directives'));

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
                },
                {
                    name: 'item3'
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

        filters = elem[0].querySelectorAll('.filterBy');
    });
        
    it('directive renders', function() {
        expect(cleanedHTML).toContain(
            '<div class="todolist ng-scope ng-isolate-scope" items="todo.items">' +
                '<strong>Show: </strong>' +
                '<ul>' +
                    '<li>' + 
                        '<a href="#active" ng-click="filterBy(filters.ACTIVE.name)" ng-class="filters.ACTIVE.selected" class="filterBy">ACTIVE</a>' + 
                    '</li>' +
                    '<li>' +
                        '<a href="#done" ng-click="filterBy(filters.DONE.name)" ng-class="filters.DONE.selected" class="filterBy">DONE</a>' +
                    '</li>' +
                    '<li>' + 
                        '<a href="#all" ng-click="filterBy(filters.ALL.name)" ng-class="filters.ALL.selected" class="filterBy selected">ALL</a>' +
                    '</li>' +
                '</ul>' +
                '<ul class="list ng-isolate-scope" items="filteredItems" removable-items="">' +
                    '<li ng-repeat="item in items" ng-class="item.cssClass" class="listItem ng-scope done">' +
                        '<span ng-transclude="">' +
                            '<a href="" ng-click="markAsDone($parent.item)" class="itemDoneButton ng-scope">DONE</a>' +
                        '</span>' + 
                        '<span class="itemText ng-binding">item1</span>' +
                        '<a href="#" ng-if="removableItems" ng-click="removeItem(item)" class="itemRemoveButton ng-scope"> [x] </a>' +
                    '</li>' +
                    '<li ng-repeat="item in items" ng-class="item.cssClass" class="listItem ng-scope">' +
                        '<span ng-transclude="">' +
                            '<a href="" ng-click="markAsDone($parent.item)" class="itemDoneButton ng-scope">DONE</a>' +
                        '</span>' + 
                        '<span class="itemText ng-binding">item2</span>' +
                        '<a href="#" ng-if="removableItems" ng-click="removeItem(item)" class="itemRemoveButton ng-scope"> [x] </a>' +
                    '</li>' + 
                    '<li ng-repeat="item in items" ng-class="item.cssClass" class="listItem ng-scope">' +
                        '<span ng-transclude="">' +
                            '<a href="" ng-click="markAsDone($parent.item)" class="itemDoneButton ng-scope">DONE</a>' +
                        '</span>' + 
                        '<span class="itemText ng-binding">item3</span>' +
                        '<a href="#" ng-if="removableItems" ng-click="removeItem(item)" class="itemRemoveButton ng-scope"> [x] </a>' +
                    '</li>' + 
                '</ul>' + 
            '</div>');
    });

    it('marks element as DONE', function() {
        var listItems = elem[0].querySelectorAll('.listItem .itemDoneButton');

        clickElement(listItems[1]);
        clickElement(listItems[2]);

        expect(scope.todo.items[1].done).toBeTruthy();
        expect(scope.todo.items[2].done).toBeTruthy();
    });

    it('filters list by ACTIVE items', function() {
        var items;

        // ACTIVE filter
        clickElement(filters[0]);
        expect(filters[0].className).toContain('selected');

        items = elem[0].querySelectorAll('.listItem');

        expect(items.length).toEqual(2);
        expect(items[0].querySelector('.itemText').innerHTML).toContain('item2');
        expect(items[1].querySelector('.itemText').innerHTML).toContain('item3');
    });

    it('filters list by DONE items', function() {
        var items;

        // DONE filter
        clickElement(filters[1]);
        expect(filters[1].className).toContain('selected');

        items = elem[0].querySelectorAll('.listItem');

        expect(items.length).toEqual(1);
        expect(items[0].querySelector('.itemText').innerHTML).toContain('item1');
    });

    it('it show all items', function() {
        var items;

        // ALL "filter"
        clickElement(filters[2]);
        expect(filters[2].className).toContain('selected');

        items = elem[0].querySelectorAll('.listItem');
        
        expect(items.length).toEqual(3);
    });

    // FIXME not totally happy about this step description
    // @issue9
    it('deletes an item from filtered view, the element is reflected in the main items collection', function() {
        var items;

        // DONE filter
        clickElement(filters[1]);
        expect(filters[1].className).toContain('selected');

        items = elem[0].querySelectorAll('.listItem');
        clickElement(items[0].querySelector('.itemRemoveButton'));

        items = elem[0].querySelectorAll('.listItem');
        expect(items.length).toEqual(0);

        // ALL "filter"
        clickElement(filters[2]);        

        items = elem[0].querySelectorAll('.listItem');
        expect(items.length).toEqual(2);
    });
});
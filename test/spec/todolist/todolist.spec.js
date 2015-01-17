describe('TODO List module', function() {
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
                        '<span ng-if="removableItems" ng-click="removeItem(item)" class="ng-scope"> [x] </span>' +
                    '</li>' +
                    '<li ng-repeat="item in items" ng-class="item.cssClass" class="listItem ng-binding ng-scope" inject="">' +
                        '<a href="" ng-click="$parent.$parent.$parent.markAsDone(item)" class="itemDoneButton ng-scope">DONE</a>' +
                        '<span ng-transclude=""></span>' + 
                        ' item2 ' +
                        '<span ng-if="removableItems" ng-click="removeItem(item)" class="ng-scope"> [x] </span>' +
                    '</li>' + 
                '</ul>' + 
            '</div>');
    });

    // FIXME
    // it('marks element as DONE', function() {
    //     var listItems = elem[0].querySelectorAll('.listItem .itemDoneButton');

    //     console.log('listItems', listItems, listItems[0]);

    //     listItems[0].click();
    //     listItems[1].click();

    //     expect(scope.todo.items[0].done).toBeTruthy();
    //     expect(scope.todo.items[1].done).toBeTruthy();
    // });
});
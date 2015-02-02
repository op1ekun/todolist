angular.module('todolist.Directives', [
    // should the whole list module be used here
    // or is directive enough? 
    'list.Directives'
])
.directive('todolist', function todolistDirective() {
    'use strict';

    function todolistController($scope) {

        $scope.markAsDone = function(item) {
            var index = $scope.items.indexOf(item);
            $scope.items[index].done = true;
            $scope.items[index].cssClass = 'done';
        };
    }

    return {
        scope: {
            items: '='
        },
        restrict: 'E',           
        replace: true,
        template:   '<div class="todolist">' + 
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
                        '<list items="items" removable-items>' +
                            // a very nasty way of getting the to markAsDone method from isolated scope ;)
                            '<a href="" ng-click="$parent.$parent.$parent.markAsDone(item)" class="itemDoneButton">DONE</a>' +
                        '</list>' + 
                    '</div>',
        controller: todolistController
    };
});
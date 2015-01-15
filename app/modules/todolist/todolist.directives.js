angular.module('todolist.Directives', [
    // should the whole list module be used here
    // or is directive enough? 
    'list.Directives'
])
.directive('todolist', function todolistDirective() {
    'use strict';

    function todolistController($scope) {

        $scope.markAsDone = function(item) {
            console.log('todolist args', arguments);
            // var index = $scope.items.indexOf(item);
            // $scope.items[index].done = true;
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
                            '<a href="" ng-click="markAsDone(item)" class="itemDoneButton">DONE</a>' +
                        '</list>' + 
                    '</div>',
        controller: todolistController
    };
});
angular.module('todolist.Directives', [
    // should the whole list module be used here
    // or is directive enough?
    'list.Directives'
])
.directive('todolist', function todolistDirective() {
    'use strict';

    function todolistController($scope) {

        $scope.activeFilter = 'all';
        $scope.filteredItems = $scope.items;

        $scope.markAsDone = function(item) {
            var index = $scope.items.indexOf(item);
            $scope.items[index].done = true;
            $scope.items[index].cssClass = 'done';
        };

        $scope.filterBy = function(filterName) {
            var filteredItems = [];

            // FIXME it's not optimized
            $scope.items.forEach(function(item) {

                switch(filterName) {
                    case 'active':
                        if (!item.done) {
                            filteredItems.push(item);
                        }
                    break;

                    case 'done':
                        if (item.done) {
                            filteredItems.push(item);
                        }
                    break;

                    default:
                        filteredItems.push(item);
                    break;
                }
            });
        
            $scope.filteredItems = filteredItems;
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
                                '<a href="#active" ng-click="filterBy(\'active\')" class="filterBy">ACTIVE</a>' + 
                            '</li>' +
                            '<li>' + 
                                '<a href="#done" ng-click="filterBy(\'done\')" class="filterBy">DONE</a>' + 
                            '</li>' +
                            '<li>' +
                                '<a href="#all" ng-click="filterBy(\'all\')" class="filterBy">ALL</a>' +
                            '</li>' +
                        '</ul>' +
                        '<list items="filteredItems" removable-items>' +
                            // a very nasty way of getting the to markAsDone method from isolated scope ;)
                            '<a href="" ng-click="$parent.$parent.$parent.markAsDone(item)" class="itemDoneButton">DONE</a>' +
                        '</list>' + 
                    '</div>',
        controller: todolistController
    };
});
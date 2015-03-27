angular.module('todolist.Directives', [
    // should the whole list module be used here
    // or is directive enough?
    'list.Directives'
])
.directive('todolist', function todolistDirective() {
    'use strict';

    function todolistController($scope) {

        var lastFilter;

        $scope.activeFilter = lastFilter = 'all';
        $scope.filteredItems = $scope.items;

        /**
         * Calculates the app state based on last and active filter.
         * Abstracts the state calculation and management from the consumer.
         * 
         * @return {Boolean}    the state value
         */
        function isFiltering() {
            // calculate the state
            var state = (lastFilter !== $scope.activeFilter);
            // reset the last filter before the next use
            lastFilter = $scope.activeFilter;
            // return calculated state
            return state;
        }

        $scope.markAsDone = function(item) {
            var index = $scope.items.indexOf(item);
            $scope.items[index].done = true;
            $scope.items[index].cssClass = 'done';
        };

        $scope.filterBy = function(filterName) {
            lastFilter = filterName;

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

        $scope.$watchCollection('filteredItems', function(newItems, oldItems, scope) {
            var filtering = isFiltering();

            if (filtering) {
                return;
            }

            oldItems.some(function(oldItem) {
                var toBeRemovedIndex;

                // find if an old item is missing from new items
                if (newItems.indexOf(oldItem) == -1) {
                    // if it does, 
                    // try find it in the main items collection
                    toBeRemovedIndex = $scope.items.indexOf(oldItem);

                    // remove the item from the main collection
                    if (toBeRemovedIndex > -1) {
                        $scope.items.splice(toBeRemovedIndex, 1);
                        return;
                    }
                }
            });
        });
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
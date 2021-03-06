angular.module('todolist.Directives', [
    // should the whole list module be used here
    // or is directive enough?
    'list.Directives'
])
.directive('todolist', function todolistDirective() {
    'use strict';

    function todolistController($scope) {

        var activeFilter, prevFilter;

        // supported filters
        $scope.filters = {
            ACTIVE: {
                name: 'active'
            },
            DONE: {
                name: 'done'
            },
            ALL: {
                name: 'all',
                selected: 'selected'
            }
        };

        // default filter
        activeFilter = prevFilter = $scope.filters.ALL.name;
        $scope.filteredItems = $scope.items;

        /**
         * Calculates the app state based on last and active filter.
         * Abstracts the state calculation and management from the consumer.
         * 
         * @return {Boolean}    the state value
         */
        function isFiltering() {
            // calculate the state
            var state = (activeFilter !== prevFilter);
            // reset flag
            prevFilter = activeFilter;
            // return calculated state
            return state;
        }

        $scope.markAsDone = function(item) {
            var index = $scope.items.indexOf(item);
            $scope.items[index].done = true;
            $scope.items[index].cssClass = 'done';
        };

        $scope.filterBy = function(filterName) {

            // setup filters states
            if (activeFilter !== filterName) {
                $scope.filters[activeFilter.toUpperCase()].selected = '';
                prevFilter = activeFilter;
                activeFilter = filterName;
                $scope.filters[activeFilter.toUpperCase()].selected = 'selected';
            }

            $scope.filteredItems = $scope.items.filter(function(item) {

                switch(filterName) {

                    case $scope.filters.ACTIVE.name:
                        if (!item.done) {
                            return item;
                        }
                    break;

                    case $scope.filters.DONE.name:
                        if (item.done) {
                            return item;
                        }
                    break;

                    default:
                        return item;
                }
            });

        };

        // a newly added item, activate filter in case it's not set to ALL
        $scope.$watchCollection('items', function(newItems, oldItems, scope) {
            if (activeFilter !== $scope.filters.ALL.name) {
                $scope.filterBy(activeFilter);
            }
        });

        // synchronizes with the scope.items list whenever an item is removed
        $scope.$watchCollection('filteredItems', function(newItems, oldItems, scope) {
            // no need to sync if items are being filtered
            if (isFiltering()) {
                return;
            }

            oldItems.some(function(oldItem) {
                var toBeRemovedIndex;

                // find if an old item is missing from new items
                if (newItems.indexOf(oldItem) === -1) {
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
                                '<a href="#active" ng-click="filterBy(filters.ACTIVE.name)" ng-class="filters.ACTIVE.selected" class="filterBy">ACTIVE</a>' + 
                            '</li>' +
                            '<li>' + 
                                '<a href="#done" ng-click="filterBy(filters.DONE.name)" ng-class="filters.DONE.selected" class="filterBy">DONE</a>' + 
                            '</li>' +
                            '<li>' +
                                '<a href="#all" ng-click="filterBy(filters.ALL.name)" ng-class="filters.ALL.selected" class="filterBy">ALL</a>' +
                            '</li>' +
                        '</ul>' +
                        '<list items="filteredItems" removable-items>' +
                            // markAsDone uses transcluded scope which in this case is the todolist scope
                            // $parent.item will refer to ng-repeat scope
                            '<a href="" ng-click="markAsDone($parent.item)" class="itemDoneButton">DONE</a>' +
                        '</list>' + 
                    '</div>',
        controller: todolistController
    };
});
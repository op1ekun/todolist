angular.module('list.Decorators', [
    'list.Directives'
])
.config(function getProvider($provide) {

    $provide.decorator('listDirective', function getDelegate($delegate) {
        console.log('decorating list');

        var origDirective = $delegate[0];
        var origTemplate = origDirective.template;
        var origController = origDirective.controller;
        var origCompile = origDirective.compile;

        origDirective.controller = function($scope) {
            var activeFilter, prevFilter;
            
            origController.apply(this, arguments);

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

            // watches items and reacts to an item being removed from the current view
            // synchronizing items with the scope.items list
            $scope.$watchCollection('filteredItems', function synchronizeItems(newItems, oldItems, scope) {
                // no need to sync if items are being filtered;
                if (isFiltering()) {
                    return;
                }

                // the changes occured in the same filtered list of items
                // basically check if there were more items in the list than previously
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
        };

        // explicitly annotate dependency
        origDirective.controller.$inject = ['$scope'];

        origDirective.template = 
            '<div class="todolist">' + 
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
                // no need for transclude, 
                // just replace it with the addtional HTML required by todolist
                origTemplate
                    .replace('<span ng-transclude></span>', '<a href="" ng-click="markAsDone(item)" class="itemDoneButton">DONE</a>')
                    // auxilary list of filtered items is necessary to be able to have a separate watcher
                    .replace('ng-repeat="item in items"', 'ng-repeat="item in filteredItems"') + 
            '</div>';

        return $delegate;
    });
});
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

                // remember the whole list
                $scope.allItems = $scope.items;

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

                    var filteredItems = $scope.allItems.filter(function(item) {

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

                    $scope.items = filteredItems;
                };
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
                origTemplate.replace('<span ng-transclude></span>', '<a href="" ng-click="markAsDone(item)" class="itemDoneButton">DONE</a>') + 
            '</div>';

        return $delegate;
    });
});
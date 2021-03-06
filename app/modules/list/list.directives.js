angular.module('list.Directives', [
    // 'notification.Services'
])
.directive('list', function listDirective() {
    'use strict';

    function linker($scope, $elem, $attrs) {
        // DEBUG
        // $scope.$watchCollection('items', function() {
        //     console.log('items changed', $scope.items);
        // });

        if ('removableItems' in $attrs) {
            $scope.removableItems = true;
        }
    }

    function listController($scope) {
        $scope.removeItem = function(item) {
            var index = $scope.items.indexOf(item);
            $scope.items.splice(index, 1);
        };     
    }

    return {
        scope: {
            items: '='
        },
        restrict: 'E',           
        replace: true,
        transclude: true,
        template:   '<ul class="list">' + 
                        '<li ng-repeat="item in items" ng-class="item.cssClass" class="listItem">' +
                            // replaced by a custom element
                            '<span ng-transclude></span>' +
                            // FIXME change span to ahref 
                            '<span class="itemText">{{item.name}}</span>' +
                            '<a href="#" ng-if="removableItems" ng-click="removeItem(item)" class="itemRemoveButton"> [x] </a>' +
                        '</li>' +
                    '</ul>',
        controller: listController,
        link: linker
    };
});
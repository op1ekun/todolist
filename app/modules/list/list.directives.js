angular.module('list.Directives', [
    'notification.Services'
])
.directive('list', function listDirective() {

    function linker($scope, elem, attrs) {
        console.log('attributes', attrs);

        $scope.$watchCollection('items', function() {
            console.log('items changed');
        });

        if ('removableItems' in attrs) {
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
        template: '<ul class="list"><li ng-repeat="item in items"></span> {{item}} <span ng-if="removableItems" ng-click="removeItem(item)"> [x] </span></li></ul>',
        controller: listController,
        link: linker
    };
});
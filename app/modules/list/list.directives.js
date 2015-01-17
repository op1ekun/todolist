angular.module('list.Directives', [
    'notification.Services'
])
.directive('list', function listDirective() {
    'use strict';

    function linker($scope, $elem, $attrs) {
        $scope.$watchCollection('items', function() {
            console.log('items changed');
        });

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
                        '<li ng-repeat="item in items" ng-class="item.cssClass" class="listItem" inject>' +
                            // replaced by a custom element
                            '<span ng-transclude></span>' +
                            // FIXME change span to ahref 
                            ' {{item.name}} <span ng-if="removableItems" ng-click="removeItem(item)"> [x] </span>' +
                        '</li>' +
                    '</ul>',
        controller: listController,
        link: linker
    };
})
// FIXME id adds another DONE at the end of the item
.directive('inject', function(){
    'use strcit';

    return {
        link: function($scope, $element, $attrs, controller, $transclude) {
            var innerScope = $scope.$new();
            
            $transclude(innerScope, function(clone) {
                console.log($element);

                // $element.empty();
                var ahref = $element.find('a');
                ahref.remove();

                $element.prepend(clone);
                $element.on('$destroy', function() {
                    innerScope.$destroy();
                });
            });
        }
    };
})
angular.module('itemValidator.Directives', [
])
.directive('duplicate', function duplicateDirective() {

    function linker($scope, $elem, $attrs, $controller) {

        $controller.$parsers.unshift(function(viewValue) {

            for (var i = 0, l = $scope.items.length; i < l; i++) {
                if ($scope.items[i].name === viewValue) {
                    $controller.$setValidity('duplicate', false);
                    break;
                } else {
                    $controller.$setValidity('duplicate', true);
                }
            }

            return viewValue;
        });
    }

    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            items: '='
        },
        link: linker
    };
});
// TODO add empty directive to indicate that you can't add an empty item
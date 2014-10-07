angular.module('itemValidator.Directives', [])
    .directive('duplicate', function duplicateDirective() {

        function linker($scope, elem, attrs, $controller) {

            $controller.$parsers.unshift(function(viewValue) {
                if ($scope.items.indexOf(viewValue) === -1) {
                    $controller.$setValidity('duplicate', true);
                } else {
                    $controller.$setValidity('duplicate', false);
                }

                return viewValue;
            });
        }

        return {
            require: 'ngModel',
            scope: {
                items: '='
            },
            link: linker
        };
    });
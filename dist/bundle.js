angular.module('itemValidator.Directives', [
])
.directive('duplicate', function duplicateDirective() {
    'use strict';

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
// TODO add empty directive to indicate that you can't add an empty item;
angular.module('itemValidator', [
        'itemValidator.Directives'
    ]);;
angular.module('list.Directives', [
    'notification.Services'
])
.directive('list', function listDirective() {
    'use strict';

    function linker($scope, $elem, $attrs) {
        $scope.$watchCollection('items', function() {
            console.log('items changed', $scope.items);
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
    listController.$inject = ['$scope'];

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
                            '<span class="itemText">{{item.name}}</span>' +
                            '<a href="#" ng-if="removableItems" ng-click="removeItem(item)" class="itemRemoveButton"> [x] </a>' +
                        '</li>' +
                    '</ul>',
        controller: listController,
        link: linker
    };
})
// FIXME id adds another DONE at the end of the item
.directive('inject', function(){
    'use strict';

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
});
angular.module('list', [
    'list.Directives'
]);;
angular.module('notification', [
    'notification.Services'
]);;
angular.module('notification.Services', [])
    .factory('notification', function notificationFactory() {

        function create() {

        }

        return {
            create: create
        };
    });;
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
    todolistController.$inject = ['$scope'];

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
});;
angular.module('todolist', [
	'todolist.Directives'	
]);;
angular.module('todoApp.Controllers', [
    'notification'
])
.controller('TodoAppController', ['$scope', 'notification', function TodoAppController($scope, notification) {
    'use strict';

    console.log('TodoAppController');
    console.log('TodoAppController notification', notification);

    $scope.todo = {
        item: '',
        items: []
    };

    /**
     * add a single item to the items list
     * @param {AngularJS event} $event
     * 
     * @todo more sophisticated validation
     * @todo notification
      */
    $scope.todo.addItem = function($event) {
        if ($event.charCode === 13 &&
            !$scope.addItemForm.itemName.$error.duplicate &&
            $scope.todo.item !== '') {
            $scope.todo.items.push({ name: $scope.todo.item});
            $scope.todo.item = '';
        }
    };

    $scope.clock = {
        now: new Date()
    };

    var updateClock = function() {
        $scope.clock.now = new Date();
    };

    setInterval(function() {
        $scope.$apply(updateClock);
    }, 1000);
}]);;
angular.module('todoApp', [
    'todoApp.Controllers',
    'todolist',
    'itemValidator'
])
.config(function() {
    'use strict';

    console.log('app configured');
})
.run(['$rootScope', function($rootScope) {
    'use strict';

    // add app version to the "global" namespace
    $rootScope.app = {
        version : '0.0.3'
    };

    console.log('app run');
}]);
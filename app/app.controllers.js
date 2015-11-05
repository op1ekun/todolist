angular.module('todoApp.Controllers', [
    // 'notification'
])
.controller('TodoAppController', function TodoAppController($scope) {
    'use strict';

    // DEBUG
    // console.log('TodoAppController');;

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
});
angular.module('todoApp.Controllers', [
    'notification'
])
.controller('TodoAppController', function TodoAppController($scope, notification) {

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
     * @todo validation
     * @todo notification
      */
    $scope.todo.addItem = function($event) {
        if ($event.charCode === 13 &&
            $scope.todo.items.indexOf($scope.todo.item) === -1) {
            $scope.todo.items.push($scope.todo.item);
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
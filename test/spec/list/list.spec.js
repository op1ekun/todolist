describe('List module', function() {
    // Load the module with MainController
    beforeEach(module('todoApp'));

    var scope, compile;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function($rootScope, $compile) {
        // Create a new scope that's a child of the $rootScope
        scope = $rootScope.$new();
        compile = $compile;
    }));

    it('directive renders', function() {
        var elem = angular.element('<list class="todolist" items="todo.items" removable-items></list>');
        compile(elem)(scope);
        console.log(elem);

        expect(elem[0].outerHTML).toEqual('<ul class="todolist list ng-scope ng-isolate-scope" items="todo.items" removable-items=""><!-- ngRepeat: item in items --></ul>');
    });
});
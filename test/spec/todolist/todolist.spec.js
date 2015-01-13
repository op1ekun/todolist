describe('TODO List module', function() {
    beforeEach(module('todoApp'));

    var scope, compile;

    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        compile = $compile;
    }));

    it('directive renders', function() {
        // I'm not sure about unit testing dependency 
        var elem = angular.element('<todolist items="todo.items"></todolist>');
        compile(elem)(scope);

        expect(elem[0].outerHTML).toContain('<div class="todolist ng-scope ng-isolate-scope" items="todo.items"><ul><li><a href="">ACTIVE</a></li><li><a href="">FINISHED</a></li><li><a href="">ALL</a></li></ul><ul class="list ng-isolate-scope" items="items" removable-items=""><!-- ngRepeat: item in items --></ul></div>');
    });
});
angular.module('todolist.Decorators', [
    'list.Directives'
])
.config(function getProvider($provide) {

    $provide.decorator('listDirective', function getDelegate($delegate) {
        // var directive = $delegate[0];
        // var origTemplate = directive.template;

        // directive.template = 
        //     '<div class="todolist">' + 
        //         '<strong>Show: </strong>' + 
        //         '<ul>' + 
        //             '<li>' +
        //                 '<a href="#active" ng-click="filterBy(filters.ACTIVE.name)" ng-class="filters.ACTIVE.selected" class="filterBy">ACTIVE</a>' + 
        //             '</li>' +
        //             '<li>' + 
        //                 '<a href="#done" ng-click="filterBy(filters.DONE.name)" ng-class="filters.DONE.selected" class="filterBy">DONE</a>' + 
        //             '</li>' +
        //             '<li>' +
        //                 '<a href="#all" ng-click="filterBy(filters.ALL.name)" ng-class="filters.ALL.selected" class="filterBy">ALL</a>' +
        //             '</li>' +
        //         '</ul>' +
        //         origTemplate + 
        //     '</div>';

        return $delegate;
    });
});
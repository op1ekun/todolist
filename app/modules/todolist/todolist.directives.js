angular.module('todolist.Directives', [
	// should the whole list module be used here
	// or is directive enough? 
	'list.Directives'
])
.directive('todolist', function todolistDirective() {

	return {
        scope: {
            items: '='
        },
        restrict: 'E',           
        replace: true,
        template: '<div class="todolist"><ul><li><a href="">ACTIVE</a></li><li><a href="">FINISHED</a></li><li><a href="">ALL</a></li></ul><list items="items" removable-items></list></div>'
        // controller: listController,
        // link: linker	
	};
});
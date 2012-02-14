(function(Project){

	Project.Model = Backbone.Model.extend({
		url : function(){ return Zeega.url_prefix+"projects/"+this.id;},
	});

})(zeega.module("project"));

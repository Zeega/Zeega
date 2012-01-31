// Use an IIFE...
// (http://benalman.com/news/2010/11/immediately-invoked-function-expression/)
// to assign your module reference to a local variable, in this case Example.
//
// Change line 16 'Example' to the name of your module, and change line 38 to
// the lowercase version of your module name.  Then change the namespace
// for all the Models/Collections/Views/Routers to use your module name.
//
// For example: Renaming this to use the module name: Project
//
// Line 16: (function(Project) {
// Line 38: })(namespace.module("project"));
//
// Line 18: Project.Model = Backbone.Model.extend({
//
(function(Items) {

	Items.Model = Backbone.Model.extend({
		initialize : function(){}
	});
	
	Items.Collection = Backbone.Collection.extend({
		//model : Items.Model,
		
		base : 'http://dev.zeega.org/jda/web/api/search?',
		query : undefined,
		tags : undefined,
		type : undefined,
		
		url : function()
		{
			var url = this.base;
			if( !_.isUndefined(this.query) ) url += 'q=' + this.query;
			if( !_.isUndefined(this.tags) ) url += 'tags=' + this.tags;
			if( !_.isUndefined(this.type) ) url += 'type=' + this.type;
			return url;
		},
		
		parse : function(response)
		{
			return response.items;
		}
		
		
	});
	
	Items.Router = Backbone.Router.extend({ /* ... */ });



	// This will fetch the tutorial template and render it.
	Items.Views.List = Backbone.View.extend({
		template: "app/templates/example.html",

		render: function(done)
		{
			var view = this;

			// Fetch the template, render it to the View element and call done.
			namespace.fetchTemplate(this.template, function(tmpl)
			{
				view.el.innerHTML = tmpl();

				done(view.el);
			});
		}
	});



})(jda.module("items"));
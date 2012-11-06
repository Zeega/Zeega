

this.zeega = this.zeega ||{};
this.zeega.home = {
	// break up logical components of code into modules.
	module: function()
	{
		// Internal module cache.
		var modules = {};

		// Create a new module reference scaffold or load an existing module.
		return function(name)
		{
			// If this module has already been created, return it.
			if (modules[name]) return modules[name];

			// Create a module and save it under this name
			return modules[name] = { Views: {} };
		};
	}(),

  // Keep active application instances namespaced under an app object.
  app: _.extend({

	init : function()
	{
		this.loadProjects();
		
	},
	loadProjects:function(){
		var Home = zeega.home.module("home");
		
		
		var projects = new Home.Projects.Collection($.parseJSON(projectsJSON).items[0].child_items);
	
		

		_.each(projects.models,function(project){
			
			var view = new Home.Projects.View({model:project});
			$('#featured-zeegas').find('.valign-content').append(view.render().el);
		
		});

		_.each($('.zeega-section'),function(el){
			
			var projectCollection = new Home.Projects.Collection({id:$(el).data('id')});
			
			projectCollection.fetch({success:function(collection,response){
				$(el).find('h2').html(collection.title);
				_.each(projects.models,function(project){
					
					var view = new Home.Projects.View({model:project});
					$(el).find('.valign-content').append(view.render().el);
		
				});
			}});



		});

	}
	
	
		
	

	}, Backbone.Events)


};
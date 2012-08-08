this.zeegaDashboard = {
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
		var _this = this;
		
		/*
		var Dashboard = zeegaDashboard.module("dashboard");
		
		this.editable = false;

		
		var projects = new Dashboard.Project.Collection();
		var items =$.parseJSON(projectsJSON).items[0].child_items;
		
		_.each(items,function(item){
			console.log(item);
			var project = new Dashboard.Project.Model($.parseJSON(item.text).project);
			projects.add(project);
		});
		
		console.log(Dashboard);
		this.projectsView = new Dashboard.ProjectCollectionView({collection:projects}).render();
		*/
		
		
	},
	
	
		
	

	}, Backbone.Events)


};
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

		var Dashboard = zeegaDashboard.module("dashboard");
		
		var user = new Dashboard.Users.Model().fetch(
			{
				success : function(model, response){
					_this.profilePage = new Dashboard.Users.Views.ProfilePage({model:model}).render();
					
				},
				error : function(){
					console.log("Error getting user information for profile.");
				}
			}
		);
		
	},
	
	
		
	

	}, Backbone.Events)


};
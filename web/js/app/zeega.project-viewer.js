// This contains the module definition factory function, application state,
// events, and the router.
this.zeega = {
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
	
	//sequenceID : 1,
	currentFrame : null,
	previewMode:true,

	//this function is called once all the js files are sucessfully loaded
	init : function()
	{
		this.url_prefix = sessionStorage.getItem('hostname') + sessionStorage.getItem('directory');

		this.loadModules();
		this.isLoaded = true
		//this.initStartHelp(); //broken. fix!
	},
	
	loadModules : function()
	{
		console.log('load modules')
		
		this.data = $.parseJSON(projectJSON);
		console.log(this.data)
		
		this.player = new Player2(this.data)
		//$('body').append( this.player.render().el );
	}
	
	
}, Backbone.Events)


};

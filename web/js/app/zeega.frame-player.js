/*---------------------------------------------


	Object: FramePlayer
	The Zeega project web player. Part of Core.


---------------------------------------------*/

var FramePlayer = {
	
	/*
		Method: init
		Initializes the player object
		
		Parameters:
			
			data - A Zeega data object in JSON.
			sequence - The sequence index of the starting frame.
			frameID - The id of the starting frame.
	
	*/
	init : function( data )
	{

		//this.parseProject;
		this.drawFrame(data);

	},
	
	/*
		Method: drawFrame
		Places a completely preloaded frame into view. Also manages the state of the navigation arrows.
		
		Parameters:
			
			frameID - The id of the frame to be drawn.
	*/
	drawFrame : function( data )
	{
		_.each( data, function( layer ){
			if(layer.type=='Youtube'||layer.type=='Video' || layer.type == 'image') layerClass = new ImageLayer();
			else eval( 'var layerClass = new '+ layer.type +'Layer();' );
			layerClass.lightLoad( layer )

			$('#zeega-player').append( layerClass.thumbnail );
		});
	}
}

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
	
	//this function is called once all the js files are sucessfully loaded
	init : function()
	{
		this.url_prefix = sessionStorage.getItem('hostname') + sessionStorage.getItem('directory');

		this.loadModules();
	},
	
	loadModules : function()
	{
		var _this = this;
		var Project = zeega.module("project");
		var Items = zeega.module("items");
		
		console.log($.parseJSON(projectJSON))
		console.log( $.parseJSON(collectionsJSON))
		console.log( '#ffffff'.toRGB() )
		this.loadCollectionsDropdown( $.parseJSON(collectionsJSON) );
		
		this.project = new Project.Model($.parseJSON(projectJSON).project);
		
		this.project.on('ready',function(){ _this.startEditor() })
		this.project.loadProject();
		this.itemCollection = new Items.ViewCollection();
	},

	
	
	
}, Backbone.Events)


};

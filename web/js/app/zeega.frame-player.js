/*---------------------------------------------


	Object: FramePlayer
	The Zeega project web player. Part of Core.


---------------------------------------------*/

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

		this.frameData = $.parseJSON(frameJSON) || {};
		
		var layerArray = this.getLayerModelArray( $.parseJSON(layersJSON) )
		this.layerCollection = new Backbone.Collection( layerArray );
		
		this.drawFrame();
	},
	
	getLayerModelArray : function( layers )
	{
		var Layer = zeega.module('layer');
		var layerArray = [];
		_.each( layers, function(layer){
			layerArray.push( new Layer[layer.type](layer, {player:true}) )
		})
		return layerArray;
	},
	
	drawFrame : function()
	{
		var _this = this;
		_.each( this.frameData.layers, function( layerID ){
			_this.drawLayer( layerID );
		})
	},
	
	drawLayer : function( layerID )
	{
		console.log( this.layerCollection.get( layerID ) )
		var layer = this.layerCollection.get( layerID );
		$('#zeega-player').append( layer.visual.render().el );
		layer.trigger('player_preload');
		layer.trigger('player_play')
	}




}, Backbone.Events)


};
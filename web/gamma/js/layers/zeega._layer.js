/************************

	_zeega._layer.js
	
	PROTO-LAYER
	
	Version 2.0
	
*************************/



/******************************************

///////////////////////////////////////////

	LAYERS.JS NOTES
	
	
	
	Layers provide modular node-level features
	for the Zeega editor/publisher.
	
	Location/Naming protocol:
		
		layers/zeega.examplelayer.js - layer object
		css/layers/zeega.examplelayer.css - layer css [optional]
		css/layers/icons/zeega.examplelayer.icon.png -layer icon [optional]
	
	Layers must be called in main.js to be used in the application.js
	
	
	
	TODO:
	
		>>Implement icons in workspace
		>>Develop structure for allowing input on Create New
		>>Develop structure for publishing node
	
	

///////////////////////////////////////////

******************************************/


/**	LAYER PARENT CLASS	**/

var ProtoLayer = Class.extend({


	/** EXTENDABLE LAYER FUNCTIONS **/
	
	init : function()
	{

	},
	

	drawControls : function()
	{

	},

	onControlsOpen : function()
	{

	},

	onControlsClose : function()
	{

	},

	drawToVisualEditor : function()
	{
		
	},
	
	onAttributeUpdate : function()
	{

	},

	onExit : function()
	{

	},

	////////// player
		
	preload : function()
	{
		$('#zeega-player').trigger('ready',{'id':this.parent.model.id});
	},
	
	play : function()
	{
		
	},
	
	pause : function()
	{
		
	},
	
	stash : function()
	{
		
	},
	
	playUnsupported : function()
	{
		
	},
	
	onExit : function()
	{

	},
	

	// utlities
		
	load : function( model )
	{
		this.model = model;
		
		var def = _.defaults( this.model.get('attr') , deepCopy( this.defaultAttributes ) );
		this.model.set({attr:def})

		this.type = model.get('type');
	},
	
	setZIndex : function(z)
	{
		this.visualEditorElement.css( 'z-index', z );
	},
	
	onStateChange : function()
	{
		
	},
	
	onError : function()
	{
		
	},
	
	setText : function( newText )
	{
		this.model.set({ 'text' : newText });
	},
	
	setAttributes : function( newAttr )
	{
		
		var attr = this.model.get('attr');
		var n = _.extend( attr, newAttr );
		
		console.log(n)
		
		this.model.set( n );
		
	},
	
	save : function()
	{
		//kept separate from updateLayerAttr because there are reasons to set but not save yet
		console.log('save()');
		Zeega.currentNode.noteChange();
		this.model.save(); //saves the current model
	}
	

});


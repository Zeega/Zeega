/************************

	LAYERS.JS
	
	LAYERS PLUGIN
	
	Version 0.1
	
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
	
	
	
	drawControls : function()
	{
		//draws the specific layer control items inside the sidebar
	},
	
	openControls: function()
	{
		//called when layer controls are expanded and editing template exposed
	},
	
	closeControls: function()
	{
		//called when layer controls are minimized and editing template closes
	},
	
	drawPreview : function()
	{
		//Load icon into icon drawer above workspace
		
		if(this.icon){
			//Need to add icon drawer and set to empty on node unload
			//$('#workspace-icon-drawer').append($('<img>').attr('src','css/layers/icons/zeega.'+this.type.'+.icon.png');
		}
	
		//draw layer contents in workspace - called on layer view display
	},
	
	updateZIndex : function(z)
	{
		this.dom.css({'z-index':z});
	},
	
	drawPublish : function()
	{
		//draw layer contents in published node space
	},
	
	hidePublish : function()
	{
		
	},
	
	preloadMedia : function()
	{
		//preLoad layer contents
		
		$('#zeega-player').trigger('ready',{'id':this.model.id});
	},
	
	updateAttr: function()
	{
		//update local layer attributes
	},

	exit: function()
	{
		//called on exit during playback
	},



	/** 
	
		CORE LAYER FUNCTIONS 
	
		SHOULD NOT BE EXTENDED
	
	
	**/




	//init with a layer model
	
	interaction : false,
	
	init : function()
	{
		this.icon=false;
	},
	
	// Populate layer attributes from layer model attributes, using
	// default values to fill in absent values
	
	load : function(model)
	{
		//test to see if it's a model or just a layer data object
		if(model.attributes)
		{
			this.model = model;
		
			this.attr = model.get('attr');
		
			var defaults = deepCopy(this.defaultAttributes );
			this.attr = _.defaults(this.attr, defaults);
		
			this.model.set({ attr:this.attr })
			this.title = this.attr.title;
		
			this.type = model.get('type');
		
			this.zIndex = model.get('zindex');
		}else{
			//make it possible to load objects and not models.
			this.model = model;
			this.attr = model.attr;
		
			var defaults = deepCopy(this.defaultAttributes );

			this.attr = _.defaults(this.attr, defaults);
			this.model.attr = this.attr;
			this.title = this.attr.title;
			this.type = model.type;
			this.zIndex = model.zindex;
		}

	},
	
	
	//Activate layer icon for display in workspace icon drawer
	
	setIcon : function()
	{
		this.icon=true;
	},
	getModel : function()
	{
		return this.model
	},
	setModel : function(model)
	{
		this.model = model;
		return this;
	},
	getTitle : function()
	{
		return this.model;
	},
	setTitle : function(title)
	{
		this.title = title;
		return this;
	},	
	
	//updates the layer order accordingly
	updateZIndex : function(zIndex)
	{
		this.dom.css( 'z-index', zIndex );
	},
	
	updateLayerAttr : function(newAttr)
	{
		this.model.set({ 'attr' : newAttr });
	},

	updateLayerText : function(newText)
	{
		this.model.set({ 'text' : newText });
	},

	saveLayer : function()
	{
		//kept separate from updateLayerAttr because there may be reasons to set but not save yet
		console.log('save()');
		Zeega.currentNode.noteChange();
		this.model.save(); //saves the current model
	},

	remove : function()
	{
		this.dom.remove();
	},

	addToWorkspace : function(dom)
	{

		var pDom = dom.clone();
		//var wDom = obj.dom.clone();
		//pDom.draggable({ stop : function(){ obj.updateAttr(); } });
		//wDom.draggable({ stop : function(){ obj.updateAttr(); } });

		$('#workspace').append(dom);

		//add to node preview if open
		if($('#workspace-preview-wrapper')) $('#workspace-preview').append(pDom);
	}





});
	
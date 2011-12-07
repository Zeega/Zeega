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
	
	controls : function()
	{
		
	},
	
	visual : function()
	{
		
	},

	onControlsOpen : function()
	{

	},

	onControlsClose : function()
	{

	},
	
	onAttributeUpdate : function()
	{
		
	},
	
	//necessary?
	drawThumb : function()
	{
		
	},
	
	updateZIndex : function(z)
	{

	},

	onExit : function()
	{

	},

	////////// player
		
	preload : function()
	{
		$('#zeega-player').trigger('ready',{'id':this.model.id});
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
		//test to see if it's a model or just a layer data object
		if(model.attributes)
		{
			var _this = this;
			
			this.model = model;
		
			this.attr = model.get('attr');
		
			var defaults = deepCopy( this.defaultAttributes );
			this.attr = _.defaults( this.attr, defaults);
		
			this.model.set({ attr:this.attr })
			this.title = this.attr.title;
		
			this.type = model.get('type');
		
			this.zIndex = model.get('zindex');
			
			// have to set these inside here so they don't get shared!!!
			this.visualEditorElement = $('<div>');
			this.layerControls = $('<div>');

			
			
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
		
		_.defaults( this.attr, this.defaultAttributes );
		
		this.editorLoaded = false;
		
		//I can draw the visual element once
		this.visual();

	},
	
	//necessary?
	lightLoad : function(model)
	{
		//make it possible to load objects and not models.
		this.model = model;
		this.attr = model.attr;
	
		var defaults = deepCopy(this.defaultAttributes );

		this.attr = _.defaults(this.attr, defaults);
		this.model.attr = this.attr;
		this.title = this.attr.title;
		this.type = model.type;
		this.zIndex = model.zindex;
		
		this.display = $('<div>');
		
	},
	
	setListeners : function()
	{
		var _this = this;
		///////set listener
		this.layerControls.bind( 'update' , function( e , settings, silent ){
			//console.log('update called');
			// look through each setting object
						
			_.each( settings, function(setting){
				if( setting.css )
				{
					//console.log('settingCSS');
					if( setting.suffix ) _this.visualEditorElement.css( setting.property, setting.value + setting.suffix );
					else _this.visualEditorElement.css( setting.property, setting.value );
				}
			})
			//if the update isn't silent, then update the model
			if( !silent ) _this.updateAttribute( settings );
		});
		
		
		/*
		this.layerControls.bind( 'updateCSS' , function( e , settings, silent ){
			//console.log('update called');
			// look through each setting object
						
			_.each( settings, function(setting){
				if( setting.css )
				{
					//console.log('settingCSS');
					if( setting.suffix ) _this.visualEditorElement.css( setting.property, setting.value + setting.suffix );
					else _this.visualEditorElement.css( setting.property, setting.value );
				}
			})
			//if the update isn't silent, then update the model
			if( !silent ) _this.updateAttribute( settings );
		});
		
		this.layerControls.bind( 'updateModel' , function( e , settings, silent ){
			//console.log('update called');
			// look through each setting object
						
			_.each( settings, function(setting){
				if( setting.css )
				{
					//console.log('settingCSS');
					if( setting.suffix ) _this.visualEditorElement.css( setting.property, setting.value + setting.suffix );
					else _this.visualEditorElement.css( setting.property, setting.value );
				}
			})
			//if the update isn't silent, then update the model
			if( !silent ) _this.updateAttribute( settings );
		});
		*/
		
		/////// end listener
	},
	
	//Activate layer icon for display in workspace icon drawer
	
	drawControls : function()
	{
		// i need to redraw the controls every time.
		this.layerControls.empty();
		this.controls();
		this.setListeners();
		return this.layerControls;
	},
	
	drawToVisualEditor : function()
	{
		//this.visualEditorElement.empty();
		//this.visual();
		return this.visualEditorElement;
	},
	
	setIcon : function()
	{
		this.icon = true;
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
		//need to extend beacuse attr is an object that has to be set all at once
		_.extend( this.model.get('attr'), newAttr );
		this.model.set( newAttr );
	},
	
	//this should be the new way to update stuff!!!
	updateAttribute : function( settings )
	{
		var _this = this;
		_.each( settings, function(setting){

			var setObj = {};
			setObj[ setting.property ] = setting.value
			
			_this.setAttributes( setObj );
		})
		
		this.save();
	},
	
	save : function()
	{
		//kept separate from updateLayerAttr because there are reasons to set but not save yet
		console.log('save()');
		//Zeega.currentNode.noteChange(); //stops thumbnail generation for now
		this.model.save(); //saves the current model
	}
	

});






	

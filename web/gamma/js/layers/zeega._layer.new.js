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
	
	controls : {
		
		draw : function()
		{
			
		},
		
		onOpen : function()
		{
			
		},
		
		onClose : function()
		{
			
		}
	}, // controls
	
	editor : {
		
		visual : {
			
			draw : function()
			{
				
			}
		}, // visual
		
		interaction : {
			
			draw : function()
			{
				// ??
			}
		},
		
		onAttributeUpdate : function()
		{

		},

		onExit : function()
		{

		}
		
	}, // editor
	
	player : {
		
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

		}
		
	}, // player
	
	private : {
		
		init : function()
		{
			
		},
		
		load : function( model )
		{
			this.model = model;

			this.attr = this.model.get('attr');

			_.defaults( this.attr , this.defaultAttributes );

			this.model.set({attr:this.attr})
			this.title = this.attr.title;

			this.type = model.get('type');

			this.zIndex = model.get('zindex');
		},
		
		onStateChange : function()
		{
			
		},
		
		onError : function()
		{
			
		},
		
		setText : function( newText )
		{
			model.set({ 'text' : newText });
		},
		
		setAttributes : function( newAttr )
		{
			this.model.set({ 'attr' : newAttr });
		},
		
		save : function()
		{
			//kept separate from updateLayerAttr because there are reasons to set but not save yet
			console.log('save()');
			Zeega.currentNode.noteChange();
			this.model.save(); //saves the current model
		}
		
	}//events
	
});


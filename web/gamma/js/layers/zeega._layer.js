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
		this.controls.parent = this;
		this.editor.parent = this;
		this.editor.visual.parent = this;
		this.editor.interaction.parent = this;
		this.player.parent = this;
		this.util.parent = this;
		
		console.log('$$$$$$this');
		console.log(this);
		
	},
	
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

		}
		
	}, // player
	
	util : {
		
		load : function( model )
		{
			this.parent.model = model;

			this.parent.attr = this.parent.model.get('attr');

			//_.defaults( this.parent.attr , this.parent.defaultAttributes );
			
			console.log(this.parent.attr);
			console.log(this.parent.defaultAttributes);
			
			
			this.parent.model.set({attr:this.parent.attr})
			this.parent.title = this.parent.attr.title;

			this.parent.type = model.get('type');
			
		},
		
		setZIndex : function(z)
		{
			this.parent.dom.css( 'z-index', z );
		},
		
		onStateChange : function()
		{
			
		},
		
		onError : function()
		{
			
		},
		
		setText : function( newText )
		{
			this.parent.model.set({ 'text' : newText });
		},
		
		setAttributes : function( newAttr )
		{
			//this.parent.model.set({ 'attr' : newAttr });
			
			var attr = this.parent.model.get('attr');
			var n = _.extend( attr, newAttr );
			console.log(attr);
			console.log(newAttr);
			console.log(n);
			
			//this.parent.model.set( _.extend( attr, newAttr ) );
			
		},
		
		save : function()
		{
			//kept separate from updateLayerAttr because there are reasons to set but not save yet
			console.log('save()');
			Zeega.currentNode.noteChange();
			this.parent.model.save(); //saves the current model
		}
		
	}//events
	
});


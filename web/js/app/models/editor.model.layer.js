(function(Layer){

	Layer.Model = Backbone.Model.extend({
		
		showControls : true,
		player : false,
		
		visualLoaded : false,
		
		editorWindow : $('#visual-editor-workspace'),
		layerPanel : $('#layers-list-visual'),
		
		defaults : {
			attr : {},
			visibleineditor : true,
			thumbUpdate : true,
			linkable : true
		},
		
		defaultAttributes : {},
		
		url : function()
		{
			if( this.isNew() ) return zeega.app.url_prefix + 'sequences/'+ zeega.app.sequenceID +'/layers';
			else return zeega.app.url_prefix + "layers/" + this.id;
		},
		
		initialize: function(attributes,options)
		{
			console.log('LAYERS')
			
			this.on('ready', function(){ this.visualLoaded = true })
			
			if( options ) _.extend(this,options);
			
			if( !_.isNull( this.layerType ) )
			{
				this.set('type',this.layerType);
				this.set('attr', _.defaults( this.get('attr'), this.defaultAttributes) );

				//create visual view
				this.visual = new Layer.Views.Visual[this.layerType]({model:this})
				//create control view
				if(this.showControls) this.controls = new Layer.Views.Controls[this.layerType]({model:this})
			
				this.init();
			}
			else console.log('MISSING LAYER TYPE')
		},
		
		//called at the end of initialize. we don't want to override it
		init : function(){},
		
		renderLayerInEditor : function()
		{
			this.editorWindow.append( this.visual.render().el );
			if(this.controls) this.layerPanel.prepend( this.controls.render().el );
			
			this.trigger('rendered_editor');
		},
		
		unrenderLayerFromEditor : function()
		{
			this.visual.remove();
			this.controls.remove();
			this.trigger('unrendered_editor');
		},
		
		renderLayerInEditor : function()
		{
			this.editorWindow.append( this.visual.render().el );
			if(this.controls) this.layerPanel.prepend( this.controls.render().el );
			
			this.trigger('rendered_editor');
		},
		

		update : function( newAttr, silent )
		{
			_.extend( this.get('attr'), newAttr );
			if( !silent )
			{
				this.save();
			}
		},
		
		// triggers after the visual element is drawn
		onDomPlacement : function(){},

		// triggers after the controls are open. attach listeners etc
		onControlsOpen : function(){},

		// triggers after the controls are closed. detach listeners etc
		onControlsClose : function(){},

/*
		// triggers when the attributes are updated.
		onAttributeUpdate : function(){},
*/
		// draws the thumb?
		thumb : function()
		{
			var img = $('<img>')
				.attr('src', this.attr.thumbnail_url)
				.css({'width':'100%'});

			this.thumbnail.append( img );
		},

/*
		// updates the z-index for the visual element
		updateZIndex : function(z){},
*/
		// triggered when the layer leaves scope (new frame etc)
		onExit : function(){},

		////////// player

		// triggers ready for the player
		preload : function()
		{
			$('#zeega-player').trigger('ready',{'id':this.model.id});
		},

		// player :: triggers when the frame starts playing
		play : function(){},

		// player :: triggers when the frame exits
		pause : function(){},

		// player :: puts the visual element offscreen
		stash : function(){},

		// player :: fallback for media that may not work for some reason (browsers)
		playUnsupported : function(){},

		// player :: triggers when the frame exits
		onExit : function(){},

		// utlities

		// loads crap into the model. no longer necessary? hope so!
		
		// ??
		setIcon : function(){ this.icon = true },
		
		//sets the z-index ??
		setZIndex : function(z){ this.visualEditorElement.css( 'z-index', z ) },

		// ??
		onStateChange : function(){},

		// ??
		onError : function(){},

		//////////////////
	
		//remove formatting from titles (esp important for text layer!)
		validate : function(attrs)
		{
			if( attrs.title ) attrs.title = attrs.title.replace(/(<([^>]+)>)/ig, "");
		}
	

	});

	
})(zeega.module("layer"));
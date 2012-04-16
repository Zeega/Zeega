(function(Layer){

	Layer.Model = Backbone.Model.extend({
		
		showControls : true,
		player : false,
		
		visualLoaded : false,
		
		editorWindow : $('#visual-editor-workspace'),
		layerPanel : $('#layers-list-visual'),
		
		defaults : {
			attr : {},
			linkable: true,
			thumbUpdate : true,
		},
		
		defaultAttributes : {},
		
		url : function()
		{
			if( this.isNew() ) return zeega.app.url_prefix + 'sequences/'+ zeega.app.currentSequence.id +'/layers';
			else return zeega.app.url_prefix + "layers/" + this.id;
		},
		
		initialize: function(attributes,options)
		{
			
			this.on('ready', function(){ this.visualLoaded = true });
			this.on('refresh_view', this.refreshView, this);
			
			
			this.on('editor_layerRender', this.renderLayerInEditor, this );
			this.on('editor_destroyLayer editor_layerUnrender', this.unrenderLayerFromEditor, this);
			
			this.on('editor_controlsOpen', this.onControlsOpen, this);
			this.on('editor_controlsClosed', this.onControlsClosed, this);
			
			this.on('editor_destroyLayer', this.unrenderLayerFromEditor, this);
			
			
			if( options ) _.extend(this,options);
			
			if( !_.isNull( this.layerType ) )
			{
				this.set('type',this.layerType);
				this.set('attr', _.defaults( this.get('attr'), this.defaultAttributes ) );
				
				//create visual view
				this.visual = new Layer.Views.Visual[this.layerType]({model:this});
				
				//create control view
				if( !this.player ) this.controls = new Layer.Views.Controls[this.layerType]({model:this})
			
				this.init();
			}
			else console.log('MISSING LAYER TYPE')
		},
		
		//called at the end of initialize. we don't want to override it
		init : function(){},
		
		onControlsOpen : function(){},
		
		onControlsClosed : function(){},
		
		renderLayerInEditor : function()
		{
			if(this.isNew()) 
			{
				this.visual.render().$el.css('zIndex',1000);
				this.editorWindow.append( this.visual.el );
			}
			else this.editorWindow.append( this.visual.render().el );
			if(this.controls) this.layerPanel.prepend( this.controls.render().el );
			
			this.trigger('editor_rendered editor_layerEnter');
		},
		
		unrenderLayerFromEditor : function()
		{
			if( this.hasChanged() ) this.save();
			this.trigger('editor_layerExit')
		},
		
		refreshView : function()
		{
			console.log('	refresh view')
			this.visual.$el.attr('id','layer-visual-'+this.id)
			this.controls.$el.attr('id','layer-'+this.id)
		},

		update : function( newAttr, silent )
		{
			_.extend( this.get('attr'), newAttr );
			if( !silent )
			{
				this.save();
			}
		},

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

		////////// player

		// triggers ready for the player
		preload : function()
		{
			$('#zeega-player').trigger('ready',{'id':this.model.id});
		},

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
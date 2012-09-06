(function(Layer){

	Layer.Model = Backbone.Model.extend({
		
		status : 'waiting',

		showControls : true,
		player : false,
		displayCitation: true,
		visualLoaded : false,
		defaultControls : true,
		hasControls :true,
		
		editorWindow : $('#visual-editor-workspace'),
		layerPanel : $('#layers-list-visual'),
		
		layerColor : [ 'red','blue','yellow','green' ],
		
		defaults : {
			attr : {},
			linkable: true,
			thumbUpdate : true,
		},
		
		defaultAttributes : {},
		
		url : function()
		{
			if( this.isNew() ) return zeega.app.url_prefix + 'api/projects/'+ zeega.app.project.id +'/layers';
			else return zeega.app.url_prefix + "api/layers/" + this.id;
		},
		
		initialize: function(attributes,options)
		{
			console.log('$$		init layer', attributes, options, this)
			
			this.on('ready', function(){ this.visualLoaded = true });
			this.on('refresh_view', this.refreshView, this);
			this.on('editor_layerRender', this.renderLayerInEditor, this );
			this.on('editor_destroyLayer editor_layerUnrender', this.unrenderLayerFromEditor, this);
			this.on('editor_controlsOpen', this.onControlsOpen, this);
			this.on('editor_controlsClosed', this.onControlsClosed, this);
			this.on('editor_destroyLayer', this.unrenderLayerFromEditor, this);
			
			this.on('sync', this.refreshView, this);
			
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
		
		generateNewViews : function()
		{
			if( !_.isNull( this.layerType ) )
			{
				//create visual view
				this.visual = new Layer.Views.Visual[this.layerType]({model:this});
				//create control view
				if( !this.player ) this.controls = new Layer.Views.Controls[this.layerType]({model:this})
			}
		},
		
		//called at the end of initialize. we don't want to override it
		init : function(){},


		removeFromView : function()
		{
			console.log('$$		remove from view', this);
			
		},


		
		onControlsOpen : function(){},
		
		onControlsClosed : function(){},
		
		refreshView : function()
		{
			this.visual.$el.attr('id','layer-visual-'+this.id)
			if(this.controls) this.controls.$el.attr('id','layer-'+this.id)
		},

		update : function( newAttr, silent )
		{
			var a = _.extend( this.toJSON().attr, newAttr, {model:null} );
			this.set( 'attr' , a );
			if( silent != true ) this.save();
			this.trigger('update');
			this.trigger('change');
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
			$('#zeega-player').trigger('ready',{'id':this.id});
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
			if( !_.isNumber(attrs.id) ) attrs.id = parseInt( attrs.id);
			if(attrs.attr.model != null ) attrs.attr.model = null;
			if( attrs.title ) attrs.title = attrs.title.replace(/(<([^>]+)>)/ig, "");
		}
	

	});

	
})(zeega.module("layer"));
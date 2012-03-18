(function(Layer){

	Layer.Model = Backbone.Model.extend({
		
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
		
		initialize: function()
		{
			//create visual view
			this.visual = new Layer.Views.ImageVisual({model:this})
			//create control view
			this.controls = new Layer.Views.ImageControls({model:this})
			
			this.set('attr', _.defaults( this.get('attr'), this.defaultAttributes) );
			
			this.init();
		},
		
		//called at the end of initialize. we don't want to override it
		init : function(){},
		
		renderLayerInEditor : function()
		{
			this.editorWindow.append( this.visual.render().el );
			this.layerPanel.prepend( this.controls.render().el );
			
			this.trigger('rendered_editor');
		},
		
		unrenderLayerFromEditor : function()
		{
			this.visual.remove();
			this.controls.remove();
			this.trigger('unrendered_editor');
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
		load : function( model )
		{

			//test to see if it's a model or just a layer data object
			if(model.attributes)
			{
				var _this = this;

				this.model = model;

				this.attr = deepCopy( model.get('attr') );

				var defaults = deepCopy( this.defaultAttributes );

				this.attr = _.defaults( this.attr, defaults);
				this.model.set({ attr:this.attr })
				this.title = this.attr.title;
				this.type = model.get("type");
				this.zIndex = model.get('zindex');

				var editorCSS = {
					position : 'absolute',
					width : this.model.get('attr').width+'%',
					height : this.model.get('attr').height +"%",
					opacity : this.model.get('attr').opacity,
					top : this.model.get('attr').top +'%',
					left : this.model.get('attr').left +'%'
				};

				// have to set these inside here so they don't get shared!!!
				this.visualEditorElement = $('<div>').css( editorCSS );
				this.layerControls = $('<div>');

			}
			else
			{
				//make it possible to load objects and not models.
				this.model = model;
				this.attr = deepCopy( model.attr );

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

		// player :: necessary?
		lightLoad : function( model )
		{
			var _this = this;
			//make it possible to load objects and not models.
			this.model = model;
			this.attr = model.attr;

			var defaults = deepCopy(this.defaultAttributes );

			this.attr = _.defaults(this.attr, defaults);
			this.model.attr = this.attr;
			this.title = this.attr.title;
			this.type = model.type;
			this.zIndex = model.zindex;

			//set basic positioning
			var thumbCSS = {
				position : 'absolute',
				width : this.model.attr.width+'%',
				height : this.model.attr.height +"%",
				opacity : this.model.attr.opacity,
				top : this.model.attr.top +'%',
				left : this.model.attr.left +'%'
			};
			var displayCSS = {
				position : 'absolute',
				width : this.model.attr.width+'%',
				height : 'auto',
				top : '-1000%',
				left : '-1000%'
			};
			var innerDisplayCSS = {
				position : 'relative',
				width:'100%',
				//height : this.model.attr.height +"%",
				opacity : this.model.attr.opacity,
			};

			this.display = $('<div>').css(displayCSS);
			this.display.append( $('<div>').css(innerDisplayCSS) );
			this.innerDisplay = this.display.children()[0];

			this.thumbnail = $('<div>').css(thumbCSS);

			if(this.attr.link_to)
			{
				var _this = this;

				$(this.display).addClass('linked-layer');
				$(this.display).click(function(){
					console.log( 'http://'+ _this.attr.link_to );
					document.location.href = 'http://'+ _this.attr.link_to;
				});

				$(this.display).hover(function(){
					$(this).addClass('link-layer-hover')
				},function(){
					$(this).removeClass('link-layer-hover')
				});
			}

			this.thumb();
		},

		// editor :: listens for changes in the controls
		setListeners : function()
		{
			var _this = this;
			///////set listener
			this.layerControls.bind( 'update' , function( e , settings, silent ){
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

		// editor :: draws the controls into the panel
		drawControls : function()
		{
			// i need to redraw the controls every time.
			this.layerControls.empty();
			this.controls();
			this.setListeners();
			return this.layerControls;
		},

		// editor :: draws the visual element into the workspace
		drawToVisualEditor : function()
		{
			//this.visualEditorElement.empty();
			//this.visual();
			return this.visualEditorElement;
		},

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
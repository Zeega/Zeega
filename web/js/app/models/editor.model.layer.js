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
			
			this.init();
		},
		
		renderLayer : function()
		{
			this.editorWindow.append( this.visual.render().el );
			this.layerPanel.append( this.controls.render().el );
			
			this.trigger('rendered');
		},
	
		/////////////////////
		
		//called at the end of initialize. we don't want to override it
		init : function(){},

		update : function( newAttr, silent )
		{
			_.extend( this.get('attr'), newAttr );
			if( !silent ) this.save();
		},
		
		// draws controls
		controls : function(){},

		// draws visual editor element
		visual : function(){},

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
	
	Layer.Views.Visual = Backbone.View.extend({
		
		className : 'visual-element',
		
		draggable : true,
		
		initialize : function()
		{
			var _this = this;
			
			this.model.on('rendered', this.onRender, this);
			this.model.on('unrendered', this.onUnrender, this);
			this.model.on('controls_open', this.onControlsOpen, this);
			this.model.on('controls_closed', this.onControlsClosed, this);
			
			this.attr = this.model.get('attr')
			
			$(this.el).css({
				'position' : 'absolute',
				'width' : _this.attr.width+'%',
				'opacity' : _this.attr.opacity,
				'top' : _this.attr.top +'%',
				'left' : _this.attr.left+'%'
			});
			
			if(this.draggable) this.makeDraggable();
		},
		
		onRender : function()
		{
			console.log('THIS SHIZ GOT RENDERED')
		},
		
		onUnrender : function()
		{
			console.log('THIS SHIZ GOT UnRENDERED')
		},
		
		onControlsOpen : function()
		{
			console.log('!!!!!!controls open')
		},
		
		onControlsClosed : function()
		{
			console.log('!!!!!!controls closed')
			
		},
		
		makeDraggable : function()
		{
			var _this = this;
			$(this.el).draggable({
				stop : function(e,ui)
				{
					//convert to % first // based on parent
					var topCent = ( ui.position.top / $(this).parent().height() ) * 100;
					var leftCent = ( ui.position.left / $(this).parent().width() ) * 100;
					
					_this.model.update({
						top: topCent,
						left: leftCent
					})
				}
			});
		}

	});
	
	Layer.Views.Controls = Backbone.View.extend({
		
		tagName : 'li',
		
		className : 'editor-layer',
		
		initialize : function()
		{
			this.model.on('rendered', this.onRender, this);
			this.model.on('unrendered', this.onUnrender, this);
			this.attr = this.model.get('attr')
			
			_.extend( this.events, this.eventTriggers );
			this.setBaseTemplate();
		},
		
		onRender : function()
		{
			console.log('THIS SHIZ GOT RENDERED')
		},
		
		onUnrender : function()
		{
			console.log('THIS SHIZ GOT UnRENDERED')
		},
		
		events : {
			'click .delete-layer'		: 'delete',
			'click .layer-title'		: 'expand',
			'change #persist'			: 'persist',
			'click .copy-to-next'		: 'copyToNext',
			'click .layer-icon'			: 'hideShow',
			'mouseenter .layer-icon'	: 'onLayerIconEnter', 
			'mouseleave .layer-icon'	: 'onLayerIconLeave', 
			'mouseenter .delete-layer'	: 'onLayerTrashEnter', 
			'mouseleave .delete-layer'	: 'onLayerTrashLeave',
			'click .layer-link'			: "layerLink",
			'click .clear-link'			: 'clearLayerLink'
		},
		
		// the events end users have access to
		eventTriggers : {},
		
		delete : function()
		{
			if( confirm('Delete Layer?') )
			{
				this.$el.remove();
				//this.model.trigger('removeFromFrame', this.model);
			}
		},

		//	open/close and expanding layer items
		expand :function()
		{
			var _this = this;
			if( $(this.el).find('.layer-content').is(':hidden') )
			{
				//show layer controls
				$(this.el).find('.layer-content')
					.show('blind',{'direction':'vertical'},function(){
						_this.model.trigger('controls_open');
						$(this).removeClass('closed');
				});
			}
			else
			{
				//hide layer controls
				$(this.el).find('.layer-content')
					.hide('blind',{'direction':'vertical'},function(){
						$(this).addClass('closed');
						_this.model.trigger('controls_closed');
				});
			}
			return false;
		},

		//set persistance action
		persist : function()
		{
			this.model.trigger('persist', this.model);
			/*
			if( $(this.el).find('#persist').is(':checked') ) Zeega.persistLayerOverFrames(this.model);
			else Zeega.removeLayerPersist( this.model );
			*/
		},

		copyToNext : function()
		{
			//Zeega.copyLayerToNextFrame( this.model)
			this.model.trigger('copyToNext', parseInt(this.model.id) );
			return false;
		},

		hideShow : function()
		{
			//set the visible in editor to the opposite of what it is currently
			var visible = !this.model.get('visibleineditor');
			this.model.set({'visibleineditor': visible });

			//change the color of the layer icon so it's apparent on/off
			if( visible ) $(this.el).find('.asset-type-icon').addClass('orange');
			else $(this.el).find('.asset-type-icon').removeClass('orange');
		},

		onLayerIconEnter : function()
		{
			$(this.el).find('.asset-type-icon').addClass('zicon-visible')
		},

		onLayerIconLeave : function()
		{
			$(this.el).find('.asset-type-icon').removeClass('zicon-visible')
		},

		onLayerTrashEnter : function()
		{
			$(this.el).find('.delete-layer').addClass('orange zicon-trash-open')
		},

		onLayerTrashLeave : function()
		{
			$(this.el).find('.delete-layer').removeClass('orange zicon-trash-open')
		},
		
		layerLink : function()
		{
			$(this.el).find('.layer-link-box').show();
			return false;
		},

		clearLayerLink : function()
		{

			$(this.el).find('.layer-link-box input').val('');

			var properties = {
				link : {
					property : 'link_to',
					value : '',
					css : false
				}
			};
			this.model.layerClass.layerControls.trigger( 'update' , [ properties ]);

			return false;
		},
				
				
		setBaseTemplate : function()
		{
			//shorten title if necessary
			var title = this.model.get('attr').title;

			var persist = '';
			/*
			if( zeega.app.project.sequences[0].get('attr') && zeega.app.project.sequences[0].get('attr').persistLayers && _.include( zeega.app.project.sequences[0].get('attr').persistLayers , _this.model.id ) )
				persist = 'checked';
			else persist = '';
			*/
			
			var showLink = '';
			if( _.isUndefined( this.model.get('attr').link_to ) || this.model.get('attr').link_to == '' )
				showLink = 'hidden';

			var linkURL = (showLink == '' ) ? this.model.get('attr').link_to : '';
			
			var blanks = {
				id : 'layer-edit-'+this.model.id,
				layerName : title,
				persist : persist,
				show_link : showLink,
				link_to : linkURL
			}

			$(this.el).append( _.template( this.getBaseTemplate(), blanks ) )
		},
		
		getBaseTemplate : function()
		{
			var html =

						'<div class="layer-uber-bar clearfix">'+
							'<div class="layer-icon">'+
								'<span class="asset-type-icon orange zicon"></span>'+
							'</div>'+
							'<div class="layer-title"><%= layerName %></div>'+
							'<div class="layer-uber-controls">'+
								'<span class="delete-layer zicon zicon-trash-closed"></span>'+
							'</div>'+
							'<div class="layer-drag-handle">'+
								'<span class="zicon zicon-vert-drag"></span>'+
							'</div>'+
						'</div>'+
						'<div class="layer-content inset-tray dark tray closed">'+
							'<div id="controls" class="clearfix"></div>'+
							//'<br />'+
							'<div class="standard-layer-controls clearfix">'+
								'<div>'+
									'<label for="persist" class="checkbox"><input id="persist" type="checkbox" name="vehicle" value="persist" <%= persist %> />Continue on all frames</label>'+
								'</div>'+
								'<div><a href="#" class="copy-to-next btn">Continue on next frame</a></div>';

						if( this.model.get('linkable') )
						{

							html +=	'<div><a href="#" class="layer-link" title="click here to set this layer as a link" style="float:left"><span class="zicon zicon-link orange"></span></a></div>';
							html += '<div class="layer-link-box <%= show_link %>">';
							html +=		'<div class="input-prepend"><span class="add-on">http://</span><input class="span4" name="prependedInput" type="text" placeholder="www.example.com" value="<%= link_to %>">';
							html +=		'<a href="#" class="clear-link"><span class="zicon zicon-close orange"></span></a>';
							html += '</div></div>';
						}
						html += 	'</div>'; //standard layer controls
						html += '</div>';

						return html;
		}
		
	});
	
	
})(zeega.module("layer"));
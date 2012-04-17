(function(Layer){
	
	Layer.Views.Controls = Backbone.View.extend({
		
		tagName : 'li',
		
		className : 'editor-layer',
		
		initialize : function()
		{
			this.initListeners();
			
			this.attr = this.model.get('attr')
			
			_.extend( this.events, this.eventTriggers );
			this.setBaseTemplate();
			
			this.controls = this.$el.find('#controls');
			this.$el.attr( 'id', 'layer-'+ this.model.id )
			
			//this.drawDefaultControls();
			
			
			this.init();
		},
		
		drawDefaultControls : function()
		{
			$(this.el).find('.default-layer-controls').empty();

			var persistentLayers = ( zeega.app.currentSequence.get('attr') ) ? zeega.app.currentSequence.get('attr').persistLayers : {};
			var isActive = _.include(persistentLayers, parseInt(this.model.id) );
			
			var continueToNext = new Layer.Views.Lib.ContinueToNextFrame({ model: this.model });
			var continueOnAll = new Layer.Views.Lib.ContinueOnAllFrames({ model: this.model, active : isActive });
			
			$(this.el).find('.default-layer-controls')
				.append( continueOnAll.getControl() )
				.append( continueToNext.getControl() );
			if( this.model.get('attr').linkable )
			{
				var link = new Layer.Views.Lib.Link({ model: this.model });
				$(this.el).find('.default-layer-controls').append( link.getControl() );
			}
		},
		
		initListeners : function()
		{
			this.model.on('change:attr', this.updateViewInPlace, this);
			
			if( this.model.player )
			{
				this.model.on('player_preload', this.private_onPreload, this);
				this.model.on('player_play', this.private_onPlay, this);
				this.model.on('player_exit', this.private_onExit, this);
				this.model.on('player_unrender', this.private_onUnrender, this);
			}
			else
			{
				this.model.on('editor_layerEnter', this.private_onLayerEnter, this);
				this.model.on('editor_layerExit', this.private_onLayerExit, this);
				this.model.on('editor_controlsOpen', this.private_onControlsOpen, this);
				this.model.on('editor_controlsClosed', this.private_onControlsClosed, this);
			}
		},
		
		init : function(){},
		
		/*******************
		
		PUBLIC EDITOR FUNCTIONS
		
		*******************/
		
		onLayerEnter : function(){},
		
		onLayerExit : function(){},
		
		onControlsOpen : function(){},
		
		onControlsClosed : function(){},
		
		// cleanupEditor : function(){},
		
		
		/*******************
		
		PUBLIC PLAYER FUNCTIONS
		
		*******************/
		
		onPreload : function(){},
		
		onPlay : function(){},
		
		onExit : function(){},
		
		onUnrender : function(){},
		
		
		/*******************
		
		PRIVATE EDITOR FUNCTIONS
		
		*******************/
		
		private_onLayerEnter : function()
		{
			console.log('	LAYER LIST enter')
			this.drawDefaultControls();
			this.delegateEvents();
			this.onLayerEnter();
		},
		
		private_onLayerExit : function()
		{
			console.log('	LAYER LIST EXIT')
			this.undelegateEvents();
			this.$el.find('#controls').empty();
			//this.remove();
			this.onLayerExit();
		},
		
		private_onControlsOpen : function()
		{
			this.onControlsOpen();
		},
		
		private_onControlsClosed : function()
		{
			this.onControlsClosed();
		},
		
		/*******************
		
		PRIVATE PLAYER FUNCTIONS
		
		*******************/
		
		private_onPreload : function()
		{
			this.onPreload();
			this.moveOffStage();
		},
		
		private_onPlay : function()
		{
			this.moveOnStage();
			this.onPlay();
		},
		
		private_onExit : function()
		{
			this.moveOffStage();
			this.onExit();
		},
		
		private_onUnrender : function()
		{
			this.remove();
			this.onUnrender();
		},
		
		////// HELPERS //////
		
		moveOnStage :function()
		{
			$(this.el).css({
				'top' : this.attr.top +'%',
				'left' : this.attr.left+'%'
			});
		},
		
		moveOffStage :function()
		{
			$(this.el).css({
				'top' : '-1000%',
				'left' : '-1000%'
			});
		},
		
		updateViewInPlace : function()
		{
			$(this.el).find('.layer-title').html(this.model.get('attr').title)
		},
		
		/*******************
		
			EVENTS
		
		*******************/
		
		events : {
			'click .delete-layer'		: 'delete',
			'click .layer-title'		: 'expand',
			'click .layer-icon'			: 'hideShow',
			'mouseenter .layer-icon'	: 'onLayerIconEnter', 
			'mouseleave .layer-icon'	: 'onLayerIconLeave', 
			'mouseenter .delete-layer'	: 'onLayerTrashEnter', 
			'mouseleave .delete-layer'	: 'onLayerTrashLeave',

		},
		
		// the events end users have access to
		eventTriggers : {},
		
		delete : function()
		{
			if( confirm('Delete Layer?') )
			{
				this.model.trigger('editor_removeLayerFromFrame', this.model);
				this.remove();
			}
		},

		//	open/close and expanding layer items
		expand : function()
		{
			var _this = this;
			if( $(this.el).find('.layer-content').is(':hidden') )
			{
				//show layer controls
				$(this.el).find('.layer-content')
					.show('blind',{'direction':'vertical'},function(){
						_this.model.trigger('editor_controlsOpen');
						$(this).removeClass('closed');
				});
				
				this.visible = true;
			}
			else
			{
				//hide layer controls
				$(this.el).find('.layer-content')
					.hide('blind',{'direction':'vertical'},function(){
						$(this).addClass('closed');
						_this.model.trigger('editor_controlsClosed');
				});
				
				this.visible = false;
			}
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
		
		setBaseTemplate : function()
		{
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
				type : this.model.get('type').toLowerCase(),
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
								'<i class="zicon-<%= type %> orange"></i>'+
								//'<span class="asset-type-icon orange zicon"></span>'+
							'</div>'+
							'<div class="layer-title"><%= layerName %></div>'+
							'<div class="layer-uber-controls">'+
								'<i class="zicon-trash-closed delete-layer"></i>'+
							'</div>'+
							'<div class="layer-drag-handle">'+
								'<span class="zicon zicon-vert-drag"></span>'+
							'</div>'+
						'</div>'+
						'<div class="layer-content inset-tray dark tray closed">'+
							'<div id="controls" class="clearfix"></div>'+

							'<div class="default-layer-controls clearfix"></div>'+ //standard layer controls
						'</div>';

						return html;
		}
		
	});
	
	
})(zeega.module("layer"));



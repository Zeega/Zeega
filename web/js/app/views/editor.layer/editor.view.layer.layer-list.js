(function(Layer){
	
	Layer.Views.Controls = Backbone.View.extend({
		
		tagName : 'li',
		className : 'layer-list-item',
		
		initialize : function()
		{
			this.controls = $('<div>');
			this.initListeners();
			this.attr = this.model.get('attr')
			_.extend( this.events, this.eventTriggers );
			this.init();
		},
		
		render : function(){ /* this is overridden by individual controls*/ },
		
		renderControls : function()
		{
			this.$el.attr( 'id', 'layer-'+ this.model.id );
			this.$el.attr('data-id',this.model.id);
			this.setBaseTemplate();
			this.controls = $('<div>');
			this.$el.find('#controls').html(this.render().controls);
			this.drawDefaultControls();
			return this;
		},
		
		drawDefaultControls : function()
		{
			this.$el.find('.default-layer-controls').empty();

			var persistentLayers = ( zeega.app.currentSequence.get('attr') ) ? zeega.app.currentSequence.get('attr').persistLayers : {};
			var isActive = _.include(persistentLayers, parseInt(this.model.id) );
			
			var continueLayer = new Layer.Views.Lib.ContinueLayer({ model: this.model });
			
			this.$el.find('.default-layer-controls')
				.append( continueLayer.getControl() );
				//.append( continueToNext.getControl() );
			if( this.model.get('attr').linkable )
			{
				var link = new Layer.Views.Lib.Link({ model: this.model });
				this.$el.find('.default-layer-controls').append( link.getControl() );
			}
		},
		
		initListeners : function()
		{
			this.model.on('update', this.updateViewInPlace, this);
			if( this.model.player )
			{
				this.model.on('player_preload', this.private_onPreload, this);
				this.model.on('player_play', this.private_onPlay, this);
				this.model.on('player_exit', this.private_onExit, this);
				this.model.on('player_unrender', this.private_onUnrender, this);
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
			if(this.model.defaultControls) this.drawDefaultControls();
			this.delegateEvents();
			console.log('++		private on layer enter')
			this.onLayerEnter();
		},
		
		private_onLayerExit : function()
		{
			this.undelegateEvents();
			this.$el.find('#controls').empty();
			this.onLayerExit();
		},
		
		private_onRemoveLayerFromFrame : function()
		{
			this.remove();
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
			console.log('re render')
			if(!_.isUndefined(zeega.app.currentFrame))zeega.app.currentFrame.trigger('update_thumb');
			$(this.el).attr('data-id',this.model.id);
			$(this.el).find('.layer-title').html(this.model.get('attr').title)
			
		},
		
		/*******************
		
			EVENTS
		
		*******************/
		
		events : {
			'click .delete-layer'		: 'delete',
			'click .layer-super'		: 'expand',

		},
		
		// the events end users have access to
		eventTriggers : {},
		
		delete : function()
		{
			if( confirm('Delete Layer?') )
			{
				//this.model.trigger('editor_removeLayerFromFrame', this.model);
				zeega.app.currentFrame.layers.remove( this.model );
				//this.remove();
			}
		},

		//	open/close and expanding layer items
		expand : function()
		{
			if(this.model.hasControls)
			{
				if(this.$el.hasClass('layer-open') )
				{
					this.$el.removeClass('layer-open');
					this.model.trigger('editor_controlsClosed');
				}
				else
				{
					var _this = this;
					$('.layer-open').each(function(){
						var layerID = $(this).data('id');
						zeega.app.project.layers.get(layerID).trigger('editor_controlsClosed');
					})
					$('.layer-open').removeClass('layer-open');
					this.$el.addClass('layer-open');
					this.model.trigger('editor_controlsOpen');
				}

			}
			return false;
		},

		setBaseTemplate : function()
		{
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
				title : this.model.get('attr').title,
				persist : persist,
				show_link : showLink,
				link_to : linkURL
			}

			this.$el.addClass('layer-type-'+ this.model.get('type').toLowerCase());

			this.$el.html( _.template( this.getBaseTemplate(), blanks ) )
		},
		
		getBaseTemplate : function()
		{
			var html =

				"<div class='layer-super'>"+
					"<a href='#'><i class='icon-thumbs-up icon-white'></i></a>"+
					"<span class='layer-title'>  <%= title %></span>"+
					"<span class='pull-right'>"+
						"<a class='delete-layer' href='#'><i class='icon-trash icon-white'></i></a>"+
						"<a class='sort-handle' href='#'><i class='icon-minus icon-white'></i></a>"+
					"</span>"+
				"</div>"+
				"<div class='layer-control-drawer'>"+
					'<div id="controls" class="clearfix"></div>'+
					'<div class="default-layer-controls clearfix"></div>'+
				"</div>";

				return html;
		}
		
	});
	
	
})(zeega.module("layer"));



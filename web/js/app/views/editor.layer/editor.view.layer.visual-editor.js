(function(Layer){

	Layer.Views.Visual = Backbone.View.extend({
		
		className : 'visual-element',
		
		LAYER_TIMEOUT : 30000,
		
		layerClassName : '',
		
		draggable : true,
		linkable : true,
		
		initialize : function()
		{
			var _this = this;
			
			_.extend( this.events, this.eventTriggers );
			
			this.initListeners();
			
			this.attr = this.model.get('attr')
			
			
			
			$(this.el).css({
				'position' : 'absolute',
				'overflow' : 'hidden',
				
				'width' : _this.model.get('attr').width+'%',
				'opacity' : _this.model.get('attr').opacity,
				
				// if previewing, then set way off stage somewhere
				'top' : (this.model.player) ? '-1000%' : _this.model.get('attr').top +'%',
				'left' : (this.model.player) ? '-1000%' : _this.model.get('attr').left+'%'
				})
				.addClass('layer-'+ this.model.layerType.toLowerCase() )
				.attr('id', 'layer-visual-'+this.model.id);
			$(this.el).addClass(this.layerClassName);
				
			this.init();
		},
		
		initListeners : function()
		{
			//editor_removeLayerFromFrame
			if( this.model.player )
			{
				this.model.on('player_preload', this.private_onPreload, this);
				this.model.on('player_play', this.private_onPlay, this);
				this.model.on('player_exit', this.private_onExit, this);
				this.model.on('player_unrender', this.private_onUnrender, this);
				this.model.on('error', this.private_renderError, this);
			}
			else
			{
				this.model.on('editor_layerEnter editor_layerRender', this.private_onLayerEnter, this);
				this.model.on('editor_layerExit editor_removeLayerFromFrame', this.private_onLayerExit, this);
				this.model.on('editor_controlsOpen', this.private_onControlsOpen, this);
				this.model.on('editor_controlsClosed', this.private_onControlsClosed, this);
			}
		},
		
		events : {},
		eventTriggers : {},
		
		init : function(){},
		
		/*******************
		
		PUBLIC EDITOR FUNCTIONS
		
		*******************/
		
		onLayerEnter : function(){},
		
		onLayerExit : function()
		{
			this.model.trigger('editor_readyToRemove')
		},
		
		onControlsOpen : function(){},
		
		onControlsClosed : function(){},
		
		// cleanupEditor : function(){},
		
		
		/*******************
		
		PUBLIC PLAYER FUNCTIONS
		
		*******************/
		
		onPreload : function()
		{
			var _this = this;
			this.render();
			if(this.attr.link)
			{
				$(this.el).click(function(){
					window.location = 'http://'+ _this.attr.link
				})
				.addClass('linked-layer');

			}
			
			this.model.trigger('ready',this.model.id)
		},
		
		private_renderError : function()
		{
			this.$el.empty()
				.css({
					'background-color' : 'rgba(255,0,0,0.25)',
					'min-height' : '25px'
				});
				return this;
		},
		
		onPlay : function(){},
		
		onExit : function(){},
		
		onUnrender : function(){},
		
		
		/*******************
		
		PRIVATE EDITOR FUNCTIONS
		
		*******************/
		
		private_onLayerEnter : function()
		{
			if(this.draggable) this.makeDraggable();
			this.onLayerEnter();
		},
		
		private_onLayerExit : function()
		{
			this.model.on('editor_readyToRemove', this.remove, this )
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
		
		////// HELPERS //////
		
		makeDraggable : function()
		{
			var _this = this;
			$(this.el).draggable({
				
				start : function(e,ui)
				{
				},
				
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
		},
		
		/*******************
		
		PRIVATE PLAYER FUNCTIONS
		
		*******************/
		
		private_onPreload : function()
		{
			var _this = this;
			
			this.render();
			this.onPreload();
			this.model.rendered = true;
			
			if(this.timer) clearTimeout(this.timer);
			this.timer = setTimeout(function(){
				if(_this.model.status != 'ready')
				{
					console.log('ERROR: LAYER TIMEOUT!! '+_this.model.id)
					_this.model.status = 'error'
					_this.model.trigger('error', _this.model.id)
				}
				//else console.log('no error! loaded normally!!')
			},this.LAYER_TIMEOUT)
		},
		
		private_onPlay : function( z )
		{
			if(!this.onStage){
				this.onStage=true;
				if(this.attr.dissolve) $(this.el).clearQueue().css({opacity:.01});
			}
			this.moveOnStage();

			if(z) this.updateZIndex( z )

			if(this.model.status != 'error' ) this.onPlay();

			this.model.inFocus = true;
			
			//dissolve
			if(this.attr.dissolve) $(this.el).fadeTo(1000,this.model.get('attr').opacity);
			
			//make the linked layers blink on entrance
			if(this.attr.link || this.model.get('type') == 'Link')
			{
				var _this = this;
				setTimeout( function(){ $(_this.el).addClass('link-blink') }, 250 );
				setTimeout( function(){ $(_this.el).removeClass('link-blink') }, 2000 );
			}
		},
		
		private_onExit : function()
		{
			this.moveOffStage();
			this.onStage=false;
			this.onExit();
			this.model.inFocus = false;
		},
		
		private_onUnrender : function()
		{
			this.onUnrender();
			this.model.inFocus = false;
			this.model.rendered = false;
			this.remove();
		},
		
		////// HELPERS //////
		
		moveOnStage :function()
		{
			$(this.el).css({
				'top' : this.attr.top +'%',
				'left' : this.attr.left+'%'
			});
		},
		
		updateZIndex : function( z )
		{
			$(this.el).css('z-index', z)
		},
		
		moveOffStage :function()
		{
			$(this.el).css({
				'top' : '-1000%',
				'left' : '-1000%'
			});
		}
		
	});

})(zeega.module("layer"));
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
			
			this.attr = this.model.get('attr');
			
			
			
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
		
		events : {
			'click' : 'onclick'
		},
		eventTriggers : {},
		

		onclick : function()
		{

			// tests to see if the layer is Text
			// makes it possible to blur contenteditable by clicking on another layer
			if(this.model.get('type') != 'Text' )
			{
				if( !$('#honeypot').length  )	var editableFix = $('<input id="honeypot" style="width:1px;height:1px;border:none;margin:0;padding:0;" tabIndex="-1">').appendTo('html');
				$('#honeypot')[0].setSelectionRange(0, 0);
				$('#honeypot')[0].blur();
			}
		},

		init : function(){},
		
		/*******************
		
		PUBLIC EDITOR FUNCTIONS
		
		*******************/
		
		onLayerEnter : function(){},
		
		onLayerExit : function()
		{
			this.model.trigger('editor_readyToRemove');
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
					window.location = 'http://'+ _this.attr.link;
				})
				.addClass('linked-layer');

			}
			
			this.model.trigger('ready',this.model.id);
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

		playPause : function()
		{
			console.log('$$		play pause status', this.isPlaying);
			if( this.isPlaying )
			{
				this.isPlaying = false;
				this.onPause();
			}
			else
			{
				this.isPlaying = true;
				this.onPlay();
			}
		},

		onPause : function(){},
		
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
			this.model.on('editor_readyToRemove', this.remove, this );
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
					console.log('layer drag start');
				},
				
				stop : function(e,ui)
				{
					//var target = $(this).find('._loc_target').length ? $(this).find('._loc_target')[0] : $(this);
					//var parent = $(this).parent();

					//console.log('targettttt', target);

					//var leftCent = ( ($(target).offset().left - $(parent).offset().left) / $(parent).width() * 100 );
					//var topCent = ( ($(target).offset().top - $(parent).offset().top) / $(parent).height() * 100 );
					//convert to % first // based on parent
					var topCent = (( ui.position.top / $(this).parent().height() ) * 100);
					var leftCent = (( ui.position.left / $(this).parent().width() ) * 100);
					//change the dom element back to percentages

					var percents = {
						top: topCent+'%',
						left: leftCent+'%'
					};
console.log('%%%%', percents);
					$(this).css( percents );
					_this.model.update( percents );
					
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
					console.log('ERROR: LAYER TIMEOUT!! '+_this.model.id);
					_this.model.status = 'error';
					_this.model.trigger('error', _this.model.id);
				}
				//else console.log('no error! loaded normally!!')
			},this.LAYER_TIMEOUT);
		},
		
		private_onPlay : function( z )
		{
			this.isPlaying = true;
			if(!this.onStage)
			{
				this.onStage=true;
				if(this.attr.dissolve) $(this.el).clearQueue().css({opacity:0.01});
			}
			this.moveOnStage();

			if(z) this.updateZIndex( z );

			if(this.model.status != 'error' ) this.onPlay();

			this.model.inFocus = true;
			
			//dissolve
			if(this.attr.dissolve) $(this.el).fadeTo(1000,this.model.get('attr').opacity);
			
		},
		
		private_onExit : function()
		{
			this.isPlaying = false;
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
			$(this.el).css('z-index', z);
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
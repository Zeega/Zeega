/*---------------------------------------------


	Object: Player
	The Zeega project web player. Part of Core.


	ideas:
	master list of layers/frames - loading/loaded to check against

---------------------------------------------*/

var Player2 = Backbone.View.extend({
		
	loadAheadDistance : 2,
	overlaysHidden : false,
	viewportRatio : 1.5,
	zeega : true,
	
	
	initialize : function( data, options )
	{
		this.render();
		
		this.generateBackbone();
		this.parseData( data );
		
		this.setCurrentSequence( options.sequenceID );
		this.setCurrentFrame( options.frameID );
		this.setCurrentLayers();
		
		//this.currentFrame.on('ready', this.renderCurrentFrame, this);
		
		console.log(this.currentSequence)
		console.log(this.currentFrame)
		console.log(this.currentLayers)
		
		this.goToFrame( this.currentFrame );
	},
	
	
	/*****************************
	
	PLAYER FUNCTIONS
	
	*****************************/
	
	loadAhead : function()
	{
		//find the frame you're coming from and where it is in the order
		var frameOrder = this.currentSequence.get('frameOrder');
		var index = _.indexOf( frameOrder, this.currentFrame.id );

		//see if frame's layers are preloaded // starting with the currentFrame
		//look ahead 2 and behind 2 // include current frame also
		
		for (var i = 0  ; i < this.loadAheadDistance * 2 + 1 ; i++ )
		{
			//the offset spirals outward to load nearest frames first
			var offset = Math.ceil(i/2) * (-1+(2*(i%2)));
			var tryIndex = index + offset;
			if(tryIndex >= 0 && tryIndex < frameOrder.length)
			{
				var frameID = frameOrder[tryIndex];
				var frame = this.currentSequence.frames.get( frameID );
				if( frame.status != 'loading' && frame.status != 'ready' )
					this.preloadFrame( frame );
			}	
		}
	},
	
	preloadFrame : function( frame )
	{
		var _this = this;
		_.each( frame.get('layers'), function(layerID){
			var layer = _this.currentSequence.layers.get( layerID );
			if( layer.status != 'loading' && frame.status != 'ready' )
			{
				_this.preloadLayer( layer )
			}
		});
		frame.trigger('loading', frame.id);
	},
	
	preloadLayer : function( layer )
	{
		layer.trigger('loading', layer.id)
		
		this.$el.find('#preview-media').append( layer.visual.render().el );
		layer.trigger('player_preload');
	},
	
	goToFrame : function( frame )
	{
		this.clearStage( frame );
		
		if( frame.status == 'ready') this.renderFrame(frame.id )
		else frame.on('ready', this.renderFrame, this );

		this.loadAhead();
	},
	
	clearStage : function( frame )
	{
		var _this = this;
		var oldLayers = this.currentFrame.get('layers');
		var newLayers = frame.get('layers');
		
		var removeLayers = _.difference(oldLayers, newLayers);
		_.each( removeLayers, function( layerID ){
			_this.currentSequence.layers.get( layerID ).trigger('player_exit')
		})
	},
	
	renderFrame : function( id )
	{
		var _this = this;
		var frame = this.currentSequence.frames.get(id);
		frame.off('ready', this.renderFrame);
		
		_.each( frame.get('layers'), function(layerID){
			_this.currentSequence.layers.get( layerID ).trigger('player_play')
		})
		this.currentFrame = frame;
		
		this.updateArrows();
	},
	
	goLeft : function()
	{
		var frame = this.getLeft();
		if( frame ) this.goToFrame( frame );
	},
	
	goRight : function()
	{
		var frame = this.getRight();
		if( frame ) this.goToFrame( frame );
	},
	
	getLeft : function( step )
	{
		if( _.isUndefined( step ) ) step = 1;
		var frameOrder = this.currentSequence.get('frameOrder');
		var index = _.indexOf( frameOrder, this.currentFrame.id );
				
		if( index - step < 0 ) return false;
		else return this.currentSequence.frames.get( frameOrder[index-step] );
	},
	
	getRight : function( step )
	{
		if( _.isUndefined( step ) ) step = 1;
		var frameOrder = this.currentSequence.get('frameOrder');
		var index = _.indexOf( frameOrder, this.currentFrame.id );
		
		if( index+1 + step > frameOrder.length ) return false;
		else return this.currentSequence.frames.get( frameOrder[index+step] );
	},
	
	closePlayer : function()
	{
		var _this = this;
		
		//unhide editor
		$('#wrapper').show();

		this.unsetListeners();
		
		//turn off/pause all media first
		/*
		_.each(this.layersOnStage, function(layerID){
			_this.layerCollection.get(layerID).visual.moveOffStage();
		});
		*/
		
		if(this.zeega) zeega.app.previewMode = false;
		
		// remove the player div
		this.$el.fadeOut( 450, function(){ $(this).remove() });
	},
	
	
	
	
	/*****************************
	
	VIEW FUNCTIONS
	
	*****************************/
	
	render : function()
	{
		//get the current viewport resolution
		var viewWidth = window.innerWidth;
		var viewHeight = window.innerHeight;
		
		var cssObj = {};
		if( viewWidth / viewHeight > this.viewportRatio )
		{
			cssObj.height = viewHeight +'px';
			cssObj.width = viewHeight * this.viewportRatio +'px'
		}else{
			cssObj.height = viewWidth / this.viewportRatio +'px';
			cssObj.width = viewWidth +'px'
		}
		
		//constrain proportions in player
		$(this.el).attr('id','preview-wrapper').append( this.getTemplate() );
		$(this.el).find('#preview-media').css( cssObj );
		$('body').prepend( this.el );

		//hide the editor underneath to prevent scrolling
		$('#wrapper').hide();
		
		$(this.el).fadeIn();
		this.initListeners();
	},
	
	/*****************************
	
	EVENT FUNCTIONS
	
	*****************************/
	
	updateArrows : function()
	{
		var leftFrame = this.getLeft();
		var rightFrame = this.getRight();
		
		if( this.currentSequence.frames.length == 1 )
		{
			this.$el.find('#preview-left').hide();
			this.$el.find('#preview-right').hide();
		}
		else if( !this.overlaysHidden )
		{
			if( !leftFrame ) this.$el.find('#preview-left').fadeOut();
			else if( this.$el.find('#preview-left').is(':hidden') ) this.$el.find('#preview-left').fadeIn();

	 		if( !rightFrame ) this.$el.find('#preview-right').fadeOut();
			else if( this.$el.find('#preview-right').is(':hidden') ) this.$el.find('#preview-right').fadeIn();
		}
		
	},

	fadeOutOverlays : function( _this )
	{
		_this.overlaysHidden = true;
		$('.player-overlay').fadeOut('slow');
		$('.preview-nav').fadeOut('slow');
	},
	
	initListeners : function()
	{
		var _this = this;
		$(window).bind( 'keydown', function(e){
		    switch(e.which)
			{
				case 27:
					if(_this.zeega) _this.closePlayer(); //don't close if standalone player
					break;
				case 8:
					if(_this.zeega) _this.closePlayer(); //don't close if standalone player
					break;
				case 37:
					_this.goLeft();
					break;
				case 39:
					_this.goRight();
					break;
				case 38:
					_this.goUp();
					break;
				case 40:
					_this.goDown();
					break;
				case 32:
					_this.playPause();
					break;
			}
		});
		
		//resize player on window resize
		window.onresize = function(event)
		{
			//resize ##zeega-player
			var viewWidth = window.innerWidth;
			var viewHeight = window.innerHeight;

			var cssObj = {};
			if( viewWidth / viewHeight > _this.viewportRatio )
			{
				cssObj.height = viewHeight +'px';
				cssObj.width = viewHeight * _this.viewportRatio +'px'
			}else{
				cssObj.height = viewWidth / _this.viewportRatio +'px';
				cssObj.width = viewWidth +'px'
			}

			//constrain proportions in player
			_this.$el.find('#preview-media').css( cssObj );
			
		}
		
		$('#zeega-player').keydown(function(event) {
			
		});
		
		
		$('#citation').mouseleave(function(){
			_.delay( closeCitationBar, 500 );
		})
		

		var fadeOutOverlays = _.debounce(this.fadeOutOverlays,5000);
		//hide all controls and citation
		onmousemove = function()
		{
			if( !_this.overlaysHidden )
			{
				fadeOutOverlays( _this );
			}else{
				_this.overlaysHidden = false;
				$('.player-overlay').fadeIn('slow');
				_this.updateArrows();
			}
		}
		

	},
	
	unsetListeners : function()
	{
		$(window).unbind( 'keydown' ); //remove keylistener
		onmousemove = null;
	},
	
	events : {
		'click #preview-left' : 'goLeft',
		'click #preview-right' : 'goRight',
		'click #preview-close' : 'closePlayer'
	},
	
	
	/*****************************
	
	INIT FUNCTIONS
	
	*****************************/
	
	parseData : function( data )
	{
		// make sequence collection
		this.sequences = new this.Sequences( data.project.sequences )
	},
	
	setCurrentSequence : function( id )
	{
		this.currentSequence = this.sequences.get(id);
	},
	
	setCurrentFrame : function( id )
	{
		this.currentFrame = this.currentSequence.frames.get(id)
	},
	
	setCurrentLayers : function()
	{
		// set collection of current layers
		var _this = this;
		var layers = [];
		_.each( this.currentFrame.get('layers'), function(layerID){
			layers.push( _this.currentSequence.layers.get(layerID) )
		});
		var CurrentLayers = Backbone.Collection.extend();
		this.currentLayers = new CurrentLayers(layers)
	},
	
	/*****************************
	
	BACKBONERS
	
	*****************************/
	
	generateBackbone : function()
	{
		var _this = this;
		
		var LayerModel = Backbone.Model.extend();
		var FrameModel = Backbone.Model.extend();
		
		var LoadingCollection = Backbone.Collection.extend({
			
			loading : [],
			ready : [],
			
			initialize : function()
			{
				this.on('loading', this.updateLoadingStatus, this);
				this.on('ready', this.updateReadyStatus, this);
			},
			updateLoadingStatus : function( id )
			{
				var model = this.get(id);
				if( model.status != 'loading' && model.status != 'ready')
				{
					console.log('loading: '+id)
					model.status = 'loading';
					this.loading.push(id)
				}
			},
			updateReadyStatus : function( id )
			{
				var model = this.get(id);
				if( model.status != 'ready' )
				{
					this.loading = _.without(this.loading,id);
					model.status = 'ready';
					this.ready.push(id);
				}
			}
		});
		
		var SequenceModel = Backbone.Model.extend({

			initialize : function()
			{
				this.parseData();
			},
			
			parseData : function()
			{
				var _this = this;
				//generate frames & layers collections
				this.frames = new LoadingCollection( this.get('frames') );
				
				var Layer = zeega.module('layer');
				var layerArray = [];
				_.each( this.get('layers'), function( layerData ){
					var layer = new Layer[layerData.type]( layerData, {player:true} );
					layerArray.push( layer );
				});
				this.layers = new LoadingCollection( layerArray );
				
				this.layers.on( 'ready', _this.updateFrameStatus, this );
				
				this.unset('frames');
				this.unset('layers')
			},
			
			updateFrameStatus : function( layerID )
			{
				var _this = this;
				_.each( _.toArray(this.frames), function(frame){
					var frameLayers = frame.get('layers');
					var readyLayers = _this.layers.ready;
					if( _.difference(frameLayers,readyLayers).length == 0 )
					{
						console.log('trigger frame '+ frame.id)
						frame.trigger('ready', frame.id);
					}
				})
			}
			
		});
		
		
		this.Sequences = Backbone.Collection.extend({

			model : SequenceModel,

			initialize : function()
			{
				console.log('-- sequence collection --')
				console.log(this)
			}

		});
	},
	
	
	/*****************************
	
	TEMPLATES
	
	*****************************/
	
	getTemplate : function()
	{
		html =
		
		"<div id='zeega-player'>"+
			"<div id='preview-logo' class='player-overlay'><a href='http://www.zeega.org/' target='blank'><img src='"+sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +"images/z-logo-128.png'height='60px'/></a></div>";
		
		
		if(this.zeega) html +=
			"<div id='preview-close' class='player-overlay'><a href='#'><span class='zicon orange zicon-close' ></span></a></div>";
		
		
		html +=
		
			"<div id='preview-left' class='hidden preview-nav-arrow preview-nav'>"+
				"<div class='arrow-background'></div>"+
					"<img  height='75' width='35' src='"+ sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'images/mediaPlayerArrow_shadow.png' +"'>"+
				"</div>"+
				"<div id='preview-right' class='hidden preview-nav-arrow preview-nav'>"+
					"<div class='arrow-background'></div>"+
					"<img height='75' width='35' src='"+ sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'images/mediaPlayerArrow_shadow.png' +"'>"+
				"</div>"+
				"<div id='preview-media'></div>"+
				"<div id='citation' class='player-overlay'><ul class='clearfix'></ul></div>"+
			"</div>"+
		"";
		
		return html;
	},
	
	getCitationTemplate : function()
	{
		var html =
		
		'<li class="clearfix">'+
			'<div class="citation-tab">'+
				'<span class="zicon grey zicon-<%= type %>"></span>'+
			'</div>'+
			'<div class="citation-content hidden">'+
				'<div class="citation-thumb"><img width="100%" height="100%" src="<%= imgUrl %>"/></div>'+
				'<div class="citation-body">'+
					'<div class="citation-title"><%= title %></div>'+
					'<div class="citation-metadata"><a href="<%= trackback %>" target="blank">Link to original</a></div>'+
				'</div>'+
			'</div>'+
		'</li>';
		return html;
	}
		
})

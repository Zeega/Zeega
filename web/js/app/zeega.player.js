/*---------------------------------------------


	Object: Player
	The Zeega project web player. Part of Core.


	ideas:
	master list of layers/frames - loading/loaded to check against

---------------------------------------------*/

// This contains the module definition factory function, application state,
// events, and the router.
this.zeegaPlayer = {
	// break up logical components of code into modules.
	module: function()
	{
		// Internal module cache.
		var modules = {};
		// Create a new module reference scaffold or load an existing module.
		return function(name) 
		{
			// If this module has already been created, return it.
			if (modules[name]) return modules[name];
			// Create a module and save it under this name
			return modules[name] = { Views: {} };
		};
	}(),

  // Keep active application instances namespaced under an app object.
  app: _.extend({
	
	mode : 'standalone',
	
	initialize : function( data, initialState )
	{
		var _this = this;
		var initial = initialState || {};
		this.mode = initial.mode;

		this.parseProject(data);
		_.defaults( initial, { frameID:this.project.sequences.at(0).frames.at(0).id, mode: 'standalone' })

		console.log('%%		start player at', initial)

		this.project.renderPlayer();

		if( this.mode != 'editor' ) this.startRouter();
		else this.project.goToFrame( initial.frameID );

		if( this.mode != 'editor' ) this.fsCheck = setInterval(function(){
			//if( _this.project.playerView.$el.width() == 0 ) _this.exit();
		},500);
	},
	
	parseProject : function(data)
	{
		this.data = data;
		var Player = zeegaPlayer.module('player');
		this.project = new Player.ProjectModel( data );
		this.project.load();
		console.log('$$		project parsed', this, this.project);
	},
	
	exit : function()
	{
		var _this = this;

		if( this.mode != 'editor') clearInterval(this.fsCheck);

		if(document.exitFullscreen)					document.exitFullscreen();
		else if (document.mozCancelFullScreen)		document.mozCancelFullScreen();
		else if (document.webkitCancelFullScreen)	document.webkitCancelFullScreen();

		// remove the player div
		this.project.unrenderPlayer();

		if(this.mode == 'editor') zeega.app.restoreFromPreview( );
		return false;
	},

	startRouter: function()
	{
		var _this = this;
		var Router = Backbone.Router.extend({

			routes : {
				'' : 'goToFirstFrame',
				'frame/:frameID' : 'goToFrame'
			},
			goToFirstFrame : function()
			{
				_this.project.goToFrame( _this.project.sequences.at(0).frames.at(0).id );
			},
			goToFrame : function( frameID )
			{
				_this.project.goToFrame(frameID);
			}

		});
		this.router = new Router();
		Backbone.history.start();
	},
	
	
	
}, Backbone.Events)


};


(function(Player){

	/*		MODELS		*/

	Player.ProjectModel = Backbone.Model.extend({
		
		editor : true,
		PRELOAD_ON_SEQUENCE : 2, // will preload n frames ahead/behind in sequence
		DELAY_AFTER_LOAD : 1000,

		initialize : function()
		{
			var Layer = zeega.module('layer');
			var layerArray = [];
			_.each( this.get('layers'), function( layerData ){
				var layer = new Layer[layerData.type]( layerData, {player:true} );
				layer.id = parseInt(layer.id);
				layerArray.push( layer );
			});

			this.layers = new Player.LayerCollection( layerArray );
			this.frames = new Player.FrameCollection( this.get('frames') );
			this.sequences = new Player.SequenceCollection( this.get('sequences') );
			this.unset('sequences');
			this.unset('frames');
			this.unset('layers');
			
		},
		
		load : function()
		{
			//	call the verify functions on the sequences and frames to make sure there is no bad data
			this.sequences.load();
			this.frames.load();
		},
		
		renderPlayer : function()
		{
			var Player = zeegaPlayer.module('player');
			this.playerView = new Player.View({model:this});
			$('body').prepend( this.playerView.render().el );
		},
		
		unrenderPlayer : function()
		{
			var _this = this;
			this.currentFrame.unrender();
			this.playerView.$el.fadeOut( 450, function(){ _this.playerView.remove() });
		},
		
		navigateToFrame : function()
		{

		},

		goToFrame : function( frameID )
		{
			console.log('$$		go to frame:',frameID)
			this.cancelFrameAdvance();
			if(this.currentFrame) this.currentFrame.unrender( frameID );

			var frame = this.frames.get(frameID);
			
			if(frame.status == 'waiting')
			{
				frame.on('ready',this.renderFrame, this);
				frame.renderLoader();
			}
			else if( frame.status = 'ready')
			{
				this.renderFrame( frameID );
			}
			else if(frame.status == 'loading' && frame.isLoaded())
			{
				frame.onFrameLoaded();
				this.renderFrame( frameID );
			}
			
			this.preloadFrames(frame);

			if(zeegaPlayer.app.mode != 'editor') zeegaPlayer.app.router.navigate('frame/'+ frameID );
			this.currentFrame = frame;
		},
		
		preloadFrames : function(fr)
		{
			var _this = this;
			_.each( fr.framesToPreload, function(frameID){
				var frame = _this.frames.get(frameID);
				if(frame.status == 'waiting') frame.preload();
			})
		},
		
		renderFrame : function(frameID)
		{
			var frame = this.frames.get(frameID);
			var fromFrameID = this.currentFrame ? this.currentFrame.id : frameID;
			frame.render( fromFrameID );
			this.setFrameAdvance( frameID );
		},
		
		goLeft : function()
		{
			if( this.currentFrame.before ) this.goToFrame( this.currentFrame.before );
		},
		
		goRight : function()
		{
			if( this.currentFrame.after ) this.goToFrame( this.currentFrame.after );
		},

		/*
			play and pause layer media
			also will pick up and reset the timer for layers that have advance attributes set.
		*/
		playPause : function()
		{
			if( this.timer )
			{
				var _this = this;
				if(this.currentFrame.isPlaying)
				{

					this.cancelFrameAdvance();
					var now = new Date();
					var et = new Date( now - this.timerStarted );
					this.elapsedTime += et.getTime();
				}
				else
				{
					var remainingTime = this.currentFrame.get('attr').advance - this.elapsedTime;
					this.timerStarted = new Date(); 
					this.timer = setTimeout( function(){ _this.goRight() },remainingTime )
				}
			}
			this.currentFrame.playPause();
		},
		
		setFrameAdvance : function( id )
		{
			var frame = id ? this.frames.get(id) : this.currentFrame;

			if(this.timer) clearTimeout( this.t )
			var adv = frame.get('attr').advance;
			if( adv > 0) //after n milliseconds
			{
				var _this = this;
				this.autoAdvance = true;
				this.elapsedTime = 0;
				this.timerStarted = new Date(); 
				this.timer = setTimeout( function(){ _this.goRight() },adv )
			}
			else this.autoAdvance = false;

		},
		
		cancelFrameAdvance : function()
		{
			if(this.timer) clearTimeout( this.timer );
		}
		
	});
	
	
	
	Player.SequenceModel = Backbone.Model.extend({
		
		initialize : function()
		{
		},
		
		load : function()
		{
			var _this = this;
			this.verify();
			var frameModels = _.map( this.get('frames'), function(frameID){
				var frame = zeegaPlayer.app.project.frames.get(frameID);
				
				var index = _.indexOf( _this.get('frames'), frameID );
				
				var before = index > 0 ? _this.get('frames')[index-1] : null;

				var after = null;
				if( index + 1 < _this.get('frames').length )
				{
					after = _this.get('frames')[index+1]
				}
				else if( index + 1 >= _this.get('frames').length && frame.get('attr').advance > 0 )
				{
					after = _this.get('frames')[0];
				}

				//var after = index+1 < _this.get('frames').length ? _this.get('frames')[index+1] : null;
				
				frame.setPosition(index, before, after);
				return frame;
			});
			this.frames = new Player.FrameCollection( frameModels );
		},
		
		verify : function()
		{
			//	make sure all referenced frames are valid
			var brokenFrames = _.map( this.get('frames'), function(frameID){ 
				if( _.isUndefined( zeegaPlayer.app.project.frames.get(frameID) ) ) return frameID;
			});
			if( _.compact(brokenFrames).length )
			{
				var frameArray = _.without( this.get('frames'), _.compact(brokenFrames) );
				this.set('frames', frameArray)
			}
		}
	});
	
	
	
	Player.FrameModel = Backbone.Model.extend({
		
		PRELOAD_ON_SEQUENCE : 2,
		status : 'waiting',
		
		initialize : function()
		{
			this.on('layer_ready', this.onLayerLoaded, this);
		},
		
		preload : function()
		{
			var _this = this;
			this.status = 'loading';

			// preload layers
			_.each( _.toArray(this.layers), function(layer){
				if(layer.status == 'waiting')
				{
					$('#preview-media').append( layer.visual.render().el );
					layer.on('ready', _this.onLayerReady, _this);
					layer.on('error', _this.onLayerError, _this);

					layer.status = 'loading';
					layer.trigger('player_preload');
				}
			})
		},
		
		onLayerReady : function(id)
		{
			var layer = this.layers.get(id);
			layer.off('ready');
			layer.status = 'ready'; // move this to the layer model?

			this.loaderView.onLayerUpdate( id, 'ready' );

			if( this.isLoaded() ) this.onFrameLoaded();
		},

		onLayerError : function(id)
		{
			var layer = this.layers.get(id);
			layer.off('error');

			this.loaderView.onLayerUpdate( id, 'error' );

			layer.status = 'error'; // move this to the layer model?
			if( this.isLoaded() ) this.onFrameLoaded();
		},

		onFrameLoaded : function()
		{
			this.status = 'ready';
			this.trigger('ready',this.id);
		},

		playPause : function()
		{
			this.isPlaying = !this.isPlaying;
			_.each( _.toArray(this.layers), function(layer){
				layer.visual.playPause();
			})
		},

		isLoaded : function()
		{
			var statusArray = _.map(_.toArray(this.layers),function(layer){ return layer.status });
			if( _.include(statusArray,'loading') || _.include(statusArray,'waiting') ) return false;
			else return true;
		},

		render : function( fromFrameID )
		{
			var _this = this;
			this.isPlaying = true;

			// display citations
			$('#citation-tray').html( this.citationView.render().el );
			
			// update arrows
			this.updateArrows();
			
			var layersToRender = _.map(this.get('layers'), function(layerID){
				var layer = _this.layers.get(layerID);
				if(layer.get('type') != 'Link' || layer.get('attr').from_frame == _this.id) return layerID;
				else return false;
			});

			var newLayersToRender = _.difference( _.compact(layersToRender),this.commonLayers[fromFrameID] );
			// draw and update layer media

			_.each( layersToRender, function(layerID, z){
				var layer = _this.layers.get(layerID);
				console.log('------- layer', layer);
				if( _.contains(newLayersToRender, layerID) ) layer.trigger('player_play', z );
				else layer.visual.updateZIndex( z );
			});
		},

		unrender : function( toFrameID )
		{
			var _this = this;
			this.isPlaying = false;

			var layersToUnrender = _.without( this.get('layers'), this.commonLayers[toFrameID] );
			_.each( layersToUnrender, function(layerID){
				_this.layers.get( layerID ).trigger('player_exit');
			})
		},

		renderLoader : function()
		{
			$('#loader-tray').html( this.loaderView.render().el );
		},
		
		load : function()
		{
			this.verify();
			var layerModels = _.map( this.get('layers'), function(layerID){ return zeegaPlayer.app.project.layers.get(layerID) });
			this.layers = new Player.LayerCollection( layerModels );

			if( this.layers.length == 0 ) this.status = 'ready';

			// determine and store connected and linked frames
			this.getLinks();
			// determine and store arrow state for frame (l, r, lr, none)
			this.setArrowState();

			// make and store loader view
			// make and store citations
			this.setViews();

			// determine and store persistent layers in and out of linked frames
		},
		
		verify : function()
		{
			//	make sure all referenced layers are valid
			var brokenLayers = _.map( this.get('layers'), function(layerID){
				var layer= zeegaPlayer.app.project.layers.get(layerID);
				
				// remove missing layers and link layers with bad data
				if( _.isUndefined( layer ) ) return layerID;
				else if( layer.get('type') == 'Link')
				{
					var fromFrame = layer.get('attr').from_frame;
					var toFrame = layer.get('attr').to_frame;
					if( _.isUndefined( fromFrame ) && _.isUndefined( toFrame ) ) return layerID;
					else if( _.isUndefined( zeegaPlayer.app.project.frames.get(fromFrame)) || _.isUndefined( zeegaPlayer.app.project.frames.get(toFrame)) ) return layerID;
				}
			});
			if( _.compact(brokenLayers).length )
			{
				var frameArray = _.without( this.get('frames'), _.compact(brokenLayers) );
				this.set('layers', frameArray)
			}
			this.set('layers', _.uniq(this.get('layers'))); 
		},
		
		setPosition : function(index, before,after)
		{
			this.index = index;
			this.before = before;
			this.after = after;
		},

		setFramesToPreload : function()
		{
			var _this = this;
			this.framesToPreload = [this.id];
			var targetArray = [this.id];
			for( var i = 0 ; i < this.PRELOAD_ON_SEQUENCE ; i++)
			{
				_.each( targetArray, function(frameID){
					console.log('each', frameID,zeegaPlayer.app.project,zeegaPlayer.app.project.frames.get(frameID) )
					var before = zeegaPlayer.app.project.frames.get(frameID).before;
					var after = zeegaPlayer.app.project.frames.get(frameID).after;
					var linksOut = zeegaPlayer.app.project.frames.get(frameID).linksOut;
					var linksIn = zeegaPlayer.app.project.frames.get(frameID).linksIn;

					targetArray = _.compact([before,after]);
					_this.framesToPreload = _.union(_this.framesToPreload,targetArray,linksOut, linksIn);
				})
			}
			this.framesToPreload = _.uniq(this.framesToPreload);

			this.setCommonLayers();
		},

		// pre-determine common layers between this frame an all connected frames
		setCommonLayers : function()
		{
			var _this = this;
			this.commonLayers = {};
			_.each( this.framesToPreload, function(frameID){
				if( _this.id != frameID)
					_this.commonLayers[frameID] = _.intersection( _this.get('layers'), zeegaPlayer.app.project.frames.get(frameID).get('layers') );
			})
		},
		
		getLinks : function()
		{
			var _this = this;
			this.linksOut = [];
			this.linksIn = [];
			this.layers.each(function(layer){
				if( layer.get('type') == 'Link' && !_.isUndefined(layer.get('attr').from_frame) && !_.isUndefined(layer.get('attr').to_frame)  )
				{
					if( layer.get('attr').from_frame == _this.id ) _this.linksOut.push( layer.get('attr').to_frame );
					else if( layer.get('attr').to_frame == _this.id )
					{
						// remove from this layer's link array too
						var layerArray = _this.get('layers');
						_this.set({layers: _.without(layerArray,layer.id)});
						_this.layers.remove(layer);
						_this.linksIn.push( layer.get('attr').from_frame );
					}
				}
			})
		},
		
		setArrowState : function()
		{
			if( this.get('attr').advance > 0 ) this.arrowState = 'none'; // if auto advance is selected
			else
			{
				if( _.isNull(this.before) && _.isNull(this.after) ) this.arrowState = 'none'; // if only frame in the sequence
				else if( _.isNull(this.before) ) this.arrowState = 'r'; // if no frame before
				else if( _.isNull(this.after) ) this.arrowState = 'l'; // if no frame after
				else this.arrowState = 'lr';
			}
		},
		
		setViews : function()
		{
			this.citationView = new Player.CitationTrayView({model:this});
			this.loaderView = new Player.LoaderView({model:this});
		},
		
		updateArrows : function()
		{
			switch(this.arrowState)
			{
				case 'none':
					if( $('#preview-left').is(':visible') ) $('#preview-left').fadeOut('fast');
					if( $('#preview-right').is(':visible') ) $('#preview-right').fadeOut('fast');
					break;
				case 'r':
					if( $('#preview-left').is(':visible') ) $('#preview-left').fadeOut('fast');
					if( $('#preview-right').is(':hidden') ) $('#preview-right').fadeIn('fast');
					break;
				case 'l':
					if( $('#preview-left').is(':hidden') ) $('#preview-left').fadeIn('fast');
					if( $('#preview-right').is(':visible') ) $('#preview-right').fadeOut('fast');
					break;
				case 'lr':
					if( $('#preview-left').is(':hidden') ) $('#preview-left').fadeIn('fast');
					if( $('#preview-right').is(':hidden') ) $('#preview-right').fadeIn('fast');
					break;
			}
		},
		
		
	});
	
	
	
	/*		COLLECTIONS		*/

	Player.SequenceCollection = Backbone.Collection.extend({
		model : Player.SequenceModel,
		
		load : function(){ _.each( _.toArray(this), function(sequence){ sequence.load() }) }
	});
	
	
	
	Player.FrameCollection = Backbone.Collection.extend({
		model : Player.FrameModel,
		
		load : function()
		{
			_.each( _.toArray(this), function(frame){ frame.load() });
			_.each( _.toArray(this), function(frame){ frame.setFramesToPreload() });
		}
	});



	Player.LayerCollection = Backbone.Collection.extend({});



	/*		VIEWS		*/

	Player.View = Backbone.View.extend({
		
		isFullscreen : false,
		overlaysVisible : true,
		viewportRatio : 1.33333,

		id : 'zeega-player',
		
		render : function()
		{
			this.$el.html( _.template(this.getTemplate(), this.model.toJSON()) );

			this.resizePlayer();

			this.initEvents();
			return this;
		},
		
		initEvents : function()
		{
			var _this = this;
			$(window).bind( 'keydown', function(e){
			    switch(e.which)
				{
					case 27:
						if(_this.model.editor) _this.exit(); //don't close if standalone player
						break;
					case 8:
						if(_this.model.editor) _this.exit(); //don't close if standalone player
						break;
					case 37:
						if( _this.model.autoAdvance != true ) _this.goLeft();
						break;
					case 39:
						if( _this.model.autoAdvance != true ) _this.goRight();
						break;
					case 32:
						_this.playPause();
						break;
				}
			});


			//resize player on window resize
			window.onresize = function(event){ _this.resizePlayer(true) };

			//	fadeout overlays after mouse inactivity
			var fadeOutOverlays = _.debounce(function(){_this.fadeOutOverlays()},5000);
			//hide all controls and citation
			onmousemove = function()
			{
				if( _this.overlaysVisible ) fadeOutOverlays( _this );
				else _this.fadeInOverlays();
			}
			
		},

		resizePlayer : function( animate )
		{
			var animate = animate || false;
			var viewWidth = window.innerWidth;
			var viewHeight = window.innerHeight;

			var cssObj = {};
			if( viewWidth / viewHeight > this.viewportRatio )
			{
				cssObj = {
					height : viewHeight +'px',
					width : viewHeight * this.viewportRatio +'px',
					'font-size' : (viewHeight * this.viewportRatio / 520 ) +'em'
				}
			}else{
				cssObj = {
					height : viewWidth / this.viewportRatio +'px',
					width : viewWidth +'px',
					'font-size' : (viewWidth/520) +'em'
				}
				
			}
			//constrain proportions in player
			if(animate) this.$('#preview-media').clearQueue().animate( cssObj,500 );
			else this.$('#preview-media').clearQueue().css( cssObj );
		},
		
		fadeOutOverlays : function()
		{
			this.overlaysVisible = false;
			this.$el.find('.player-overlay').fadeOut('slow');
		},
		
		fadeInOverlays : function()
		{
			this.overlaysVisible = true;
			this.$el.find('.player-overlay').fadeIn('fast');
		},
		

		unsetListeners : function()
		{
			$(window).unbind( 'keydown' ); //remove keylistener
			onmousemove = null;
		},
		
		events : {
			'click #preview-close' : 'exit',
			'click #preview-left' : 'goLeft',
			'click #preview-right' : 'goRight',

			'click .fullscreen' : 'toggleFullscreen',
		},
		
		exit : function()
		{
			this.unsetListeners();
			if(this.isFullscreen) this.leaveFullscreen();
			zeegaPlayer.app.exit();
			return false;
		},
		
		goLeft : function(){ this.model.goLeft() },
		goRight : function(){ this.model.goRight() },
		
		playPause : function()
		{
			this.model.playPause();
		},

		toggleFullscreen : function()
		{
			if(this.isFullscreen) this.leaveFullscreen();
			else this.goFullscreen();
			return false;
		},

		goFullscreen : function()
		{
			this.isFullscreen = true;
			docElm = document.getElementById('zeega-player');
					
			if (docElm.requestFullscreen) docElm.requestFullscreen();
			else if (docElm.mozRequestFullScreen) docElm.mozRequestFullScreen();
			else if (docElm.webkitRequestFullScreen) docElm.webkitRequestFullScreen();

			this.$el.find('.zicon-go-fullscreen').removeClass('zicon-go-fullscreen').addClass('zicon-exit-fullscreen');
		},

		leaveFullscreen : function()
		{
			this.isFullscreen = false;
			if (document.exitFullscreen) 				document.exitFullscreen();
			else if (document.mozCancelFullScreen) 		document.mozCancelFullScreen();
			else if (document.webkitCancelFullScreen) 	document.webkitCancelFullScreen();

			this.$el.find('.zicon-exit-fullscreen').removeClass('zicon-exit-fullscreen').addClass('zicon-go-fullscreen');
		},

		getTemplate : function()
		{
			html =

				"<div class='player-header player-overlay'>";
				if( zeegaPlayer.app.mode != 'standalone' ) html +=
					"<a id='preview-close' class='close pull-right' href='' >&times;</a>";

				if( zeegaPlayer.app.mode != 'embed' ) html +=
					"<a href='#' class='fullscreen pull-right' target='blank'><i class='zicon-go-fullscreen'></i></a>";

				if( zeegaPlayer.app.mode != 'editor' )
				{
					html +=
					"<a href='https://twitter.com/intent/tweet?original_referer=http:"+ sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + sessionStorage.getItem('projectId')+"&text=Zeega%20Project%3A%20<%= title %> &url=http:"+ sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +  sessionStorage.getItem('projectId')+"' class='share-twitter pull-right' target='blank'><i class='zitem-twitter zitem-30 loaded'></i></a>"+
					"<a href='http://www.facebook.com/sharer.php?u=http:"+ sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + sessionStorage.getItem('projectId')+"' class='share-facebook pull-right' target='blank'><i class='zitem-facebook zitem-30 loaded'></i></a>";
				}
				html +=

				"</div>"+

				"<div class='player-zeega-icon player-overlay'><a href='"+ sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+ "user/<%= user_id %>' target='blank' class='zeega-user'><i class='zitem-zeega00 zitem-30 loaded'></i></a></div>"+

				"<div id='preview-left' class='hidden preview-nav-arrow preview-nav'>"+
					"<div class='arrow-background'></div>"+
					"<img class='player-arrow arrow-left' src='"+ sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'images/mediaPlayerArrow_shadow.png' +"'>"+
				"</div>"+
				"<div id='preview-right' class='hidden preview-nav-arrow preview-nav'>"+
					"<div class='arrow-background'></div>"+
					"<img class='player-arrow arrow-right' src='"+ sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'images/mediaPlayerArrow_shadow.png' +"'>"+
				"</div>"+
				"<div id='preview-media'></div>"+
				"<div id='loader-tray' class=''></div>"+
				"<div id='citation-tray' class='player-overlay'></div>";

			return html;
		}
	});



	Player.FrameView = Backbone.View.extend({
		
	});
	
	
	
	Player.CitationTrayView = Backbone.View.extend({
		tagName : 'ul',
		className : 'citation-list',
		
		render : function()
		{
			var _this = this;
			this.$el.empty();
			_.each( _.toArray(this.model.layers), function(layer){
				var citation = new Player.CitationView({model:layer});
				_this.$el.append( citation.render().el );
			})
			
			return this;
		}
		
	});
	

	Player.CitationView = Backbone.View.extend({
		
		tagName : 'li',

		render : function()
		{
			
			// need to add error state for icons!!
			console.log(this.model);
			this.$el.html( _.template( this.getTemplate(),this.model.toJSON()) );
			return this;
		},
		
		events : {
			'mouseover .citation-icon' : 'onMouseover',
			'mouseout .citation-icon' : 'onMouseout'
		},
		
		onMouseover : function()
		{
			if(this.model.status != 'error') this.$el.find('.citation-icon i').addClass('loaded');
			this.$el.find('.player-citation-bubble').show();
		},
		
		onMouseout : function()
		{
			this.$el.find('.citation-icon i').removeClass('loaded');
			this.$el.find('.player-citation-bubble').hide();
		},
		
		getTemplate : function()
		{
			
			var html =

				"<div class='player-citation-bubble clearfix hide'>"+
					"<div class='player-citation-content'>"+
						"<h3><%= attr.title %></h3>"+
						"<div class='content'><span class='citation-subhead'>DESCRIPTION:</span> <%= attr.description %></div>"+
						"<div class='creator'><span class='citation-subhead'>CREATED BY:</span> <%= attr.media_creator_realname %></div>";
						//"<div class='date-created'><span class='citation-subhead'>CREATED ON:</span> <%= attr.date_created %></div>";

					if( !_.isNull( this.model.get('attr').media_geo_longitude ) )
					{
						html += "<div class='location-created'><span class='citation-subhead'>LOCATION:</span> <%= attr.media_geo_longitude %>, <%= attr.media_geo_latitude %></div>";
					}
					html +=
						"<div class='trackback'><span class='citation-subhead'>click below to view original</span></div>"+
					"</div>"+
					"<div class='player-citation-thumb'><img src='<%= attr.thumbnail_url %>' height='100px' width='100px'/></div>"+
				"</div>";
			if(this.model.get('attr').archive =="Dropbox")	html+=	"<a href='<%= attr.attribution_uri %>' class='citation-icon' target='blank'><i class='zitem-<%= attr.media_type.toLowerCase() %> zitem-30'></i></a>";
			else if(!_.isUndefined(this.model.get('attr').archive )) html+=	"<a href='<%= attr.attribution_uri %>' class='citation-icon' target='blank'><i class='zitem-<% if( !_.isUndefined(attr.archive) ){ %><%= attr.archive.toLowerCase() %><% } %> zitem-30'></i></a>";
				
			return html;
		}
	});
	
	
	
	Player.LoaderView = Backbone.View.extend({
		
		className : 'progress-bar',
		loadedCount : 0,

		render : function()
		{
			var _this = this;
			this.$el.html( _.template(this.getTemplate(), zeegaPlayer.app.project.toJSON() ) );

			this.$el.find('.progress-types ul').empty();
			_.each( _.toArray(this.model.layers), function(layer){
				
				if( layer.displayCitation != false && layer.get('type') != 'Link' )
				{
					if(layer.get('attr').archive=="Dropbox") var itemType = layer.get('type').toLowerCase();
					else var itemType = ( layer.get('attr').archive) ? layer.get('attr').archive.toLowerCase() : layer.get('type').toLowerCase();
					
					_this.$el.find('.progress-types ul').append('<li class="layer-load-icon-'+ layer.id +'"><i class="zitem-'+ itemType +'"></i></li>')
				}
			})

			this.$el.find('.bar')
				.stop()
				.animate({width : 0.25/this.model.get('layers').length * 100 +'%' },200)
				.animate({width : 0.75/this.model.get('layers').length * 100 +'%' },100000)

			return this;
		},
		
		onLayerUpdate : function( layerID, status )
		{
			var _this = this;
			
			this.loadedCount++;
			if(status == 'ready') this.$el.find('.layer-load-icon-'+ layerID +' i').addClass('loaded');
			else this.$el.find('.layer-load-icon-'+ layerID +' i').addClass('error');
			
			$(this.el).find('.bar')
				.stop()
				.animate({width : this.loadedCount/this.model.get('layers').length * 100 +'%' },2000)
				.animate({width : this.loadedCount*1.5/this.model.get('layers').length * 100 +'%' },100000);
			
			if(this.model.isLoaded() ) this.fadeOut();
		},
		
		fadeOut : function()
		{
			var _this = this;
			$(this.el).fadeOut('slow', function(){ _this.remove() });
		},

		getTemplate : function()
		{
			html =
			
				"<div class='progress-head'>"+
					"<h3 class='estimate'>Estimated time to experience this project. . .</h3>"+
					"<h3 class='time'><%= estimated_time %></h3>"+
				"</div>"+
				"<div class='progress progress-striped active progress-danger'>"+
					"<div class='bar' style='width:0'></div>"+
				"</div>"+
				"<div class='progress-types'>"+
					"<ul></ul>"+
				"</div>";
			
			return html;
		}
	});

})(zeegaPlayer.module("player"));
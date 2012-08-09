/*---------------------------------------------


	Object: Player
	The Zeega project web player. Part of Core.


	ideas:
	master list of layers/frames - loading/loaded to check against

---------------------------------------------*/

var Player2 = Backbone.View.extend({
	
	MINIMUM_LOAD : 1,
	
	has_started : false,
	loadAheadDistance : 2,
	overlaysHidden : false,
	viewportRatio : 1.5,
	zeega : true,
	apiplayer : false,
	
	initialize: function(container,apiplayer)
	{
		this.model= new Backbone.Model();
		this.container = container;
		this.generateBackbone();
		if( _.isUndefined(zeega.app.router) ) this.zeega = false;
		if(!_.isUndefined(apiplayer)) this.apiplayer = apiplayer;
		var _this=this;
		if(!this.zeega)this.fsCheck=setInterval(function(){if(_this.container.width()==0) _this.closePlayer();},500);
	},
	
	loadProject : function( data, options )
	{
		this.data = data;
		//draw player to page
		this.container.prepend( this.render().el );
		//hide the editor underneath to prevent scrolling
		$(this.el).fadeIn();

		this.initListeners();
		
		//this.render();
		this.parseData( data );
		
		var s = ( _.isUndefined(options) || _.isUndefined(options.sequenceID) ) ? data.sequences[0].id : options.sequenceID;
		var f = ( _.isUndefined(options) || _.isUndefined(options.frameID) ) ? _.find(data.sequences, function(seq){return seq.id == s }).frames[0] : options.frameID;
		
		this.setCurrentSequence( s );
		this.setCurrentFrame( f );
		//this.setCurrentLayers();
		
		if( _.isUndefined(zeega.app.router) )
		{
			// if standalone player
			this.startRouter();
			this.updateTitle();
		}
		else
		{
			// if editor router exists
			this.router = zeega.app.router;
			this.goToFrame( this.currentFrame )
		}
		
	},
	

	closePlayer : function()
	{
		if(!this.zeega) clearInterval(this.fsCheck);
		var _this = this;
		
		if (document.exitFullscreen) {
		document.exitFullscreen();
		}
		else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
		}
		else if (document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen();
		}
		
		//unhide editor
		$('#wrapper').show();

		this.unsetListeners();
		
		_.each( _.toArray( this.currentSequence.layers ), function(layer){
			if( layer.rendered ) layer.trigger('player_unrender')
		});
		
		
		// remove the player div
		this.$el.fadeOut( 450, function(){ $(this).remove() });

		if(this.zeega) zeega.app.restoreFromPreview();
		return false;
	},
	
	loadProjectById : function(projectId, options)
	{
		//this.resetPlayer();
		var _this = this;
		this.model.on('sequences_loaded',function(){
			_this.render();
			_this.setCurrentSequence( _this.initial_s );
			_this.setCurrentFrame( _this.initial_f );
			_this.setCurrentLayers();
			
			_this.goToFrame( _this.currentFrame );
		});
		
		$.getJSON(sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +'api/projects/'+projectId,function(data){
			_this.sequences = new _this.Sequences(data.project.sequences);
		 	
		 	_this.initial_s = ( _.isUndefined(options) || _.isUndefined(options.sequenceID) ) ? data.project.sequences[0].id : options.sequenceID;
			_this.initial_f = ( _.isUndefined(options) || _.isUndefined(options.frameID) ) ? _.find(data.project.sequences, function(seq){return seq.id == _this.initial_s }).frames[0].id : options.frameID;
		 	_this.model.trigger('sequences_loaded');
		 });
		
	},
	
	startRouter: function()
	{
		var _this = this;
		var Router = Backbone.Router.extend({
			
			routes: {
				"" : 'goToCurrentFrame',
				"player/sequence/:sequenceID/frame/:frameID"	: "goToSequenceFrame",
			},
			
			goToSequenceFrame : function( sequenceID, frameID ){ _this.goToSequenceFrame(sequenceID,frameID) },
			goToCurrentFrame : function(){ _this.goToFrame( _this.currentFrame ) }
			
		});
		this.router = new Router();
		Backbone.history.start();
	},
	
	updateTitle : function()
	{
		$('title').html(this.data.title)
	},
	
	/*****************************
	
	PLAYER FUNCTIONS
	
	*****************************/
	
	goToSequenceFrame : function( sequenceID, frameID )
	{
		this.currentSequence = this.sequences.get( sequenceID );
		this.goToFrame( this.frames.get(frameID) )
	},
	
	goToFrame : function( frame )
	{
		this.loadAhead();
		
		this.clearStage( frame );
		
		//if the frame is already loaded, then render the frame to the player!
		if( frame.status == 'ready')
		{
			this.renderFrame(frame.id );
		}
		// if the frame is not loaded yet, then apply a listener for when it is ready and THEN render the frame to the player
		else
		{
			var _this = this;
			
			frame.on('ready', function(){
				frame.off('ready');
				
				if( !_this.has_played )
				{
					setTimeout( function(){
						frame.loader.fadeOut();
						_this.startTimer = setTimeout( function(){ _this.renderFrame( frame.id); _this.has_played = true; }, 1000);
					}, this.MINIMUM_LOAD);
					
				}
				else
				{
					_this.renderFrame( frame.id);
				}
			});
		}
		//update the url
		//this.router.navigate('player/sequence/'+ this.currentSequence.id +'/frame/'+ frame.id);
		//load the frames around the frame in question
		
	},
	
	/*
		remove any rendered layers that should no longer be in view
	*/
	clearStage : function( frame )
	{
		
		if(this.currentFrame.id != frame.id)
		{
			var _this = this;
			var oldLayers = this.currentFrame.get('layers');
			var newLayers = frame.get('layers');
			
			//remove only the non-common layers. This allows for seamless persistence of layers
			var removeLayers = _.difference(oldLayers, newLayers);
			
			_.each( removeLayers, function( layerID ){
				
				_this.layers.get( layerID ).trigger('player_exit')
			})
		}
	},
	
	renderFrame : function( id )
	{
		
		var _this = this;
		var frame = this.frames.get(id);
		this.currentFrame = frame;
		_.each( frame.get('layers'), function(layerID,i){
			var layer = _this.layers.get( layerID );
			if( layer.get('type') == 'Link' && _.isUndefined(_this.frames.get( layer.get('attr').to_frame )) ) return false;
			else _this.layers.get( layerID ).trigger('player_play',i+1);
		})
		this.setAdvance( frame.get('attr').advance )
		this.updateCitations();
		this.updateArrows();
	},
	
	loadAhead : function()
	{
		
		
		//find the frame you're coming from and where it is in the order
		var frameOrder = this.currentSequence.get('frames') || _.pluck( _.toArray(this.currentSequence.frames), 'id' );
		this.currentSequence.set('frames',frameOrder);
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
				var frame = this.frames.get( frameID );
				this.preloadFrame( frame );
			}	
		}
	},
	
	preloadFrame : function( frame )
	{
		var _this = this;
		
		if(this.currentFrame == frame) $('#zeega-player').prepend( frame.loader.render().el );
		
		var linkedFrameLayers = [];
		
		
		
		_.each(frame.links, function(frameID){
			var f = _this.frames.get(frameID);
			if( f )
			{
				linkedFrameLayers = _.union( _this.frames.get(frameID).get('layers'), linkedFrameLayers );
				f.trigger('loading', frame.id);
			}
		})
		
		//
		
		_.each( _.union(linkedFrameLayers,frame.get('layers')), function(layerID){
			var layer = _this.layers.get( layerID );
			if( layer.status != 'loading' && layer.status != 'ready' && layer.status != 'error' )
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
	
	setAdvance : function( adv )
	{
		var _this = this;
		
		if(this.t) clearTimeout( this.t )
		
		if(adv > 0) //after n seconds
		{
			adv = adv < 1 ? 1 : adv;
			this.t = setTimeout( function(){ _this.goRight() },adv )
			
		}
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
		var frameOrder = this.currentSequence.get('frames');
		var index = _.indexOf( frameOrder, this.currentFrame.id );
				
		if( index - step < 0 ) return false;
		else return this.frames.get( frameOrder[index-step] );
	},
	
	getRight : function( step )
	{
		step = step || 1;
		var frameOrder = this.currentSequence.get('frames');
		var index = _.indexOf( frameOrder, this.currentFrame.id );

		return this.frames.get( frameOrder[index+step] ) || false;
	},
	
	updateCitations : function()
	{
		var _this = this;
		var Citation = Backbone.View.extend({
			
			tagName : 'li',
			
			render : function()
			{
				var error = this.model.status == 'error' ? 'error' : '';
				this.model.get('attr').description = $(this.model.get('attr').description).text(); //escape html so it doesn't kill the css!!!
				$(this.el).html( _.template(this.getTemplate(), _.extend(this.model.attributes,{error:error}) ) ).attr('id','player-citation-'+ this.model.id);
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
				if(this.model.get('attr').archive =="Dropbox")	html+=	"<a href='<%= attr.attribution_uri %>' class='citation-icon' target='blank'><i class='zitem-<%= attr.media_type.toLowerCase() %> zitem-30 <%= error %>'></i></a>";
				else html+=	"<a href='<%= attr.attribution_uri %>' class='citation-icon' target='blank'><i class='zitem-<%= attr.archive.toLowerCase() %> zitem-30 <%= error %>'></i></a>";
					
				return html;
			}
		});
		
		this.$el.find('#citation ul').empty();
		_.each( this.currentFrame.get('layers'), function(layerID){
			var layer = _this.layers.get( layerID );
			
			if( !layer.citation && layer.displayCitation ) layer.citation = new Citation({model:layer});
			
			if( layer.citation )
			{
				layer.citation.render();
				layer.citation.delegateEvents();
				_this.$el.find('#citation ul').append( layer.citation.el );
			}
		})
	},
	

	/*****************************
	
	VIEW FUNCTIONS
	
	*****************************/
	
	render : function()
	{
		//get the current viewport resolution
		if(this.apiplayer){
			var viewWidth = this.container.width();
			var viewHeight = this.container.height();
		}
		else{
			var viewWidth = window.innerWidth;
			var viewHeight = window.innerHeight;
		}
		var cssObj = {};
		if( viewWidth / viewHeight > this.viewportRatio )
		{
			cssObj.height = viewHeight +'px';
			cssObj.width = viewHeight * this.viewportRatio +'px'
			cssObj.fontSize = (viewHeight / 519 *100) +"%";
		}else{
			cssObj.height = viewWidth / this.viewportRatio +'px';
			cssObj.width = viewWidth +'px'
			cssObj.fontSize = (viewWidth / 704 *100) +"%";
		}
		
		//constrain proportions in player
		
		
		
		$(this.el).attr('id','preview-wrapper').append( this.getTemplate() );
		$(this.el).find('#preview-media').css( cssObj );
		
		return this;
	},
	
	/*****************************
	
	EVENT FUNCTIONS
	
	*****************************/
	
	updateArrows : function()
	{
		//prevent arrows from being shown on timed layers
		if( _.isUndefined(this.currentFrame.get('attr').advance) || this.currentFrame.get('attr').advance <= 0 )
		{
			
			var leftFrame = this.getLeft();
			var rightFrame = this.getRight();
		
			if( this.currentSequence.get('frames').length < 2 )
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
		}
		else
		{
			
			this.$el.find('#preview-left').hide();
			this.$el.find('#preview-right').hide();
		}
		
	},

	fadeOutOverlays : function( _this )
	{
		_this.overlaysHidden = true;
/*		
		$('.player-overlay').fadeOut('slow');
		$('.preview-nav').fadeOut('slow');
		
		$('#citation').animate({ height : '24px' });
		$('.citation-content').hide();
*/		
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
		
		if(!this.apiplayer){
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
			_this.$el.find('#preview-media').clearQueue().animate( cssObj,500 );
			
		}
		
		}
		
		$('#zeega-player').keydown(function(event) {
			
		});
		
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
		this.sequences = new this.Sequences( data.sequences );
		
		var Layer = zeega.module('layer');
		var layerArray = [];
		_.each( data.layers, function( layerData ){
			var layer = new Layer[layerData.type]( layerData, {player:true} );
			layer.id = parseInt(layer.id);
			layerArray.push( layer );
		});
		
		this.layers = new this.LayerCollection( layerArray );
		this.frames = new this.FrameCollection( data.frames );
		
		this.verifyData();
		
		this.frames.addFrameLoadersAndConnections();
		this.layers.on( 'ready error', this.updateFrameStatus, this );
		//this.layers.on( 'error', this.updateFrameStatusError, this );

		this.model.trigger('sequences_loaded');
	},
	
	verifyData : function()
	{
		var _this = this;
		_.each( _.toArray(this.sequences), function(sequence){
			_.each( sequence.get('frames'), function(frameid){
				var frame = _this.frames.get(frameid);
				if( _.isUndefined(frame) ) sequence.set({'frames':_.without(sequence.get('frames'),frameid)});
				else
				{
					_.each( frame.get('layers'), function(layerid){
						var layer = _this.layers.get(layerid);
						if( _.isUndefined(layer) ) frame.set({'layers':_.without(frame.get('layers'),layerid)});
					})
				}
				
			})
		})
	},
	
	setCurrentSequence : function( id )
	{
		this.currentSequence = this.sequences.get(id);
	},
	
	setCurrentFrame : function( id )
	{
		this.currentFrame = this.frames.get(id)
	},

	
	updateFrameStatus : function( layerID )
	{
		var __this = this;
		
		_.each( _.toArray(this.frames), function(frame){
			var frameLayers = frame.get('layers');
			var readyLayers = __this.layers.ready;
			var errorLayers = __this.layers.error

			if(_.include( frameLayers, layerID) ) frame.loader.incrementLoaded( layerID, __this.layers.get(layerID).status );
			if( _.difference(frameLayers, readyLayers, errorLayers ).length == 0 )
			{
				
				frame.trigger('ready', frame.id);
			}
		})
	},

	/*****************************
	
	BACKBONERS
	
	*****************************/
	
	
	generateBackbone : function()
	{
		var _this = this;
		
		var LayerModel = Backbone.Model.extend();
		var FrameModel = Backbone.Model.extend();
		
		var loaderView = Backbone.View.extend({
			
			className : 'progress-bar',
			loadedCount : 0,
			
			initialize : function(){},
			
			render : function()
			{
				var _view = this;
				$(this.el).css('z-index',100000)
				if(this.model.get('layers').length>0)
				{
					
					$(this.el).append( _.template(this.getTemplate(), _this.data) );
					
					this.$el.find('.progress-types ul').empty();
					_.each(this.model.get('layers'), function(layerID){
						var layer = _this.layers.get(layerID);
						
						
						if( layer.displayCitation != false && layer.get('type') != 'Link' )
						{
							if(layer.get('attr').archive=="Dropbox") var itemType = layer.get('type').toLowerCase();
							else var itemType = ( layer.get('attr').archive) ? layer.get('attr').archive.toLowerCase() : layer.get('type').toLowerCase();
							
							
							_view.$el.find('.progress-types ul').append('<li class="layer-load-icon-'+ layer.id +'"><i class="zitem-'+ itemType +'"></i></li>')
						}
					})
					
					$(this.el).find('.bar')
						.stop()
						.animate({width : 0.25/this.model.get('layers').length * 100 +'%' },200)
						.animate({width : 0.75/this.model.get('layers').length * 100 +'%' },100000)
					
				}
				
				return this;
			},
			
			incrementLoaded : function( layerID, status )
			{
				var _this = this;
				this.loadedCount++;
				if(status != 'error') this.$el.find('.layer-load-icon-'+ layerID +' i').addClass('loaded');
				else this.$el.find('.layer-load-icon-'+ layerID +' i').addClass('error');
				
				$(this.el).find('.bar')
					.stop()
					.animate({width : this.loadedCount/this.model.get('layers').length * 100 +'%' },2000)
					.animate({width : this.loadedCount*1.5/this.model.get('layers').length * 100 +'%' },100000);
				
				if(this.model.get('layers').length == this.loadedCount) this.fadeOut();
			},
			
			fadeOut : function()
			{
				var _view = this;
				$(this.el).fadeOut('show', function(){ _view.remove() });
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
				
				/*
					'<div class="loader">'+
						'<div class="progress"></div>'+
					'</div>'+
					'<div class="loader-text">loaded <span class="loaded-count">0</span> out of <span class="total-count"><%= layers.length %></span> items</div>';
				*/
				return html;
			}
		})
		
		this.LayerCollection = Backbone.Collection.extend({
			
			loading : [],
			ready : [],
			error : [],
			
			initialize : function()
			{
				this.on('loading', this.updateLoadingStatus, this);
				this.on('ready', this.updateReadyStatus, this);
				this.on('error', this.updateErrorStatus, this);
			},
			updateLoadingStatus : function( id )
			{
				var model = this.get(id);
				if( model.status != 'loading' && model.status != 'ready')
				{
					model.status = 'loading';
					this.loading.push(id)
					//
					//
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
					//
					//
				}
			},
			updateErrorStatus : function( id )
			{
				var model = this.get(id);
				if( model.status != 'loading' && model.status != 'ready')
				{
					this.loading = _.without(this.loading,id);
					model.status = 'error';
					this.error.push(id);
				}
			}
			
		});
		
		this.FrameCollection = this.LayerCollection.extend({
			
			addFrameLoadersAndConnections : function()
			{
				// add a loader view to each frame
				_.each( _.toArray(this), function(frame){
					frame.loader = new loaderView({model: frame });
					var links = [];
					_.each( frame.get('layers'), function(layerID){
						var layer = _this.layers.get(layerID);
						if( layer && layer.get('type')=='Link' && layer.get('attr').from_frame == frame.id)
							links.push( layer.get('attr').to_frame )
					})
					//
					frame.links = links;
				})
			}
			
		})
		
		
		var SequenceModel = Backbone.Model.extend({

			initialize : function()
			{
				this.parseData();
			},
			
			parseData : function()
			{
			},
			
			updateFrameStatus : function( layerID )
			{
				var __this = this;
				
				_.each( _.toArray(this.frames), function(frame){
					var frameLayers = frame.get('layers');
					var readyLayers = __this.layers.ready;

					if(_.include( frameLayers, layerID) ) frame.loader.incrementLoaded();
					if( _.difference(frameLayers,readyLayers).length == 0 )
					{
						frame.trigger('ready', frame.id);
					}
				})
			}
			
		});
		
		
		this.Sequences = Backbone.Collection.extend({

			model : SequenceModel,

			initialize : function(){}

		});
	},
	
	
	/*****************************
	
	TEMPLATES
	
	*****************************/
	
	getTemplate : function()
	{
		html =
		"<div id='zeega-player'>"+
			"<div class='player-header'>";
				//"<a href='http://www.zeega.org/' target='blank' class='player-logo'><img src='"+ sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+"images/z-logo-128.png' height='60px' /></a>";
			if(this.zeega||true) html +=
				"<a id='preview-close' class='close pull-right' href='' >&times;</a>";

			if( !this.zeega )
			{
				html +=
				"<a href='https://twitter.com/intent/tweet?original_referer="+ sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + this.data.id +"&text=Zeega%20Project%3A%20"+ this.data.title +"&url="+ sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + this.data.id +"' class='share-twitter pull-right' target='blank'><i class='zitem-twitter zitem-30 loaded'></i></a>"+
				"<a href='http://www.facebook.com/sharer.php?u="+ sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + this.data.id +"' class='share-facebook pull-right' target='blank'><i class='zitem-facebook zitem-30 loaded'></i></a>";
			}
			html +=
			
			"</div>"+
			
			"<div class='player-zeega-icon'><a href='"+ sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+ "user/"+ this.data.user_id +"' target='blank' class='zeega-user'><i class='zitem-zeega00 zitem-30 loaded'></i></a></div>"+
			
		
			"<div id='preview-left' class='hidden preview-nav-arrow preview-nav'>"+
				"<div class='arrow-background'></div>"+
				"<img class='player-arrow arrow-left' src='"+ sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'images/mediaPlayerArrow_shadow.png' +"'>"+
			"</div>"+
			"<div id='preview-right' class='hidden preview-nav-arrow preview-nav'>"+
				"<div class='arrow-background'></div>"+
				"<img class='player-arrow arrow-right' src='"+ sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'images/mediaPlayerArrow_shadow.png' +"'>"+
			"</div>"+
			"<div id='preview-media'></div>"+
				"<div id='citation' class='player-overlay'><ul class='citation-list unstyled'></ul></div>";
		
		return html;
	}
		
})
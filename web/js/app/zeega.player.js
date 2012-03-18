/*---------------------------------------------


	Object: Player
	The Zeega project web player. Part of Core.


	ideas:
	master list of layers/frames - loading/loaded to check against

---------------------------------------------*/

var Player = {
	
	lookahead : 2, // number of frames to preload ahead/behind
	isFirstFrame : true,
	
	viewportRatio : 1.5,
	
	currentSequence : null,
	currentFrame : null,
	
	loadingFrames : [],
	loadedFrames : [],
	loadingLayers : [],
	loadedLayers : [],
	layersOnStage : [],
	
	overlaysHidden : false,
	paused: false,
	
	/*
		Method: init
		Initializes the player object
		
		Parameters:
			
			data - A Zeega data object in JSON.
			sequence - The sequence index of the starting frame.
			frameID - The id of the starting frame.
	
	*/
	init : function( data, sequenceID, frameID, launchedFromEditor )
	{
		console.log('Zeega Player Initialized');

		var _this = this;
				
		//test to see if Zeega is installed
		if( launchedFromEditor )
		{
			this.zeega = true;
			zeega.app.previewMode = true;
		}
		
		this.removeAllVideoElements();
		
		//remove panel ghosts
		$('.x-panel-ghost ').remove();
		
		
		//if the data passed in is a string, then parse it into an object
		if( _.isString( data) ) this.data = $.parseJSON(data);
		else this.data = data;
		
		this.parseData();
		
		$('title').html(this.data.project.title);
		
		//set the current sequence
		if( sequenceID ) this.currentSequence = this.getSequence( sequenceID ); // if set, it should keep the sequence id
		else this.currentSequence = this.data.project.sequences[0]; // default to first sequence if unset

		//set the current frame
		var currentFrameID;
		if( !frameID ) currentFrameID = this.currentSequence.frameOrder[0];
		else currentFrameID = frameID;
		
		//this.parseProject;
		this.draw();
		this.setListeners();
		
		this.gotoFrame( currentFrameID );
	},
	
	parseData : function()
	{
		var _this = this;
		this.data.layers = {
			all : [],
			loading : [],
			ready : []
		};
		this.data.frames = {
			all : [],
			loading : [],
			ready : []
		};
		_.each( this.data.project.sequences, function(sequence){
			_this.data.layers.all = _.pluck( sequence.layers, 'id');
			_this.data.frames.all = _.pluck( sequence.frames, 'id');
		});
	},
	
	/*
		Method: draw
		Draws the player dom object into the browser window
	*/
	draw : function()
	{
		//add the player div
		this.displayWindow = $(this.getTemplate());
		$('body').append( this.displayWindow );
		$('.preview-nav-arrow').find('img').attr('src',sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'images/mediaPlayerArrow_shadow.png');
		
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
		this.displayWindow.find('#preview-media').css( cssObj );
		
		//hide the editor underneath to prevent scrolling
		$('#wrapper').hide();
		
		//Zeega.clearCurrentFrame();
		
		this.displayWindow.fadeIn();
		
		//disabled during dev work
		//document.getElementById('zeega-player').webkitRequestFullScreen();
	},
	
	/*
		Method: close
		Removes the player from the dom
	*/
	close : function()
	{
		//unhide editor
		$('#wrapper').show();
		
		//document.webkitCancelFullScreen();
		
		console.log('Zeega Player Close');
		var _this = this;
		
		this.unsetListeners();
		
		//turn off/pause all media first
		_.each(this.layersOnStage, function(layerID){
			_this.getLayer(layerID).layerClass.stash();
		});
		
		
		// remove the player div
		this.displayWindow.fadeOut( 450, function(){
			_this.removeAllVideoElements();
			_this.reset();
			//All video elements must be removed prior to removing the zeega player dom element
			$(this).remove(); 
		}); 
		
		if(this.zeega)
		{
			//turn off previewMode
			zeega.app.previewMode = false;
			//go to the frame last viewed in the player
			//Zeega.loadFrame( Zeega.sequence.frames.get( this.currentFrame.id ) );
		}
	},
	
	/*
		Method: removeAllVideoElements
		Removes all video sources and elements in an attempt to stop loading and help resolve conflicts
	*/
	removeAllVideoElements : function()
	{
		_.each( $('video'), function(video){
			$(video).attr('src','""');
			$(video).remove();
		});
		_.each( $('object'), function(object){
		
			$(object).remove();
		});
		$('#zeega-player').remove();
	},
	
	/*
		Method: setListeners
		Binds the listeners for key navigation and layer ready events
	*/
	setListeners : function()
	{
		var _this = this;
		$(window).bind( 'keydown', function(e){
		    switch(e.which)
			{
				case 27:
					if(_this.zeega) _this.close(); //don't close if standalone player
					break;
				case 8:
					if(_this.zeega) _this.close(); //don't close if standalone player
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
			_this.displayWindow.find('#preview-media').css( cssObj );
		}
		
		$('#zeega-player').keydown(function(event) {
			
		});
		
		
		$('#citation').mouseleave(function(){
			_.delay( closeCitationBar, 500 );
		})
		
		
		// all layers will make this call
		$('#zeega-player').bind('ready',function(e, data){
			_this.onLayerLoad(data.id);
			return false;
		});
		
		// not all layers will call this
		$('#zeega-player').bind('ended',function(e, data){
			
			_this.advanceAfterMedia(data.id);
			return false;
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
				_this.showNavigation();
			}
		}
		
		this.displayWindow.find('#preview-close').click(function(){
			_this.close();
		})
		
	},
	
	fadeOutOverlays : function( _this )
	{
		_this.overlaysHidden = true;
		$('.player-overlay').fadeOut('slow');
		$('.preview-nav').fadeOut('slow');
	},
	
	/*
		Method: unsetListeners
		Unbinds the listeners for key navigation events
	*/
	unsetListeners : function()
	{
		$(window).unbind( 'keydown' ); //remove keylistener
		onmousemove = null;
	},
	
	/*
		Method: onLayerLoad
		Called when a layer is loaded and calls 'ready'
		
		Parameters:
		
			layerID - the id of the layer that called 'ready'.
	*/
	onLayerLoad : function(layerID)
	{
		//remove from the layers loading array
		this.data.layers.loading = _.without( this.data.layers.loading, layerID );
		//add to the layers loaded array
		this.data.layers.ready.push(layerID);
		
		var layer = this.getLayer( layerID );
		
		$('#layer-loading-'+layerID).html( 'loaded: '+ layer.attr.title );

		this.updateFrameStatus();
	},
	
	/*
		Method: updateFrameStatus
		Checks frames to see if all their layers are loaded. If their layers are loaded, then the frame id is added to the loadedFrames array.
	*/
	updateFrameStatus : function()
	{
		_this = this;
		//loop through each frame that is loading
		_.each( this.data.frames.loading, function( frameID ){
			var frame = _this.getFrame( frameID ); 
			var layers = frame.layers;
			
			//updated the loading bar
			if( _this.currentFrame.id == frameID ) _this.loadingBar.update();
				
			//if all the layers are loaded in a frame
			if( _.difference( layers, _this.data.layers.ready ).length == 0 )
			{
			
				//remove from frames loading array
				_this.data.frames.loading = _.without( _this.data.frames.loading , frameID );
				// add to frames loaded array
				_this.data.frames.ready.push(frameID);
				
				if( _this.currentFrame.id == frameID)
				{
					
					_this.loadingBar.remove();
					_this.drawFrame( frameID ); 
				}
				else if( frameID == _this.getRight() )
				{
					
					if( $('#preview-right').spin() ) $('#preview-right').spin(false)
				}
				else if( frameID == _this.getLeft() )
				{
					
					if( $('#preview-left').spin() ) $('#preview-left').spin(false)
				}
				
			}
		})
	},
	
	/*
		Method: preload
		Tries to preload frames starting with the current frame +/- the lookahead amount. The pattern is 0,1,-1,2,-2,…
	*/
	preload : function()
	{
		//find the frame you're coming from and where it is in the order
		var frameOrder = this.currentSequence.frameOrder;
		var index = _.indexOf( frameOrder, this.currentFrame.id );

		//see if frame's layers are preloaded // starting with the currentFrame
		//look ahead 2 and behind 2 // include current frame also
		
		for (var i = 0  ; i < this.lookahead * 2 + 1 ; i++ )
		{
			//the offset spirals outward to load nearest frames first
			var offset = Math.ceil(i/2) * (-1+(2*(i%2)));
			var tryIndex = index + offset;
			if(tryIndex >= 0 && tryIndex < frameOrder.length)
			{
				var frameID = frameOrder[tryIndex];
				if( !_.include( this.data.frames.ready, frameID ) && !_.include( this.data.frames.loading, frameID ) )
					this.preloadFrame(frameID);
				else if( frameID == this.currentFrame.id )
					this.drawFrame( frameID )
			}	
		}
	},
	
	/*
		Method: preloadFrame
		Tries to preload a frame by preloading all it's layers. It first checks to see if the frame has already been completely loaded.
		
		Parameters:
		
			frameID - the id of the frame being preloaded/checked
	*/
	preloadFrame : function( frameID )
	{
		_this = this;
		
		if(frameID == this.currentFrame.id) this.loadingBar.draw();
		//put frame id into the frames.loading Array
		this.data.frames.loading.push( frameID );

		//determine the layers that need to be preloaded 
		var frame = this.getFrame( frameID );
		var layersToPreload = _.difference( frame.layers, this.layersOnStage, this.data.layers.loading, this.data.layers.ready );
		
		if( _.isEmpty( layersToPreload ) ) this.updateFrameStatus();
		
		_.each( layersToPreload , function( layerID ){ _this.preloadLayer(layerID) });
	},
	
	/*
		Method: preloadLayer
		Tries to preload a layer. It first checks to see if the layer has already been loaded.
		
		Parameters:
			
			layerID - the id of the layer being preloaded/checked
	*/
	preloadLayer : function( layerID )
	{
		//if not loading or already loaded
		if( !_.include( this.loadedLayers, layerID ) && !_.include( this.loadingLayers, layerID ) )
		{
			
			//put the layer id into the layers Loading array
			this.data.layers.loading.push( layerID );

			var layer = this.getLayer( layerID );
			var layerType = layer.type;

			//make a new layer class
			eval( 'var layerClass = new '+ layerType +'Layer();' );
			//initialize the new layer class
			layerClass.lightLoad( layer );
			
			//add the layer content to the displayWindow
			this.displayWindow.find('#preview-media').append( layerClass.display );
			
			//call the preload function for the layer
			//add the layer class to the layer class array
			this.getLayer(layerID).layerClass = layerClass;
			
			var target = this.displayWindow.find('#preview-media');
			layerClass.preload( target );
			//add layer info to layer-status update bar
			//move this to the loading bar??
			var loadingLayer = $('<li id="layer-loading-'+layerID+'">')
			if( layer.type != 'Image' )
				loadingLayer.append( 'loading: '+ layer.attr.title );
			else loadingLayer.append( 'loaded: '+ layer.attr.title );
			$('#layer-status ul').append(loadingLayer)
		}
	},
	
	/*
		Method: drawFrame
		Places a completely preloaded frame into view. Also manages the state of the navigation arrows.
		
		Parameters:
			
			frameID - The id of the frame to be drawn.
	*/
	drawFrame : function( frameID )
	{
		_this = this;
		
		var targetFrame = this.getFrame( frameID );

		this.cleanupLayers();

		//set timeout for auto advance
		var advanceValue = targetFrame.attr.advance;
		
		
		
		this.setAdvance( advanceValue );
		
		/////
		//empty the citation bar
		closeCitationBar();
		$('#citation ul').empty();
		
		//////
		//draw each layer but not layers already drawn
		var layersToDraw = _.difference(targetFrame.layers, this.layersOnStage );
		
		_.each( targetFrame.layers, function(layerID, i){
			
			//add layer to the citation bar
			_this.drawCitation( layerID );

			if( _.include( layersToDraw, layerID ) )
			{
				//draw new layer to the preview window
				_this.getLayer(layerID).layerClass.play(i);
				_this.layersOnStage.push(layerID);
			}else{
				//update existing persistant layer with new z-index
				_this.getLayer(layerID).layerClass.updateZIndex(i);
			}
		})
		this.paused=false;
		this.showNavigation();
		
	},
	
	showNavigation : function()
	{
		//check to see if the current frame is first or last and remove the correct arrow
		var frameOrder = this.currentSequence.frameOrder;
		//if there's only one frame. show no arrows
		if( frameOrder.length == 1)
		{
			$('#preview-left').hide();
			$('#preview-right').hide();
		}
		else if( !this.overlaysHidden )
		{
			if( !this.getLeft( this.currentFrame.id ) ) $('#preview-left').fadeOut();
			else if( $('#preview-left').is(':hidden') ) $('#preview-left').fadeIn();

	 		if( !this.getRight( this.currentFrame.id ) ) $('#preview-right').fadeOut();
			else if( $('#preview-right').is(':hidden') ) $('#preview-right').fadeIn();
			
			//dude is still loading!
			if( !this.isFrameLoaded( this.getRight() ) ) 
				$('#preview-right').spin('slow','white');
			else $('#preview-right').spin(false);
			
			if( !this.isFrameLoaded( this.getLeft() ) ) 
				$('#preview-left').spin('slow','white');
			else $('#preview-left').spin(false);
			
		}
	},
	
	drawCitation : function( layerID )
	{
		var layer = this.getLayer( layerID );
		
		if( !_.isUndefined(layer) && !_.isUndefined( layer.attr.citation) )
		{
			var template = _.template( this.getCitationTemplate() );
	
			var title = '';
			var imgURL = ''; //add a default thumb?
			if( layer.attr.title ) title = layer.attr.title;
			if( layer.attr.thumbnail_url ) imgURL = layer.attr.thumbnail_url;
	
			var fields = {
				title : title,
				type : layer.type.toLowerCase(),
				trackback : layer.attr.attribution_url,
				imgUrl : imgURL,
			};
			var listItem = $( template( fields ) );
			
			listItem.hover(function(){
				$(this).find('.zicon').removeClass('grey').addClass('orange')
			},function(){
				$(this).find('.zicon').addClass('grey').removeClass('orange')
			})
			
			listItem.find('.citation-tab').click(function(){
				$('#citation').animate({ height : '100px' })
				closeOpenCitationTabs();
				$(this).closest('li').find('.citation-content').fadeIn();
			})
			$('#citation ul').append( listItem );
		}
	},
	
	
	/*
		Method: cleanupLayers
		removes layers that should no longer be in view.
	*/
	cleanupLayers : function()
	{
		// find the uncommon layers and call hidePublish on them
		_this = this;
		
		var nextFrame = this.getFrame( this.currentFrame.id );
		
		var layersToRemove = _.difference( this.layersOnStage, nextFrame.layers );

		_.each( layersToRemove, function( layerID ){
						_this.getLayer(layerID).layerClass.stash();
		});
		this.layersOnStage = _.difference( this.layersOnStage, layersToRemove );
		
	},
	
	/*
		Method: setAdvance
		Sets the advance type
		
		Parameters:
		
			advanceValue - 	0 = after playback.
							>0 = after time in seconds.
							<0 = manual advance.
	*/
	setAdvance : function( advanceValue )
	{
		if(advanceValue > 0)
		{
			//after time in seconds
			this.advanceAfterTimeElapsed(advanceValue)
		}else if(advanceValue == 0 || _.isUndefined(advanceValue) ){
			//after media
			this.advanceOnPlayback = true;
		}else{
			// do nothing. manual control
		}
	},
	
	/*
		Method: advanceAfterTimeElapsed
		Sets the timeout for a timed advance.
		
		Parameters:
		
			seconds - the number of seconds that should elapse before advancing
	*/
	advanceAfterTimeElapsed : function(seconds)
	{
		if(this.timeout) clearTimeout(this.timeout);
		var _this = this;
		
		this.timeout = setTimeout(function(){ _this.goRight() }, seconds*1000);
	},
	
	// advance frame after the media inside it have finished playing
	advanceAfterMedia : function()
	{
						if(this.advanceOnPlayback) this.goRight();
	},


	loadingBar :
	{
		count:0,
		
		draw : function()
		{
			if(Player.currentSequence.layers.length)
			{
				var container = $('<div id="loading-container">')
					.append($('<div id="progress-bar">'))
					.append($('<div id="layer-status"><ul>'));
				$('#zeega-player').append(container);
			}
		},
		update : function()
		{
			this.count++;
			
			var p = this.count / Player.currentSequence.layers.length *100;
			
			$('#progress-bar').css('width',p+'%');
			
		},
		remove : function()
		{
			$('#loading-container').fadeOut('fast',function(){$(this).remove()});
		}
		
	},
		
	getSequence : function( sequenceID )
	{
		//returns the frame object
		var dataSequenceOrder = _.pluck( this.data.project.sequences, 'id' );
		var sequenceIndex = _.indexOf( dataSequenceOrder, sequenceID)
		var sequenceObject = this.data.project.sequences[sequenceIndex];
		return sequenceObject;
	},
	
	getFrame : function( frameID )
	{
		//returns the frame object
		return _.find( this.currentSequence.frames, function(frame){ return frame.id == frameID });
	},
	
	getLayer : function( layerID )
	{
		//returns the layer object
		var dataLayerOrder = _.pluck( this.currentSequence.layers, 'id' );
		var layerIndex = _.indexOf( dataLayerOrder, layerID)
		var layerObject = this.currentSequence.layers[layerIndex];
		return layerObject;
	},
	
	gotoFrame : function( frameID )
	{
		this.currentFrame = this.getFrame( frameID );
		
		window.location.hash = 'player/frame/'+ frameID; //change location hash
		
		this.preload();
	},

	goRight : function()
	{
		
		if(this.timeout) clearTimeout(this.timeout);
		
		var nextFrameID = this.getRight( this.currentFrame.id, 1 );
		
		if( nextFrameID )
		{
			if( this.isFrameLoaded( nextFrameID ) ) this.gotoFrame( nextFrameID );
			else console.log('still loading…')
		}
		else console.log('end of the line');
	},
	
	goLeft : function()
	{
				
		if(this.timeout) clearTimeout(this.timeout);
		
		var nextFrameID = this.getLeft( this.currentFrame.id, 1 );
		if( nextFrameID )
		{
			if( this.isFrameLoaded( nextFrameID ) ) this.gotoFrame( nextFrameID );
			else console.log('still loading…')
		} 
		else console.log('end of the line');
	},
	
	getRight : function( frameID, dist )
	{
		if( _.isUndefined(frameID) ) frameID = this.currentFrame.id;
		if( _.isUndefined(dist) ) dist = 1;
		
		var frameOrder = this.currentSequence.frameOrder;
		var index = _.indexOf( frameOrder, frameID );

		//test if out of bounds
		if( index + dist > frameOrder.length || index + dist < 0 ) return false;
		else return frameOrder[ index + dist ];
	},

	getLeft : function( frameID, dist )
	{
		if( _.isUndefined(frameID) ) frameID = this.currentFrame.id;
		if( _.isUndefined(dist) ) dist = 1;
		var frameOrder = this.currentSequence.frameOrder;
		var index = _.indexOf( frameOrder, frameID );
		if( index - dist > frameOrder.length || index - dist < 0 ) return false;
		else return frameOrder[ index - dist ]
	},
	
	
	playPause: function(){
		var _this=this;
		if(this.paused){
			_.each(this.layersOnStage, function(layerID){
				_this.getLayer(layerID).layerClass.play();
			});
			this.paused=false;
		}
		else {
			_.each(this.layersOnStage, function(layerID){
				_this.getLayer(layerID).layerClass.pause();
			});
			this.paused=true;
		}
	},
	
	isFrameLoaded : function( frameID )
	{
		var _this = this;
		return _.include( _this.data.frames.ready, frameID );
	},
	
	reset : function()
	{
		
		currentSequence = null;
		currentFrame = null;
		this.data = null,
		
		this.isFirstFrame = true;

		this.loadingFrames = [];
		this.loadedFrames = [];
		this.loadingLayers = [];
		this.loadedLayers = [];
		this.layersOnStage = [];
		
		if(this.timeout) clearTimeout(this.timeout);
	},
	
	getTemplate : function()
	{
		html =
		
		"<div id='preview-wrapper'><div id='zeega-player'>"+
			"<div id='preview-logo' class='player-overlay'><a href='http://www.zeega.org/' target='blank'><img src='"+sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +"images/z-logo-128.png'height='60px'/></a></div>";
		
		
		if(this.zeega) html +=
			"<div id='preview-close' class='player-overlay'><a href='#'><span class='zicon orange zicon-close' ></span></a></div>";
		
		
		html +=
		
			"<div id='preview-left' class='hidden preview-nav-arrow preview-nav'>"+
				"<div class='arrow-background'></div>"+
					"<img  height='75' width='35' onclick='Player.goLeft();return false'>"+
				"</div>"+
				"<div id='preview-right' class='hidden preview-nav-arrow preview-nav'>"+
					"<div class='arrow-background'></div>"+
					"<img height='75' width='35' onclick='Player.goRight();return false'>"+
				"</div>"+
				"<div id='preview-media'></div>"+
				"<div id='citation' class='player-overlay'><ul class='clearfix'></ul></div>"+
			"</div>"+
		"</div>";
		
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




}

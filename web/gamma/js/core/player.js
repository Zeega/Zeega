/*---------------------------------------------


	Object: Player
	The Zeega project web player. Part of Core.


	ideas:
	master list of layers/nodes - loading/loaded to check against

---------------------------------------------*/

var Player = {
	
	lookahead : 2, // number of nodes to preload ahead/behind
	isFirstNode : true,
	
	viewportRatio : 1.5,
	
	currentRoute : null,
	currentNode : null,
	
	loadingNodes : [],
	loadedNodes : [],
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
			route - The route index of the starting node.
			nodeID - The id of the starting node.
	
	*/
	init : function( data, routeID, nodeID )
	{
		console.log('Zeega Player Initialized');
		var _this = this;
				
		//test to see if Zeega is installed
		if( window.Zeega )
		{
			this.zeega = true;
			Zeega.previewMode = false;
		}

		this.removeAllVideoElements();
		
		//remove panel ghosts
		$('.x-panel-ghost ').remove();
		
		
		//if the data passed in is a string, then parse it into an object
		if( _.isString( data) ) this.data = $.parseJSON(data);
		else this.data = data;
		
		$('title').html(this.data.project.title);
		
		//set the current route
		if( routeID ) this.currentRoute = this.getRoute( routeID ); // if set, it should keep the route id
		else this.currentRoute = this.data.project.routes[0]; // default to first route if unset
		
		this.dataNodeOrder = _.pluck( this.currentRoute.nodes, 'id' );
		
		//set the current node
		if( !nodeID ) this.currentNode = this.getNode( this.currentRoute.nodeOrder[0] );
		
		else this.currentNode = this.getNode( nodeID );
		
		//this.parseProject;
		this.draw();
		this.setListeners();
		
		this.gotoNode( this.currentNode.id );
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
		$('.preview-nav-arrow').find('img').attr('src',sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'gamma/images/mediaPlayerArrow_shadow.png');
		
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
		
		//Zeega.clearCurrentNode();
		
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
		
		document.webkitCancelFullScreen();
		
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
			Zeega.previewMode = false;
			//go to the node last viewed in the player
			Zeega.loadNode( Zeega.route.nodes.get( this.currentNode.id ) );
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
		    console.log('keydown:'+e.which);
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
			console.log(event.which+":keypress");
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
		this.loadingLayers = _.without( this.loadingLayers, layerID );
		//add to the layers loaded array
		this.loadedLayers.push(layerID);
		
		var layer = this.getLayer( layerID );
		
		$('#layer-loading-'+layerID).html( 'loaded: '+ layer.attr.title );

		this.updateNodeStatus();
	},
	
	/*
		Method: updateNodeStatus
		Checks nodes to see if all their layers are loaded. If their layers are loaded, then the node id is added to the loadedNodes array.
	*/
	updateNodeStatus : function()
	{
		_this = this;
		//loop through each node that is loading
		_.each( this.loadingNodes, function( nodeID ){
			var node = _this.getNode( nodeID ); 
			var layers = node.layers;
			
			//updated the loading bar
			if( _this.currentNode.id == nodeID ) _this.loadingBar.update();
			
			//if all the layers are loaded in a node
			if( _.difference( layers, _this.loadedLayers ).length == 0 )
			{
			
				//remove from nodes loading array
				_this.loadingNodes = _.without( _this.loadingNodes , nodeID );
				// add to nodes loaded array
				_this.loadedNodes.push(nodeID);
				
				if( _this.currentNode.id == nodeID)
				{
					_this.drawNode( nodeID ); 
					_this.loadingBar.remove();
				}
				
			}
		})
	},
	
	/*
		Method: preload
		Tries to preload nodes starting with the current node +/- the lookahead amount. The pattern is 0,1,-1,2,-2,…
	*/
	preload : function()
	{
		//find the node you're coming from and where it is in the order
		var nodeOrder = this.currentRoute.nodeOrder;
		var index = _.indexOf( nodeOrder, this.currentNode.id );

		//see if node's layers are preloaded // starting with the currentNode
		//look ahead 2 and behind 2 // include current node also
		
		for (var i = 0  ; i < this.lookahead * 2 + 1 ; i++ )
		{
			//the offset spirals outward to load nearest nodes first
			var offset = Math.ceil(i/2) * (-1+(2*(i%2)));
			var tryIndex = index + offset;
			if(tryIndex >= 0 && tryIndex < nodeOrder.length)
			{
				var nodeID = nodeOrder[tryIndex];
				this.preloadNode(nodeID);
			}	
		}
	},
	
	/*
		Method: preloadNode
		Tries to preload a node by preloading all it's layers. It first checks to see if the node has already been completely loaded.
		
		Parameters:
		
			nodeID - the id of the node being preloaded/checked
	*/
	preloadNode : function( nodeID )
	{
		//if not loading or already loaded
		if( !_.include( this.loadedNodes , nodeID ) && !_.include( this.loadingNodes , nodeID ) )
		{
			_this = this;

			if(nodeID == this.currentNode.id) this.loadingBar.draw();

			//put node id into the nodesLoading Array
			this.loadingNodes.push( nodeID );

			//determine the layers that need to be preloaded 
			var node = this.getNode( nodeID );
			console.log(nodeID);
			console.log(node);
			var layersToPreload = _.difference( _.compact( node.layers ), this.layersOnStage );

			_.each( _.compact(layersToPreload),function(layerID){
				_this.preloadLayer(layerID);
			});
			
		}else if( nodeID == this.currentNode.id ){
			this.drawNode( nodeID );
		}
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
			this.loadingLayers.push( layerID );

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
		Method: drawNode
		Places a completely preloaded node into view. Also manages the state of the navigation arrows.
		
		Parameters:
			
			nodeID - The id of the node to be drawn.
	*/
	drawNode : function( nodeID )
	{
		_this = this;
		
		var targetNode = this.getNode( nodeID );

		this.cleanupLayers();

		//set timeout for auto advance
		var advanceValue = targetNode.attr.advance;
		this.setAdvance( advanceValue );
		
		/////
		//empty the citation bar
		closeCitationBar();
		$('#citation ul').empty();
		
		//////
		//draw each layer but not layers already drawn
		var layersToDraw = _.difference(targetNode.layers, this.layersOnStage );
		
		_.each( targetNode.layers, function(layerID, i){
			
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
		//check to see if the current node is first or last and remove the correct arrow
		var nodeOrder = this.currentRoute.nodeOrder;
		//if there's only one node. show no arrows
		if( nodeOrder.length == 1)
		{
			$('#preview-left').hide();
			$('#preview-right').hide();
		}else if( !_this.overlaysHidden ){
			if( !this.getLeft( this.currentNode.id, 1 ) ) $('#preview-left').fadeOut();
			else if( $('#preview-left').is(':hidden') ) $('#preview-left').fadeIn();

	 		if( !this.getRight( this.currentNode.id, 1 ) ) $('#preview-right').fadeOut();
			else if( $('#preview-right').is(':hidden') ) $('#preview-right').fadeIn();
		}
	},
	
	drawCitation : function( layerID )
	{
		var layer = this.getLayer( layerID )
		if(layer.attr.citation){
			var template = _.template( this.getCitationTemplate() );
	
			var fields = {
				title : layer.attr.title,
				type : layer.type.toLowerCase(),
				trackback : layer.attr.attribution_url,
				imgUrl : layer.attr.thumbnail_url,
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
		
		var nextNode = this.getNode( this.currentNode.id );
		
		var layersToRemove = _.difference( this.layersOnStage, nextNode.layers );

		_.each( layersToRemove, function( layerID ){
			console.log('removing layer: '+layerID);
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
		}else if(advanceValue == 0){
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
	
	// advance node after the media inside it have finished playing
	advanceAfterMedia : function()
	{
		if(this.advanceOnPlayback) this.goRight();
	},


	loadingBar :
	{
		count:0,
		
		draw : function()
		{
			if(Player.currentRoute.layers.length)
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
			
			var p = this.count / Player.currentRoute.layers.length *100;
			
			$('#progress-bar').css('width',p+'%');
			
		},
		remove : function()
		{
			$('#loading-container').fadeOut('fast',function(){$(this).remove()});
		}
		
	},
		
	getRoute : function( routeID )
	{
		//returns the node object
		var dataRouteOrder = _.pluck( this.data.project.routes, 'id' );
		var routeIndex = _.indexOf( dataRouteOrder, routeID)
		var routeObject = this.data.project.routes[routeIndex];
		return routeObject;
	},
	
	getNode : function( nodeID )
	{
		//returns the node object
		
		
		var nodeIndex = _.indexOf( this.dataNodeOrder, parseInt(nodeID));
		var nodeObject = this.currentRoute.nodes[nodeIndex];
		return nodeObject;
	},
	
	getLayer : function( layerID )
	{
		//returns the layer object
		var dataLayerOrder = _.pluck( this.currentRoute.layers, 'id' );
		var layerIndex = _.indexOf( dataLayerOrder, layerID)
		var layerObject = this.currentRoute.layers[layerIndex];
		return layerObject;
	},
	
	gotoNode : function(nodeID)
	{
		this.currentNode = this.getNode(nodeID);
		this.preload();
	},
	
	goUp : function()
	{
		console.log('go up…');
	},
	
	goRight : function()
	{
		console.log('go Right');

		if(this.timeout) clearTimeout(this.timeout);
		
		var nextNodeID = this.getRight( this.currentNode.id, 1 );
		

		
		if( nextNodeID&&_.include(this.loadedNodes, nextNodeID)  ) this.gotoNode( nextNodeID );
		else console.log('end of the line');
	},
	
	goDown : function()
	{
		console.log('go down…')
	},
	
	goLeft : function()
	{
		console.log('goLeft');
		if(this.timeout) clearTimeout(this.timeout);
		
		var nextNodeID = this.getLeft( this.currentNode.id, 1 );
		if( nextNodeID&&_.include(this.loadedNodes, nextNodeID)  ) this.gotoNode( nextNodeID );
		else console.log('end of the line');
	},
	
	//returns the id of the node in any direction n nodes ahead
	getUp : function( nodeID, dist )
	{
		
	},
	
	getRight : function( nodeID, dist )
	{
		var nodeOrder = this.currentRoute.nodeOrder;
		var index = _.indexOf( nodeOrder, nodeID );
		
		//test if out of bounds
		if( index + dist > nodeOrder.length || index + dist < 0 ) return false;
		else return nodeOrder[index+dist]
	},
	
	getDown : function( nodeID, dist )
	{
		
	},

	
	getLeft : function( nodeID, dist )
	{
		var nodeOrder = this.currentRoute.nodeOrder;
		var index = _.indexOf( nodeOrder, nodeID );
		
		//test if out of bounds
		if( index - dist > nodeOrder.length || index - dist < 0 ) return false;
		else return nodeOrder[ index - dist ]
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
	
	
	reset : function()
	{
		
		currentRoute = null;
		currentNode = null;
		this.data = null,
		
		this.isFirstNode = true;

		this.loadingNodes = [];
		this.loadedNodes = [];
		this.loadingLayers = [];
		this.loadedLayers = [];
		this.layersOnStage = [];
		
		if(this.timeout) clearTimeout(this.timeout);
	},
	
	getTemplate : function()
	{
		html =	 	"<div id='preview-wrapper'><div id='zeega-player'>";
		html +=			"<div id='preview-logo' class='player-overlay'><a href='http://www.zeega.org/' target='blank'><img src='"+sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +"gamma/images/z-logo-128.png'height='60px'/></a></div>";
		html +=			"<div id='preview-close' class='player-overlay'><span class='zicon orange zicon-close' ></span></div>";
		html += 		"<div id='preview-left' class='hidden preview-nav-arrow preview-nav'>";
		html += 			"<div class='arrow-background'></div>";
		html += 			"<img  height='75' width='35' onclick='Player.goLeft();return false'>";
		html += 		"</div>";
		html += 		"<div id='preview-right' class='hidden preview-nav-arrow preview-nav'>";
		html += 			"<div class='arrow-background'></div>";
		html += 			"<img height='75' width='35' onclick='Player.goRight();return false'>";
		html += 		"</div>";
		html += 		"<div id='preview-media'></div>";
		html += 		"<div id='citation' class='player-overlay'><ul class='clearfix'></ul></div>";
		html += 	"</div></div>";
		
		return html;
	},
	
	getCitationTemplate : function()
	{
		var html =	'<li class="clearfix">';
		html+=			'<div class="citation-tab">';
		html+=				'<span class="zicon grey zicon-<%= type %>"></span>';
		html+=			'</div>';
		html+=			'<div class="citation-content hidden">';
		html+=				'<div class="citation-thumb"><img width="100%" height="100%" src="<%= imgUrl %>"/></div>';
		html+=				'<div class="citation-body">';
		html+=				'<div class="citation-title"><%= title %></div>';
		html+=					'<div class="citation-metadata"><a href="<%= trackback %>" target="blank">Link to original</a></div>';
		html+=				'</div>';
		html+=			'</div>';
		html+=		'</li>';
		return html;
	}




}

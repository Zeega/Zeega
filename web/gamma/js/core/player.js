var Player = {
	
	lookahead : 2, // number of nodes to preload ahead/behind
	isFirstNode : true,
	
	//player : this,
	currentRoute : 0,
	currentNodeID : null,
	
	loadingNodes : [],
	loadedNodes : [],
	loadingLayers : [],
	loadedLayers : [],
	layersOnStage : [],
	layerClasses : [],
	
	init : function( data, route, nodeID )
	{
		console.log('Zeega Player Initialized');
		var _this = this;

		//test to see if Zeega is installed
		if(Zeega)
		{
			this.zeega = true;
			Zeega.previewMode = false;
		}

		this.removeAllVideoElements();
		
		//if the data passed in is a string, then parse it into an object
		if( _.isString( data) ) this.data = $.parseJSON(data);
		else this.data = data;
		
		//this.parseProject;
		this.draw();
		this.setListeners();
		
		this.gotoNode(nodeID);
	},
	
	parseProject : function(data)
	{
		//parse JSON into something?
		// don't need?
	},
	
	draw : function()
	{
		//add the player div
		var overlay = $(this.getTemplate());
		$('body').append(overlay);
		
		//Zeega.clearCurrentNode();
		
		overlay.fadeIn();
	},
	
	close : function()
	{
		console.log('Zeega Player Close');
		var _this = this;
		
		this.unsetListeners();
		
		//turn off/pause all media first
		_.each(this.layersOnStage, function(layerID){
			_this.layerClasses[layerID].hidePublish();
		});
		
		
		// remove the player div
		$('#zeega-player').fadeOut( 450, function(){
			_this.removeAllVideoElements();
			_this.reset();
			$(this).remove() 
		}); 
		
		if(this.zeega)
		{
			//turn off previewMode
			Zeega.previewMode = false;
			//go to the node last viewed in the player
			Zeega.loadNode(Zeega.route.nodes.get(this.currentNodeID));
		}
	},
	
	removeAllVideoElements : function()
	{
		_.each( $('video'), function(video){
			$(video).attr('src','');
			$(video).remove();
		});
	},
	
	setListeners : function()
	{
		var _this = this;
		$(window).bind( 'keydown', function(e){
			switch(e.which)
			{
				case 27:
					_this.close();
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
			}
		});
		
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
	},
	
	unsetListeners : function()
	{
		$(window).unbind( 'keydown' ); //remove keylistener
	},
	
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
	
	updateNodeStatus : function()
	{
		_this = this;
		//loop through each node that is loading
		_.each(this.loadingNodes, function(nodeID){
			var dataNodeOrder = _.pluck( _this.data.project.routes[_this.currentRoute].nodes, 'id' );
			var nodeIndex = _.indexOf( dataNodeOrder, nodeID)
			var nodeObject = _this.data.project.routes[_this.currentRoute].nodes[nodeIndex];
			
			var layers = nodeObject.layers;
			
			if( _this.currentNodeID == nodeID) _this.loadingBar.update();
			
			//if all the layers are loaded in a node
			if( _.difference( layers, _this.loadedLayers ).length == 0 )
			{
				//remove from nodes loading array
				_this.loadingNodes = _.without( _this.loadingNodes , nodeID );
				// add to nodes loaded array
				_this.loadedNodes.push(nodeID);
				
				if( _this.currentNodeID == nodeID)
				{
					_this.drawNode( nodeID ); 
					_this.loadingBar.remove();
				}
				
			}
		})
	},
	
	preload : function()
	{
		
		//find the node you're coming from and where it is in the order
		var nodeOrder = this.data.project.routes[this.currentRoute].nodeOrder;
		var index = _.indexOf(nodeOrder, this.currentNodeID);

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
	
	preloadNode : function( nodeID )
	{
		//if not loading or already loaded
		if( !_.include( this.loadedNodes , nodeID ) && !_.include( this.loadingNodes , nodeID ) )
		{
			_this = this;

			if(nodeID == this.currentNodeID) this.loadingBar.draw();

			//put node id into the nodesLoading Array
			this.loadingNodes.push( nodeID );
			
			var nodeObject = this.getNode( nodeID );

			var layersToPreload = _.difference( _.compact( nodeObject.layers ), this.layersOnStage );

			_.each( _.compact(layersToPreload),function(layerID){
				_this.preloadLayer(layerID);
			});
			
		}else if( nodeID == this.currentNodeID ){
			this.drawNode( nodeID );
		}
	},
	
	preloadLayer : function( layerID )
	{
		//if not loading or already loaded
		if( !_.include( this.loadedLayers, layerID ) && !_.include( this.loadingLayers, layerID ) )
		{
			//put the layer id into the layers Loading array
			this.loadingLayers.push(layerID);

			var layerObject = this.getLayer( layerID );
			
			var layerType = layerObject.type;

			//make a new layer class
			eval( 'var layerClass = new '+ layerType +'Layer();' );
			//initialize the new layer class
			layerClass.load( layerObject );
			//call the preload function for the layer
			//add the layer class to the layer class array
			this.layerClasses[layerID] = layerClass;
			
			layerClass.preloadMedia();
			
			//add layer info to layer-status update bar
			//move this to the loading bar??
			var loadingLayer = $('<li id="layer-loading-'+layerID+'">')
			if( layerObject.type != 'Image' )
				loadingLayer.append( 'loading: '+ layerObject.attr.title );
			else loadingLayer.append( 'loaded: '+ layerObject.attr.title );
			$('#layer-status ul').append(loadingLayer)
			
		}
	},
	
	drawNode : function( nodeID )
	{
		_this = this;
		
		_this.isFirstNode = false;
		
		var targetNode = this.getNode( nodeID );

		this.cleanupLayers();

		//set timeout for auto advance
		var advanceValue = targetNode.attr.advance;
		this.setAdvance( advanceValue );
		
		//draw each layer but not layers already drawn
		var layersToDraw = _.difference(targetNode.layers, this.layersOnStage );
		
		_.each( targetNode.layers, function(layerID, i){

			if( _.include( layersToDraw, layerID ) )
			{
				//draw new layer to the preview window
				
				_this.layerClasses[layerID].drawPublish(i);
				_this.layersOnStage.push(layerID);
			
			}else{
				//update existing persistant layer with new z-index
				_this.layerClasses[layerID].updateZIndex(i);
			}
			
		})
		
		//check to see if the current node is first or last and remove the correct arrow

		var nodeOrder = this.data.project.routes[this.currentRoute].nodeOrder;
		//if there's only one node. show no arrows
		if( nodeOrder.length == 1)
		{
			$('#preview-left').hide();
			$('#preview-right').hide();
		}else{
			if( !this.getLeft( this.currentNodeID, 1 ) ) $('#preview-left').fadeOut();
			else if( $('#preview-left').is(':hidden') ) $('#preview-left').fadeIn();

	 		if( !this.getRight( this.currentNodeID, 1 ) ) $('#preview-right').fadeOut();
			else if( $('#preview-right').is(':hidden') ) $('#preview-right').fadeIn();
		}
	},
		
	cleanupLayers : function()
	{
		// find the uncommon layers and call hidePublish on them
		_this = this;
		
		var newNode = this.getNode(this.currentNodeID);

		var layersToRemove = _.difference( this.layersOnStage, newNode.layers );

		_.each( layersToRemove, function( layerID ){
			_this.layerClasses[layerID].hidePublish();
		});
		this.layersOnStage = _.difference( this.layersOnStage, layersToRemove );
		
	},
	
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
	
	// advance node after a defined number of seconds have passed
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
			if(Player.data.project.routes[Player.currentRoute].layers.length)
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
			
			var p = this.count / Player.data.project.routes[Player.currentRoute].layers.length *100;
			
			$('#progress-bar').css('width',p+'%');
			
		},
		remove : function()
		{
			$('#loading-container').fadeOut('fast',function(){$(this).remove()});
		}
		
	},
		

	
	getLayer : function( layerID )
	{
		//returns the layer object
		var dataLayerOrder = _.pluck( this.data.project.routes[this.currentRoute].layers, 'id' );
		var layerIndex = _.indexOf( dataLayerOrder, layerID)
		var layerObject = this.data.project.routes[this.currentRoute].layers[layerIndex];
		return layerObject
	},
	
	getNode : function( nodeID )
	{
		//returns the node object
		var dataNodeOrder = _.pluck( this.data.project.routes[this.currentRoute].nodes, 'id' );
		var nodeIndex = _.indexOf( dataNodeOrder, nodeID)
		var nodeObject = this.data.project.routes[this.currentRoute].nodes[nodeIndex];
		return nodeObject;
	},
	
	gotoNode : function(nodeID)
	{
		this.currentNodeID = nodeID;
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
		
		var nextNodeID = this.getRight( this.currentNodeID, 1 );
		
		if( nextNodeID ) this.gotoNode( nextNodeID )
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
		
		var nextNodeID = this.getLeft( this.currentNodeID, 1 );
		
		if( nextNodeID ) this.gotoNode( nextNodeID )
		else console.log('end of the line');
	},
	
	//returns the id of the node in any direction n nodes ahead
	getUp : function( nodeID, dist )
	{
		
	},
	
	getRight : function( nodeID, dist )
	{
		var nodeOrder = this.data.project.routes[this.currentRoute].nodeOrder;
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
		var nodeOrder = this.data.project.routes[this.currentRoute].nodeOrder;
		var index = _.indexOf( nodeOrder, nodeID );
		
		//test if out of bounds
		if( index - dist > nodeOrder.length || index - dist < 0 ) return false;
		else return nodeOrder[ index - dist ]
	},
	
	reset : function()
	{
		
		currentRoute = 0;
		currentNodeID = null;
		this.data = null,
		
		this.isFirstNode = true;

		this.loadingNodes = [];
		this.loadedNodes = [];
		this.loadingLayers = [];
		this.loadedLayers = [];
		this.layersOnStage = [];
		this.layerClasses = [];
		
		if(this.timeout) clearTimeout(this.timeout);
	},
	
	getTemplate : function()
	{
	 	html = "<div id='zeega-player'><div id='preview-left' class='preview-nav-arrow preview-nav'><div class='arrow-background'></div><img src='/joseph/web/gamma/images/mediaPlayerArrow_shadow.png' height='75' width='35' onclick='Player.goLeft();return false'></div><div id='preview-right' class='preview-nav-arrow preview-nav'><div class='arrow-background'></div><img src='/joseph/web/gamma/images/mediaPlayerArrow_shadow.png' height='75' width='35' onclick='Player.goRight();return false'></div><div id='preview-media'></div></div>";
		return html;
	}




}
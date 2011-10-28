
/********************************************

	PLAYER.JS 

	CORE Player Preview OBJECT
	
	VERSION 0.5
	
	
*********************************************/

/********************************************

	THE Zeega preview player

*********************************************/

var Player = {
	
	projectData :null,		// project data
	currentRoute : 0,		// the current route // default = 0
	currentNode : 0,		// the node currently on/to start on // default = 0
	lookAhead : 2,			// the number of nodes to preload ahead of the currentNode
	zeega : false,			// does the editor exist?
	route : null,			//collection of routes
	nodes : null,			// collection of nodes
	nodesLoaded : [],
	layersLoaded : [],
	nodesLoading : [],
	layersLoading : [],
	layersOnStage : [],
	
	waitToFinish : [],
	advanceOnPlayback : false,
	
	layers : null,			// collection of layers
	layerClasses : {},	// array of layerClasses
	
	
	//stuff to do at the start
	init : function()
	{
		console.log('Zeega Player Initialized');
		var _this = this;
		
		this.reset();
		
		//test to see if Zeega is installed // if it is, use existing data models
		if(Zeega) this.zeega = true;
		
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
		
		//init data structure
		if(this.zeega)
		{
			this.route = Zeega.route;
			this.nodes = Zeega.route.nodes;
			this.layers = Zeega.route.layers;
		}
		

		this.draw();

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
		
		this.gotoNode(this.currentNode);
		
	},
	
	// draws the player to the page // appends to body
	draw : function()
	{
		//add the player div
		var t = $(this.template);
		$('body').append(t);
		
		Zeega.clearCurrentNode();
		
		t.fadeIn();
		
	},
	
	// removes the player from the dom // resets the player? probably.
	close : function()
	{
		console.log('Zeega Player Close');
		var _this = this;
		$(window).unbind( 'keydown' ); //remove keylistener
		
		//turn off/pause all media first
		_.each(this.layersOnStage, function(layerID){
			_this.layerClasses[layerID].hidePublish();
		});
		
		
		// remove the player div
		$('#zeega-player').fadeOut( 450, function(){
			
			_.each( $(this).find('video'), function(video){
				$(video).attr('src','')
			});
			$(this).remove() 
		}); 
		
		if(this.zeega)
		{
			//turn off previewMode
			Zeega.previewMode = false;
			//go to the node last viewed in the player
			Zeega.loadNode(Zeega.route.nodes.get(this.currentNode));
		}
	},
	
	// goes to an arbitrary node
	gotoNode : function(nodeID)
	{
		this.currentNode = nodeID;
		// try to preload the node
		//this.preloadNode(nodeID);
		this.preloadAhead(nodeID);
	},
	
	onLayerLoad : function(layerID)
	{
		//remove from the layers loading array
		this.layersLoading = _.without(this.layersLoading,layerID);
		//add to the layers loaded array
		this.layersLoaded.push(layerID);

		this.updateNodeStatus();
	},
	
	updateNodeStatus : function()
	{
		_this = this;
		//loop through each node that is loading
		_.each(this.nodesLoading,function(nodeID){
			var layers = _this.nodes.get(nodeID).get('layers');
			
			if(_this.currentNode == nodeID) _this.loadingBar.update();
			
			//if all the layers are loaded in a node
			if( _.difference( layers, _this.layersLoaded ).length == 0 )
			{
				//remove from nodes loading array
				_this.nodesLoading = _.without(_this.nodesLoading,nodeID);
				// add to nodes loaded array
				_this.nodesLoaded.push(nodeID);
				console.log('loaded node: '+ nodeID);
				
				if(_this.currentNode == nodeID)
				{
					_this.drawCurrentNode(); 
					_this.loadingBar.remove();
				}
			}
		})
	},
	
	//this should only happen if the node's layers have completely loaded
	drawCurrentNode : function()
	{
		_this = this;
		
		var targetNode = this.nodes.get(this.currentNode);

		this.cleanupLayers();

		//set timeout for auto advance
		var advanceValue = this.nodes.get(this.currentNode).get('attr').advance;
		this.setAdvance( advanceValue );
		
		//draw each layer
		var layersToDraw = _.difference(targetNode.get('layers'),this.layersOnStage);
		
		_.each( targetNode.get('layers') , function(layerID, i){

			if( _.include(layersToDraw,layerID) )
			{
				//draw new layer to the preview window
				
				_this.layerClasses[layerID].drawPublish( targetNode.get('layers').length - i);
				_this.layersOnStage.push(layerID);
			
			}else{
				//update existing persistant layer with new z-index
				_this.layerClasses[layerID].updateZIndex( targetNode.get('layers').length - i);
				console.log('omitting layer: '+layerID)
			}
			
		})
		
		//check to see if the current node is first or last and remove the correct arrow

		var nodesOrder = this.route.get('nodesOrder');
		if( _.indexOf(nodesOrder,this.currentNode) == 0 )
		{
			$('#preview-left').fadeOut();
		}else if( _.indexOf(nodesOrder,this.currentNode) == nodesOrder.length-1 ){
			$('#preview-right').fadeOut();
		}else if( 	$('#preview-left').is(':hidden') ){
			$('#preview-left').fadeIn()
		}else if( 	$('#preview-right').is(':hidden') ){
			$('#preview-right').fadeIn()
		}
		

			
	},
	
	cleanupLayers : function()
	{
		// find the uncommon layers and call hidePublish on them
		_this = this;
		
		var newNode = this.nodes.get(this.currentNode);

		var layersToRemove = _.difference( this.layersOnStage, newNode.get('layers') );
		
		_.each(layersToRemove,function(layerID){
			_this.layerClasses[layerID].hidePublish();
		});
		
		this.layersOnStage = _.difference(this.layersOnStage,layersToRemove);
	},
		
	preloadNode : function(nodeID)
	{
		
		
		//if not loading or already loaded
		if( !_.include( this.nodesLoaded, nodeID ) && !_.include(this.nodesLoading,nodeID))
		{
			_this = this;
			console.log('preloading node: '+nodeID);
			
			if(nodeID == this.currentNode) this.loadingBar.draw();
			
			//put node id into the nodesLoading Array
			this.nodesLoading.push( nodeID );
			
			//preload each layer inside the node
			var layersToPreload = _.difference( this.nodes.get(nodeID).get('layers'), this.layersOnStage );
			
			_.each( _.without(layersToPreload, -1),function(layerID){
				_this.preloadLayer(layerID);
			});
			
		}else{
			this.drawCurrentNode();
		}
	},

	
	preloadLayer : function(layerID)
	{
		//if not loading or already loaded
		if( !_.include( this.layersLoaded, layerID ) || !_.include(this.layersLoading,layerID))
		{
			console.log('preloading: '+ layerID)
			//get the layer model
			var layer = this.layers.get(layerID);
			//get the layer type
			var layerType = layer.get('type');

			//put the layer id into the layers Loading array
			this.layersLoading.push(layerID);
			//make a new layer class
			eval( 'var layerClass = new '+ layerType +'Layer();' );
			//initialize the new layer class
			layerClass.load( _this.layers.get(layerID) );
			//call the preload function for the layer
			//add the layer class to the layer class array
			this.layerClasses[layerID] = layerClass;
			layerClass.preloadMedia();
		}
	},
	
	// compares the lookAhead to the loaded nodes and loads within the lookAhead horizon
	preloadAhead : function(nodeID)
	{

		//find the node you're coming from and where it is in the order
		var nodesOrder = this.route.get('nodesOrder');
		var index = _.indexOf(nodesOrder, nodeID);
		
		//see if node's layers are preloaded // starting with the currentNode
		//look ahead 2 and behind 2 // include current node also
		
		for (var i = 0  ; i < this.lookAhead * 2 + 1 ; i++ )
		{
			//the offset spirals outward to load nearest nodes first
			var offset = Math.ceil(i/2) * (-1+(2*(i%2)));
			var tryIndex = index + offset;
			if(tryIndex >= 0 && tryIndex < nodesOrder.length)
			{
				var tryNodeID = nodesOrder[tryIndex];
				this.preloadNode(tryNodeID);
			}
			
		}
			
	},
	
	
	setAdvance : function(advanceValue)
	{
		console.log('********* '+advanceValue);
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
		
		this.timeout = setTimeout(function(){_this.goRight()}, seconds*1000);
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
				if(Player.layers.length)
				{
					var container = $('<div id="loading-container">').append($('<div id="progress-bar">'));
					$('#zeega-player').append(container);
				}
			},
			update : function()
			{
				this.count++;
				//var layers = _this.nodes.get(nodeID).get('layers');
				
				var p = this.count / Player.layers.length *100;
				
				$('#progress-bar').css('width',p+'%');
				
			},
			remove : function()
			{
				$('#loading-container').fadeOut('fast',function(){$(this).remove()});
			}
			
		},


	// directional navigation
	
	goLeft : function()
	{
		if(this.timeout) clearTimeout(this.timeout);
		
		console.log('goLeft');
		var nodesOrder = this.route.get('nodesOrder');
		var index = _.indexOf(nodesOrder, this.currentNode);
		
		if( index > 0 ) this.gotoNode( nodesOrder[index-1] )
		else console.log('end of the line');
		
	},
	
	goRight : function()
	{
		if(this.timeout) clearTimeout(this.timeout);
		
		/*
		$('#preview-right').css({'opacity':1,'background':'rgba(255,0,0,.25)'});
		$('#preview-right').fadeTo(100,0);
		*/
		
		console.log('goRight');
		var nodesOrder = this.route.get('nodesOrder');
		var index = _.indexOf(nodesOrder, this.currentNode);
		
		if( nodesOrder.length-1 > index ) this.gotoNode( nodesOrder[index+1] )
		else console.log('end of the line');
	},
	
	goUp : function()
	{
		if(this.timeout) clearTimeout(this.timeout);
		
		console.log('goUp')
	},
	
	goDown : function()
	{
		if(this.timeout) clearTimeout(this.timeout);
		
		console.log('goDown')
	},
		
	template : "<div id='zeega-player'><div id='preview-left' class='preview-nav-arrow preview-nav'><div class='arrow-background'></div><img src='/joseph/web/gamma/images/mediaPlayerArrow_shadow.png' onclick='Player.goLeft();return false'></div><div id='preview-right' class='preview-nav-arrow preview-nav'><div class='arrow-background'></div><img src='/joseph/web/gamma/images/mediaPlayerArrow_shadow.png' onclick='Player.goRight();return false'></div><div id='preview-media'></div></div>",
	
	
	reset : function()
	{
		this.lookAhead = 2;		// the number of nodes to preload ahead of the currentNode
		this.route = null;			//collection of routes
		this.nodes = null;			// collection of nodes
		this.nodesLoaded = [];
		this.layersLoaded = [];
		this.nodesLoading = [];
		this.layersLoading = [];
		this.layersOnStage = [];
		
		this.layers = null;			// collection of layers
		this.layerClasses = {};	// array of layerClasses
	}
	
	
	
	
} // Player
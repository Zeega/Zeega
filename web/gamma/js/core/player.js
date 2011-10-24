
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
	layers : null,			// collection of layers
	layerClasses : {},	// array of layerClasses
	
	
	//stuff to do at the start
	init : function()
	{
		console.log('Zeega Player Initialized');
		var _this = this;
		
		//test to see if Zeega is installed // if it is, use existing data models
		if(Zeega) this.zeega = true;
		
		console.log(this.zeega);
		
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
			console.log('layer ready to do stuff: ' + data.id);
			return false;
		});
		
		// not all layers will call this
		$('#zeega-player').bind('ended',function(e, data){
			console.log('layer playback ended: ' + data.id);
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
		t.fadeIn();
		
	},
	
	// removes the player from the dom // resets the player? probably.
	close : function()
	{
		console.log('Zeega Player Close');
		$(window).unbind( 'keydown' ); //remove keylistener
		// remove the player div
		$('#zeega-player').fadeOut( 450, function(){ $(this).remove() } ); 
		
	},
	
	// goes to an arbitrary node
	gotoNode : function(nodeID)
	{
		console.log('gotoNode: '+ nodeID);
		this.currentNode = nodeID;
		this.preload();
		this.drawNodeLayers();
		this.setAdvance();
	},
	
	drawNodeLayers : function()
	{
		var _this = this;
		var currentNode = this.nodes.get(this.currentNode);
		_.each( currentNode.get('layers'), function(layerID, i){
			//console.log( _this.layerClasses[layerID] );
			_this.layerClasses[layerID].drawPublish( currentNode.get('layers').length - i);
		});
	},
	
	setAdvance : function()
	{
		
	},
	
	// compares the lookAhead to the loaded nodes and loads within the lookAhead horizon
	preload : function()
	{
		if(this.zeega)
		{
			var nodesOrder = this.route.get('nodesOrder');
			var index = _.indexOf(nodesOrder, this.currentNode);
			
			//see if node's layers are preloaded // starting with the currentNode
			//look ahead 2 and behind 2 // include current node also
			
			for (var i = 0  ; i < this.lookAhead*2+1 ; i++ )
			{
				//the offset spirals outward to load nearest nodes first
				var offset = Math.ceil(i/2) * (-1+(2*(i%2)));
				//make sure the nodes exist before trying to load them
				if( this.nodes.get( nodesOrder[index+offset] ) && !this.nodes.get( nodesOrder[index+offset] ).get('loaded') )
				{
					var nodeID = nodesOrder[index+offset];
					if( !_.include( this.nodesLoaded, nodeID ))
					{
						this.loadNodeAssets( nodeID );
						this.nodesLoaded.push( nodeID );
					}
				}
			}
			
		}else{
			// for standalone player // do later
		}
	},
	
	// loads the current node's assets unobtrusively. // should not be visible to the user
	loadNodeAssets : function(nodeID)
	{
		var _this = this;

		if(this.zeega)
		{
			//console.log( Zeega.route.nodes.get(nodeID) );
			_.each( this.nodes.get(nodeID).get('layers'), function(layerID){
				var layer = _this.layers.get(layerID);
				var layerType = layer.get('type');
				
				eval( 'var layerClass = new '+ layerType +'Layer();' );
				layerClass.load( _this.layers.get(layerID) );
				layerClass.preloadMedia();
				_this.layerClasses[layerID] = layerClass;
			});
			
		}else{
			// for standalone player // do later
		}
		
	},
	
	// advance node after a defined number of seconds have passed
	advanceAfterTimeElapsed : function(seconds)
	{
		
	},
	
	// advance node after the media inside it have finished playing
	advanceAfterMedia : function()
	{
		
	},
	

	// directional navigation
	
	goLeft : function()
	{
		console.log('goLeft');
		var nodesOrder = this.route.get('nodesOrder');
		var index = _.indexOf(nodesOrder, this.currentNode);
		
		if( index > 0 )
		{
			this.gotoNode( nodesOrder[index-1] )
		}else{
			console.log('end of the line');
		}
		
	},
	
	goRight : function()
	{
		console.log('goRight');
		var nodesOrder = this.route.get('nodesOrder');
		var index = _.indexOf(nodesOrder, this.currentNode);
		
		if( nodesOrder.length-1 > index )
		{
			this.gotoNode( nodesOrder[index+1] )
		}else{
			console.log('end of the line');
		}
	},
	
	goUp : function()
	{
		console.log('goUp')
	},
	
	goDown : function()
	{
		console.log('goDown')
	},
		
	template : "<div id='zeega-player'><div id='preview-left' class='preview-nav-arrow preview-nav'><img src='' onclick='Player.goLeft();return false'></div><div id='preview-right' class='preview-nav-arrow preview-nav'><img src='' onclick='Player.goRight();return false'></div><div id='preview-media'></div></div>"
	
	
	
	
	
	
	
} // Player
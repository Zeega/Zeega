
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
	//route : null,			//collection of routes
	nodes : null,			// collection of nodes
	layers : null,			// collection of layers
	
	
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
			//this.route = Zeega.route;
			this.nodes = Zeega.route.nodes;
			this.layers = Zeega.route.layers;
		}
		
		// all layers will make this call
		$('#zeega-player').bind('ready',function(e, data){
			console.log(data.id);
			return false;
		});
		
		// not all layers will call this
		$('#zeega-player').bind('ended',function(e, data){
			console.log(data.id);
			return false;
		});
		
		this.gotoNode(this.currentNode);
		this.draw();
		
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
		
	},
	
	// compares the lookAhead to the loaded nodes and loads within the lookAhead horizon
	preload : function()
	{
		if(this.zeega)
		{
			var nodesOrder = Zeega.route.get('nodesOrder');
			var index = _.indexOf(nodesOrder, this.currentNode);
			
			//see if node's layers are preloaded // starting with the currentNode
			//look ahead 2 and behind 2 // include current node also
			
			
			for (var i = 0  ; i < this.lookAhead*2+1 ; i++ )
			{
				//the offset spirals outward to load nearest nodes first
				var offset = Math.ceil(i/2) * (-1+(2*(i%2)));
				//make sure the nodes exist before trying to load them
				if( Zeega.route.nodes.get( nodesOrder[index+offset] ) && !Zeega.route.nodes.get( nodesOrder[index+offset] ).get('loaded') )
				{
					this.loadNodeAssets( nodesOrder[index+offset] );
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
			_.each( Zeega.route.nodes.get(nodeID).get('layers'), function(layerID){
				var layerType = Zeega.route.layers.get(layerID).get('type');
				eval( 'var layerClass = new '+ layerType +'Layer();' );
				layerClass.load( Zeega.route.nodes.get(nodeID) );
				
				//layerClass.preload();
				//_this.layers.push(layerClass);
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
		console.log('goLeft')
	},
	
	goRight : function()
	{
		console.log('goRight')
		
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
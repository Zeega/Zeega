
/********************************************

	ZEEGA.JS 

	CORE APPLICATION OBJECT
	
	VERSION 1.0
	
	
*********************************************/

/********************************************

	THE Zeega object to end all objects

*********************************************/

var Zeega = {
	routeID : 1,
	currentNode : null,
	
	previewMode:false,
	
	//ready flags
	nodesReady : false,
	layersReady : false,
	
	url_prefix : "http://alpha.zeega.org/test/web/app_dev.php/",
	
	url_hash : {
		'route' : null,
		'node' : null
	},
	
	//this function is called once all the js files are sucessfully loaded
	init : function()
	{
		//test to see if the URL_PREFIX constant has been set and add it if it has
		this.setURLPrefix();
	},
	
	setURLPrefix : function()
	{
		if( window.URL_PREFIX ) Zeega.url_prefix = URL_PREFIX;
	},
	
	//set the route without loading it
	//do we need this?
	setRoute : function(routeID)
	{
		this.routeID = routeID;
	},
	
	createRoute : function()
	{
		//make a new and empty route
		
		var newRoute = new Route();
		var z=this;
		
		newRoute.save({},{
		
			success: function(route,response){
				z.route=route;
				z.routeID= route.id;
				z.routeView = new RouteView({ model : z.route });
				z.routeView.render();
				z.loadNodes();
				z.loadLayers();
			
				console.log('new route created with id: '+ route.id);
			},
			error: function(){
				console.log('error');
			}
		
		
		});
		
	},
	
	//set and load a new route
	//this is the first function called when loading the editor in dev
	loadProject : function()
	{
		
		var z = this;
		this.projectID =  $('#project-id').val();
		console.log(this.projectID);
		this.project = new Project({ 'id' : this.projectID });
		this.project.fetch({
			success: function(project){
				z.projectView = new ProjectView({ model : z.project });
				z.projectView.render();
			}
		});
	},
	loadRoute : function(routeID)
	{
		
		var z = this;
		this.routeID = routeID;
		this.route = new Route({ 'id' : this.routeID });
		this.route.fetch({
			success: function(route){
				console.log('route: ');
				console.log(route);
				z.loadNodes();
				z.loadLayers();
				z.loadProject();
				
				if(!route.get('attr')) route.set({'attr':{}});
				
			}
		});
	},
	
	loadNodes : function()
	{
		var z = this;
		//create a node collection inside the route model
		this.route.nodes = new NodeCollection;
		//get all existing nodes

		this.route.nodes.fetch({
			success : function(nodes){
				
				//make a node view collection
				z.route.nodeViewCollection = new NodeViewCollection({ collection : nodes });
				//render everything in the nodeViewCollection
				z.route.nodeViewCollection.render();
				
				z.nodesReady = true;
				z.testIfReady();

			}
		});
	},
	
	loadLayers : function()
	{
		var z = this;
		//create a layer collection inside the route model
		this.route.layers = new LayerCollection;
		//get all existing layers
		
		this.route.layers.fetch({
			success : function(layers){
				
				//make a layer view collection
				z.route.layerViewCollection = new LayerViewCollection({ collection : layers });
				
				z.layersReady = true;
				z.testIfReady();
			}
		});
	},
	
	testIfReady : function()
	{
		if(this.layersReady && this.nodesReady)
		{
			//if no nodes exist, create one
			if( _.size(this.route.nodes) == 0 )
			{
				var newNode = new Node;
				this.route.nodeViewCollection.add(newNode);
				this.loadNode( newNode );
			}else if(this.url_hash.node){
				this.loadNode( this.route.nodes.get(this.url_hash.node) );
			}else{
				this.loadNode( this.route.nodes.at(0) );
			}
			
			this.nodeSort();
		}
	},
	
	loadNode : function( node )
	{
		//remove a prexisiting node style
		if(this.currentNode) $('.node-thumb-'+this.currentNode.id).removeClass('node-selected');
		
		this.currentNode = node;

		window.location.hash = '/node/'+ node.id; //change location hash
		
		Zeega.route.layerViewCollection._rendered = false;
		Zeega.route.layerViewCollection._layerViews = [];

		//set global currentNode to the selected node
		//add a new current node style
		$('.node-thumb-'+this.currentNode.id).addClass('node-selected');
		
		//clear the workspace
		$('#workspace').empty();
		
		var layerArray = _.without( this.currentNode.get('layers'), -1)
		_.each( layerArray , function(layerID){
			Zeega.route.layerViewCollection.add( Zeega.route.layers.get(layerID) );
		});
		Zeega.route.layerViewCollection.render();

	},
	
	addNode : function()
	{
		this.route.nodes.add(new Node);
	},
	
	addLayerToNode : function( node, layer )
	{
		console.log('addLayerToNode');
		//add URL to layer model
		layer.url = Zeega.url_prefix + 'routes/'+ Zeega.routeID +'/layers';
		
		//check to see if the layer is saved or not. save if needed
		if( layer.isNew() )
		{
			console.log('this is a new layer');
			layer.save(
				{},
				{
					success : function(savedLayer, response){
						//Add to the collectin
						if(node == Zeega.currentNode) Zeega.route.layers.add( savedLayer );
						else Zeega.route.layers.add( savedLayer,{silent:true} );
						
						Zeega.updateAndSaveNodeLayer(node,savedLayer);
						node.updateThumb();
					}
				});
			//save the new layer then prepend the layer id into the node layers array
		}else{
			console.log('this is an old layer');
			//prepend the layer id into the node layers array
			this.updateAndSaveNodeLayer(node,layer);
			
			node.updateThumb();
		}
		
	},
	
	updateAndSaveNodeLayer : function(node, layer)
	{
		console.log('updateAndSaveNodeLayer');
		var layerOrder = [layer.id];
		if( node.get('layers') )
		{
			//if the layer array already exists
			layerOrder = node.get('layers');
			//add the layer id to the layer order array
			layerOrder.unshift( layer.id );
		}
		
		//set the layerOrder array inside the node
		node.set({'layers':layerOrder});
		node.save();
	},
	
	removeLayerFromNode : function( node, layer )
	{
		//remove from node.layer and save it back
		var layerOrder = node.get('layers');
		layerOrder = _.without(layerOrder,layer.id);
		//set array to -1 if empty  //weirdness
		if(layerOrder.length == 0) layerOrder.push(-1);
		node.set({'layers':layerOrder});
		node.save();
		
		this.destroyOrphans();
		
		node.updateThumb();
		
	},
	
	destroyOrphans : function()
	{
		// make a giant array of all the layer IDs in use by nodes
		var layersInNodes = [];
		_.each( _.toArray(this.route.nodes), function(node){
			layersInNodes = _.union(node.get('layers'), layersInNodes);
		});
		
		layersInNodes = _.without(layersInNodes, -1); //remove the default -1 value
		
		// make a giant array of all the layer IDs saved in the route
		var layersInRoute = [];
		_.each( _.toArray(this.route.layers), function(layer){
			layersInRoute.push(layer.id);
		});
		var orphanIDs = _.difference(layersInRoute, layersInNodes);
		
		if(orphanIDs)
		{
			_.each(orphanIDs, function(orphanID){
				//removes and destroys the orphan
				var orphan = Zeega.route.layers.get(orphanID);
				Zeega.route.layers.remove(orphan)
				orphan.destroy();
				
			})
		}else{
			return false;
		}
		
		
	},
	
	persistLayerOverNodes : function(layer)
	{
		console.log('peristing');
		//function(layer,[nodes])
		//eventually you should pass in an array of node IDs and only add to those nodes
		//for now we persist to all nodes EXCEPT the currentNode

		_.each( _.toArray(this.route.nodes), function(node){
			if(node != Zeega.currentNode)
			{
				//test to see if it exists in any of the target nodes. If so, DO NOT add
				var layerArray = _.toArray( node.get('layers') );
				if( ! _.include(layerArray,layer.id) ) Zeega.addLayerToNode(node, layer);
			}
		});
		
		//add to the route persistLayers array
		var attr = this.route.get('attr');
		
		//if the array exists and the layer isn't already inside it
		if( attr.persistLayers && !_.include( _.toArray(attr.persistLayers),layer.id) )
		{
			attr.persistLayers.push(layer.id);
			attr.persistLayers = _.uniq(attr.persistLayers);
			console.log('new layer persisting')
			this.route.set({'attr': attr});
			this.route.save();
			
		//if the array doesn't exist
		}else{
			
			attr.persistLayers = [layer.id];
			this.route.set({'attr':attr});
			this.route.save();
		}
		
	},
	
	removeLayerPersist : function(layer)
	{
		console.log('remove persistance!');
		//removes layers from the route layerPersist array
		//does not affect existing layers or nodes
		//future nodes will not have the persisting layers
		var attr = this.route.get('attr');
		attr.persistLayers = _.without( attr.persistLayers, layer.id );
		this.route.set({'attr':attr});
		this.route.save();
	},
	
	updateLayerOrder : function(layerIDs)
	{
		// updates z-index of divs in workspace
		_.each(layerIDs, function(id, i){ $('#layer-preview-'+ id ).css('z-index', _.size(layerIDs) - i) });

		//update the layerOrder array 
		this.currentNode.set({'layers':layerIDs})
		this.currentNode.save();

		//update node thumb
		this.currentNode.updateThumb();

	},
	
	destroyNode : function( view )
	{
		if( confirm('Delete Node?') )
		{
			//clear workspace if it's the current node
			if(view.model == this.currentNode) $('#workspace').empty();
			//if not the last node, then load the node to the left of the current node
			if( view.model == this.currentNode && this.route.nodes.length > 1 )
			{
			  //if the node is the current node load new node
			  this.loadNode( this.route.nodes.at( _.indexOf( _.toArray( this.route.nodes ), this.currentNode) -1 ) );
			}
			//remove the node from the node collection
			this.route.nodes.remove();
			
			view.model.destroy();
			view.remove();
			//if it's the last node, make a new, empty one
			
			if( _.size(Zeega.route.nodes) == 0 )
			{
				var newNode = new Node;
				Zeega.route.nodeViewCollection.add(newNode);
				Zeega.loadNode( newNode );
			}
			this.nodeSort();
		}
	},
		
	nodeSort : function()
	{
		//turn the string IDs into integers to compare with model IDs
		var order = _.map( $('#node-drawer ul').sortable('toArray'), function(str){ return parseInt(str) });
		this.route.set({'nodesOrder': order});
		this.route.save();
		console.log(order);
	},
	
	previewRoute : function()
	{
		console.log('PREVIEWING');
		this.previewMode = true;
		//remove branch viewer if present
		
		projectData = '';
		
		Player.projectData = projectData;
		Player.currentNode = this.currentNode.id;
		Player.init();
	
	},
	
	/***************
	*
	*	returns the rout as zPub json data
	*
	*****************/
	getZPub : function()
	{
		//dead fxn?
		this.zPubData = 'tester';
		
		
		console.log(this.zPubData);
	},
	
	getLeftNode : function()
	{
		var currentNodeIndex = _.indexOf( this.route.get('nodesOrder'),this.currentNode.id );
		if(currentNodeIndex > 0 ) return this.route.nodes.at( currentNodeIndex-1 );
		else return false;
	},
	
	getRightNode : function()
	{
		var currentNodeIndex = _.indexOf( this.route.get('nodesOrder'),this.currentNode.id );
		if(currentNodeIndex < _.size( this.route.nodes )-1 )return this.route.nodes.at( currentNodeIndex+1 );
		else return false;
	},
	
	loadLeftNode : function()
	{
		var node = this.getLeftNode();
		console.log(node);
		if(node) this.loadNode(node)
	},
	
	loadRightNode : function()
	{
		var node = this.getRightNode();
		console.log(node);
		
		if(node) this.loadNode(node)
	}
	
	
};


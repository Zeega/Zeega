
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
	
	maxNodesPerRoute : 0, // 0 = no limit
	maxLayersPerNode : 5, // 0 = no limit
	
	//ready flags
	nodesReady : false,
	layersReady : false,
	
	url_prefix : "",
	
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
	
	clearCurrentNode : function ()
	{
		console.log('clearing current node');
		//remove a prexisiting node style
		if(this.currentNode) $('.node-thumb-'+this.currentNode.id).removeClass('node-selected');
		
		//clear out existing stuff in icon tray
		$('.icon-tray').empty();

		//clear the workspaces
		$('#workspace').empty();
		$('#interaction-workspace').empty();
		//$('.workspace').empty();
		
		
		
		Zeega.route.layerViewCollection._rendered = false;
		Zeega.route.layerViewCollection._layerViews = [];
	},
	
	loadNode : function( node )
	{
		
		this.clearCurrentNode();
		
		//set global currentNode to the selected node
		this.currentNode = node;

		if(node) window.location.hash = '/node/'+ node.id; //change location hash
		else window.location.hash = 'newNode';
		//open/close visual editor
		var el = $('#workspace');

		if( !this.currentNode.get('attr').editorHidden && el.is(':hidden')){
			el.show('blind',{'direction':'vertical'});
			$('#ve-toggle').html('–');
		}else if( this.currentNode.get('attr').editorHidden && el.is(':visible'))
		{
			el.hide('blind',{'direction':'vertical'});
			$('#ve-toggle').html('+');
		}
		
		
		//update the auto advance tray
		//make sure the attribute exists
		var adv = this.currentNode.get('attr').advance;
		if(adv)
		{
			if(adv > 0)
			{
				//after time in seconds
				$('#advance-controls').find('#time').attr('checked','true');
				$('#advance-controls').find('#manual').removeAttr('checked');
				$('#advance-controls').find('#playback').removeAttr('checked');
				$('#advance-time').val(adv);
			}else if(adv == 0){
				//after media
				$('#advance-controls').find('#time').removeAttr('checked');
				$('#advance-controls').find('#manual').removeAttr('checked');
				$('#advance-controls').find('#playback').attr('checked','true');
				$('#advance-time').val(10);
			}else{
				//manual
				$('#advance-controls').find('#time').removeAttr('checked');
				$('#advance-controls').find('#manual').attr('checked','true');
				$('#advance-controls').find('#playback').removeAttr('checked');
				$('#advance-time').val(10);
			}
		//if the attr doesn't exist, then give it default values
		}else{
			$('#advance-controls').find('#time').removeAttr('checked');
			$('#advance-controls').find('#manual').removeAttr('checked');
			$('#advance-controls').find('#playback').attr('checked', true);
			$('#advance-time').val(10);
		}
		
		//add the node's layers
		var layerArray = _.compact( this.currentNode.get('layers'))
		_.each( layerArray , function(layerID){
			Zeega.route.layerViewCollection.add( Zeega.route.layers.get(layerID) );
		});
		
		console.log(layerArray);
		
		//draw the layers
		Zeega.route.layerViewCollection.render();

		//add a new current node style
		$('.node-thumb-'+this.currentNode.id).addClass('node-selected');
	},
	
	addNode : function()
	{
		this.route.nodes.add(new Node);
	},
	
	addLayerToNode : function( node, layer )
	{
		//reject if there are too many layers inside the node
		if( !node.get('layers') || node.get('layers').length < this.maxLayersPerNode || this.maxLayersPerNode == 0)
		{
			console.log('addLayerToNode');
			//add URL to layer model
			layer.url = Zeega.url_prefix + 'routes/'+ Zeega.routeID +'/layers';
		
			//check to see if the layer is saved or not. save if ndeeded
			if( layer.isNew() )
			{
				console.log('this is a new layer');
				layer.save(
					{},
					{
						success : function(savedLayer, response){
							Zeega.updateAndSaveNodeLayer(node,savedLayer);
							
							//Add to the collection
							if(node == Zeega.currentNode) Zeega.route.layers.add( savedLayer );
							else Zeega.route.layers.add( savedLayer,{silent:true} );
						
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
		}
	},
	
	updateAndSaveNodeLayer : function(node, layer)
	{
		console.log('updateAndSaveNodeLayer');
		var layerOrder = [layer.id];
		if( node.get('layers') )
		{
			//if the layer array already exists eliminate false values if they exist
			layerOrder = _.compact( node.get('layers') );
			//add the layer id to the layer order array
			layerOrder.push( layer.id );
		}
		//set the layerOrder array inside the node
		node.set({'layers':layerOrder});
		node.save();
	},
	
	removeLayerFromNode : function( node, layer )
	{
		//remove from node.layer and save it back
		
		
		//remove icon from tray
		$('.'+layer.get('type').toLowerCase()+'-tray-icon').remove();
		
	
		
		//test to see if the layer is a persisting layer and destroy it from all nodes if so
		var attr = this.route.get('attr');
		
		if(_.include(attr.persistLayers,layer.id))
		{
			console.log('a persistent layer');
			this.removeLayerPersist(layer)
			_.each( _.toArray(this.route.nodes), function(_node){
				var layerOrder = _node.get('layers');
				layerOrder = _.without(layerOrder,layer.id);
				if(layerOrder.length == 0) layerOrder = [false];
				_node.set({'layers':layerOrder});
				_node.save();
				_node.updateThumb();
			});
		}else{
			console.log('NOT a persistent layer');
			
			var layerOrder = node.get('layers');
			layerOrder = _.without(layerOrder,layer.id);
			//set array to false if empty  //weirdness
			if(layerOrder.length == 0) layerOrder = [false]; //can't save an empty array so I put false instead. use _.compact() to remove it later
			node.set({'layers':layerOrder});
			node.save();
			node.updateThumb();
		}
		
		this.destroyOrphans();
		
	},
	
	destroyOrphans : function()
	{
		_this = this;
		// make a giant array of all the layer IDs in use by nodes
		var layersInNodes = [];
		_.each( _.toArray(this.route.nodes), function(node){
			layersInNodes = _.union(node.get('layers'), layersInNodes);
		});
		
		layersInNodes = _.compact(layersInNodes); //remove falsy values needed to save 'empty' arrays
		
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
				_this.removeLayerPersist(orphan);
				Zeega.route.layers.remove(orphan)
				orphan.destroy();
				
			})
		}else{
			return false;
		}
		
		
	},
	
	copyLayerToNextNode : function(layer)
	{
		console.log('copy to next layer');
		var nextNode = this.getRightNode();
		if (nextNode) this.addLayerToNode(nextNode,layer);
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
		console.log('updateLayerOrder');
		layerIDs = layerIDs.reverse();
		// updates z-index of divs in workspace
		_.each(layerIDs, function(id, i){ $('#layer-preview-'+ id ).css('z-index', i) });
		console.log(layerIDs)

		//update the layerOrder array 
		this.currentNode.set({'layers':layerIDs})
		this.currentNode.save();

		//update node thumb
		this.currentNode.updateThumb();

	},
	
	destroyNode : function( view )
	{
//		if( confirm('Delete Node?') )
		if( true )
		{

			//try to move to left node
			if( view.model == this.currentNode) this.loadLeftNode();

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
			
			this.destroyOrphans();
			
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
	
	
	getLeftNode : function()
	{
		var nodeOrder = this.route.get('nodesOrder');
		var currentNodeIndex = _.indexOf( nodeOrder,this.currentNode.id );
		if( currentNodeIndex ) return this.route.nodes.get( nodeOrder[ currentNodeIndex-1 ] );
		else return this.route.nodes.get( nodeOrder[1] );
	},
	
	getRightNode : function()
	{
		var currentNodeIndex = _.indexOf( this.route.get('nodesOrder'),this.currentNode.id );
		if(currentNodeIndex < _.size( this.route.nodes )-1 ) return this.route.nodes.at( currentNodeIndex+1 );
		else return false;
	},
	
	loadLeftNode : function()
	{
		console.log('loading left node')
		var node = this.getLeftNode();
		if(node) this.loadNode(node)
	},
	
	loadRightNode : function()
	{
		var node = this.getRightNode();
		console.log(node);
		
		if(node) this.loadNode(node)
	}
	
	
};
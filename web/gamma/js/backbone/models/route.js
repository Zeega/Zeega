/***	This is where everything starts	***/

var Route = Backbone.Model.extend({
	
	//set defaults for empty route
	defaults : {
		//title : "Untitled"
		},
		
	url : function()
	{
		var base = Zeega.url_prefix+'routes';
		if (this.isNew()) return base;
		return base + '/' + this.id;
	},

	initialize : function()
	{
		
	},
	
	loadNodes : function()
	{
		
		console.log('loading nodes');
		
		
		var routeView = new RouteView({
			model : this
		});
		
		//console.log(this);
		
		routeView.render();
		
		//create a node collection inside the route model
		//console.log('node view init');
		this.nodes = new NodeCollection;
		//get all existing nodes
		this.nodes.fetch({
			success : function(nodes)
			{
				//make a node view collection
				//fancy!
				that.nodeViewCollection = new NodeViewCollection({
					collection : nodes
				});
				//render everything in the nodeViewCollection
				that.nodeViewCollection.render();
				
				/**	Load the first node into the editor	**/
				
				loadNode( nodes.at(0) );
				
			}
		});
	}
	
});

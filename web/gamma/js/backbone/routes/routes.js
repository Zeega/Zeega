var MyRouter = Backbone.Router.extend({
	
	pushState : false,
	silent : true,
	
	routes : {
		"node/:nodeid" : "gotoNode",
		"node/:nodeid/:layerid" : "gotoLayer"
	},

	// open/load the assigned node
	gotoNode : function(nodeid) {

			if(Zeega && nodeid) Zeega.url_hash.node = nodeid;
			//check to see if the node is already loaded, or if it should move to that node
			//if(Zeega.route.nodes) Zeega.loadNode( Zeega.route.nodes.get(nodeid) );
		
	},

	// open/load the assigned node and layer
	// do we need this?
	gotoLayer : function(nodeid,layerid) {
		
	}
	
});
 
 

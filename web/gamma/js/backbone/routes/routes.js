var MyRouter = Backbone.Router.extend({
	
	pushState : false,
	silent : true,
	
	routes : {
		"/editor/node/:nodeid" : "gotoNodeInEditor",
		"/player/node/:nodeid" : "gotoNodeInPlayer",
		
		//"node/:nodeid/:layerid" : "gotoLayer"
	},

	// open/load the assigned node
	gotoNodeInEditor : function(nodeid) {

			if(Zeega && nodeid)
			{
				if(nodeid == 'undefined') Zeega.url_hash.node = '';
				else Zeega.url_hash.node = nodeid;
			}
			//check to see if the node is already loaded, or if it should move to that node
			if(Zeega.route.nodes && Zeega.currentNode.id != nodeid) Zeega.loadNode( Zeega.route.nodes.get(nodeid) );
		
	},

	gotoNodeInEditor : function(nodeid) {

			if(Zeega && nodeid)
			{
				if(nodeid == 'undefined') Zeega.url_hash.node = '';
				else Zeega.url_hash.node = nodeid;
			}
			//check to see if the node is already loaded, or if it should move to that node
			if(Zeega.route.nodes && Zeega.currentNode.id != nodeid) Zeega.loadNode( Zeega.route.nodes.get(nodeid) );
		
	},
	
});
 
 

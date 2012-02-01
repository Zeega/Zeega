var MyRouter = Backbone.Router.extend({
	
	pushState : false,
	silent : true,
	
	routes : {
		"/editor/frame/:nodeid" : "gotoNodeInEditor",
		"/player/frame/:nodeid" : "gotoNodeInPlayer",
	},

	// open/load the assigned node
	gotoNodeInEditor : function(nodeid)
	{
		//close the player if it's open
		if( Zeega.previewMode == true )
		{
			Player.close();
		}
		
		if(Zeega && nodeid)
		{
			if(nodeid == 'undefined') Zeega.url_hash.node = '';
			else Zeega.url_hash.node = nodeid;
		}
		//check to see if the node is already loaded, or if it should move to that node
		if(Zeega.route.nodes && Zeega.currentNode.id != nodeid) Zeega.loadNode( Zeega.route.nodes.get(nodeid) );
	
	},

	gotoNodeInPlayer : function(nodeid)
	{
		//go to the frame designated
		Player.gotoNode( nodeid );
	},
	
});
 
 

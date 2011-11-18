/*---------------------------------------------


	Object: NodePlayer
	The Zeega project web player. Part of Core.


---------------------------------------------*/

var NodePlayer = {
	
	/*
		Method: init
		Initializes the player object
		
		Parameters:
			
			data - A Zeega data object in JSON.
			route - The route index of the starting node.
			nodeID - The id of the starting node.
	
	*/
	init : function( data )
	{

		//this.parseProject;
		this.drawNode(data);

	},
	
	/*
		Method: drawNode
		Places a completely preloaded node into view. Also manages the state of the navigation arrows.
		
		Parameters:
			
			nodeID - The id of the node to be drawn.
	*/
	drawNode : function( data )
	{
		
		_.each( data, function( layer ){
			eval( 'var layerClass = new '+ layer.type +'Layer();' );
			layerClass.load( layer )
			layer.layerClass = layerClass;
			layer.layerClass.preloadMedia();
			layer.layerClass.drawPublish();
		})
		
		
	}

}

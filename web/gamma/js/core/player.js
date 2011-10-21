
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
	currentNode : null,		// the node currently on/to start on
	lookAhead : 2,			// the number of nodes to preload ahead of the currentNode
	
	//stuff to do at the start
	init : function()
	{
		
	},
	
	// draws the player to the page // appends to body
	draw : function()
	{
		
	},
	
	// removes the player from the dom // resets the player? probably.
	close : function()
	{
		
	},
	
	// goes to an arbitrary node
	gotoNode : function(nodeID)
	{
		
	},
	
	// loads the current node's assets unobtrusively. // should not be visible to the user
	loadNodeAssets : function(nodeID)
	{
		
	},
	
	// compares the lookAhead to the loaded nodes and loads within the lookAhead horizon
	preload : function()
	{
		
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
		
	},
	
	goRight : function()
	{
		
	},
	
	goUp : function()
	{
		
	},
	
	goDown : function()
	{
		
	}
	
	
	
	
	
	
	
	
} // Player
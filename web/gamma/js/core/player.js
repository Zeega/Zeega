
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
		console.log('Zeega Player Initialized');
		var _this = this;
		
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
		
		// all layers will make this call
		$('#zeega-player').bind('ready',function(data){
			console.log(data.id);
		});
		
		// not all layers will call this
		$('#zeega-player').bind('ended',function(data){
			console.log(data.id);
		});
		
		this.draw();
		
	},
	
	// draws the player to the page // appends to body
	draw : function()
	{
		
		$('body').append(this.template);
		
	},
	
	// removes the player from the dom // resets the player? probably.
	close : function()
	{
		console.log('Zeega Player Close');
		$(window).unbind( 'keydown' ); //remove keylistener
		
		$('#zeega-player').fadeOut( 450, function(){ $(this).remove() } );
		
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
	
	template : $(this.templateString),
	
	templateString : "<div id='zeega-player'><div id='preview-left' class='preview-nav-arrow preview-nav'><img src='' onclick='Player.goLeft();return false'></div><div id='preview-right' class='preview-nav-arrow preview-nav'><img src='' onclick='Player.goRight();return false'></div><div id='preview-media'></div></div>"
	
	
	
	
	
	
	
} // Player
var Player = {
	
	player = this;
	currentNodeID : null,

	init : function()
	{
		//set defaults here
		//call draw
	},
	
	draw : function()
	{
		//append the div to the body
	},
	
	close : function()
	{
		
	},
	
	setListeners : function()
	{
		
	},
	
	reset : function()
	{
		
	},
	
	preload : 
	{
		future : function()
		{
			
		},
		node : function()
		{
			
		},
		layer : function()
		{
			
		}
	},
	
	loadingBar :
	{
		draw : function()
		{
			
		},
		update : function()
		{
			
		},
		remove : function()
		{
			
		}
	},
	
	goto :
	{
		node : function(nodeID)
		{
			
		},
		up : function()
		{
			
		},
		right : function()
		{
			
		},
		down : function()
		{
			
		},
		left : function()
		{
			
		}
	},
	
	//returns the id of the node in any direction n nodes ahead
	getNode :
	{
		up : function(num)
		{
			
		},
		right : function(num)
		{
			
		},
		down : function(num)
		{
			
		},
		left : function(num)
		{
			
		}
	},
	
	getTemplate : function()
	{
	 	html= "<div id='zeega-player'><div id='preview-left' class='preview-nav-arrow preview-nav'><div class='arrow-background'></div><img src='/joseph/web/gamma/images/mediaPlayerArrow_shadow.png' height='75' width='35' onclick='Player.goLeft();return false'></div><div id='preview-right' class='preview-nav-arrow preview-nav'><div class='arrow-background'></div><img src='/joseph/web/gamma/images/mediaPlayerArrow_shadow.png' height='75' width='35' onclick='Player.goRight();return false'></div><div id='preview-media'></div></div>";
		return html;
	}




}
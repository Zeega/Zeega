/*---------------------------------------------


	Object: FramePlayer
	The Zeega project web player. Part of Core.


---------------------------------------------*/

var FramePlayer = {
	
	/*
		Method: init
		Initializes the player object
		
		Parameters:
			
			data - A Zeega data object in JSON.
			sequence - The sequence index of the starting frame.
			frameID - The id of the starting frame.
	
	*/
	init : function( data )
	{

		//this.parseProject;
		this.drawFrame(data);

	},
	
	/*
		Method: drawFrame
		Places a completely preloaded frame into view. Also manages the state of the navigation arrows.
		
		Parameters:
			
			frameID - The id of the frame to be drawn.
	*/
	drawFrame : function( data )
	{
		_.each( data, function( layer ){
			if(layer.type=='Youtube'||layer.type=='Video' || layer.type == 'image') layerClass = new ImageLayer();
			else eval( 'var layerClass = new '+ layer.type +'Layer();' );
			layerClass.lightLoad( layer )

			$('#zeega-player').append( layerClass.thumbnail );
		});
	}
}

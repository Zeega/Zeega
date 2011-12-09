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
			console.log(layer);
			if(layer.type=='Geo'||layer.type=='Image'||layer.type=='Text'||layer.type=='DocumentCloud'){
				eval( 'var layerClass = new '+ layer.type +'Layer();' );
				layerClass.lightLoad( layer )
				//layer.layerClass = layerClass;

				$('#zeega-player').append( layerClass.thumbnail );
			}
			
			// Loading video/youtube/audio layers breaks the headless browser for some reason
			
			else if (layer.type=='Youtube'||layer.type=='Video'){
				if(!layer.attr.y) layer.attr.y=0;
				if(!layer.attr.x) layer.attr.x=0;
				if(!layer.attr.w) layer.attr.w=100;
				if(!layer.attr.dimension) layer.attr.dimension=1.3;
				var h = Math.floor(layer.attr.w*1.5/layer.attr.dimension);
				$('#preview-media').append($('<div id="ggg">').css( {
					'backgroundImage':'url('  + sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + 'images/items/'+layer.attr.item_id+'_s.jpg)',
					'backgroundSize': '100px 100px',
					'position' : 'absolute',
					'top' : layer.attr.y+"%",
					'left' : layer.attr.x+"%",
					'z-index' : layer.zIndex,
					'width' : layer.attr.w+"%",
					'height' : h+"%",
					'opacity' : layer.attr.opacity
				}));
			
			
		}
		
		
	});
	}
}

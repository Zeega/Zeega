/*---------------------------------------------


	Object: FramePlayer
	The Zeega project web player. Part of Core.


---------------------------------------------*/


$(document).ready(function(){
	
	var frameData = $.parseJSON(frameJSON);
	var layersData = $.parseJSON(layersJSON);

	_.each( frameData.layers, function(layerID){
		var layer = _.find( layersData, function(layer){ return layer.id == layerID });
		
		if( !_.isUndefined( layer.attr.thumbnail_url) && layer.attr.thumbnail_url != '' ) drawLayer( layer );
	})
	
	
})

function drawLayer( layer )
{
	var visual = $('<img src="'+ layer.attr.thumbnail_url +'"/>').css({
		'position':'absolute',
		'left':layer.attr.left+'%',
		'top':layer.attr.top+'%',
		'width':layer.attr.width+'%',
		//'height':layer.attr.height+'%',
		'opacity':layer.attr.opacity
	});
	
	$('#zeega-player').append(visual);
}
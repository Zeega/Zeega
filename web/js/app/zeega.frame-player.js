/*---------------------------------------------


	Object: FramePlayer
	The Zeega project web player. Part of Core.


---------------------------------------------*/


$(document).ready(function(){
	
	var frameData = $.parseJSON(frameJSON);
	var layersData = $.parseJSON(layersJSON);

	_.each( frameData.layers, function(layerID){
		var layer = _.find( layersData, function(layer){ return layer.id == layerID });
		
		if( !_.isUndefined( layer.attr.thumbnail_url) && layer.attr.thumbnail_url != '' && layer.type != 'Audio' ) drawLayerThumbnail( layer );
		else if( layer.type == 'Rectangle' ) drawRectangle( layer ); // this is a bandaid
	})
	
	
})

function drawLayerThumbnail( layer )
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

function drawRectangle( layer )
{
	var visual = $('<div>').css({
		'position':'absolute',
		'left':layer.attr.left+'%',
		'top':layer.attr.top+'%',
		'width':layer.attr.width+'%',
		'height':layer.attr.height+'%',
		'opacity':layer.attr.opacity,
		'background-color':layer.attr.backgroundColor
	});
	
	$('#zeega-player').append(visual);
}
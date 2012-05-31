/*---------------------------------------------


	Object: FramePlayer
	The Zeega project web player. Part of Core.


---------------------------------------------*/


$(document).ready(function(){
	
	var frameData = $.parseJSON(frameJSON);
	var layersData = $.parseJSON(layersJSON);

	console.log(frameJSON)
	console.log(layersJSON)
	console.log(frameData)
	console.log(layersData)

	_.each( frameData.layers, function(layerID){
		var layer = _.find( layersData, function(layer){ return layer.id == layerID });
		
		if( !_.isUndefined( layer.attr.thumbnail_url) && layer.attr.thumbnail_url != '' && layer.type != 'Audio' && layer.type != 'Link' )
			drawLayerThumbnail( layer );
		else if( layer.type == 'Rectangle' ) drawRectangle( layer ); // this is a bandaid
		else if(layer.type == 'Text') drawText(layer);
		else if(layer.type == 'Geo') drawStreetView(layer);
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

function drawText( layer )
{
	console.log(layer)
	
	var visual = $('<div>').css({
		'position':'absolute',
		'left':layer.attr.left+'%',
		'top':layer.attr.top+'%',
		'width':layer.attr.width+'%',
		'height':layer.attr.height+'%',
		'opacity':layer.attr.opacity,
		'font-size': layer.attr.fontSize +'%',
		'color' : layer.attr.color,
		'font-family' : 'sans-serif'
	}).html(layer.attr.content);
	
	$('#zeega-player').append(visual);
	
}

function drawStreetView(layer)
{
	var s = 'http://maps.googleapis.com/maps/api/streetview?size=400x400&location='+ layer.attr.lat +','+ layer.attr.lng +'&fov=90&heading='+ layer.attr.heading +'&pitch='+ layer.attr.pitch +'&sensor=false';
	var visual = $('<img src="'+ s +'"/>').css({
		'position':'absolute',
		'left':layer.attr.left+'%',
		'top':layer.attr.top+'%',
		'width':layer.attr.width+'%',
		'height':layer.attr.height+'%',
		'opacity':layer.attr.opacity
	});
	$('#zeega-player').append(visual);
	
}











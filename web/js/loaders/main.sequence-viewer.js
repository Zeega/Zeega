/********************************************

	main.sequence-viewer.JS
	
	VERSION 0.1
	
	LOADS JS FILES

*********************************************/
require.config({
	baseUrl : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'js/',
	paths : {
		'order' : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'js/lib/order',
		'text' : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'js/lib/text'
	}
})

var loadFiles = [
	'jquery',
	
	'order!lib/jquery/ui/js/jquery-ui-1.8.17',
	
	'order!lib/underscore',
	'order!lib/backbone',
	'order!lib/leaflet/leaflet',
	
	'order!app/zeega.project-viewer',
	'order!app/zeega.player',
	
	
	'order!helpers/zeega.helpers',
	'order!helpers/zeega.extends',
	
	'order!lib/spin',
	'order!lib/jquery/plugins/spin',
	'order!lib/popcorn_flash',
	
	//'order!app/views/editor.layer/editor.view.layer.control-library',
	'order!app/views/editor.layer/editor.view.layer.layer-list',
	'order!app/views/editor.layer/editor.view.layer.visual-editor',
	'order!app/models/editor.model.layer',

	'order!plugins/layers/video/video',
	'order!plugins/layers/audio/audio',
	'order!plugins/layers/image/image',
	'order!plugins/layers/geo/geo',
	'order!plugins/layers/text/text',
	'order!plugins/layers/mapbox/mapbox',

	'order!plugins/layers/rectangle/rectangle',
	//'order!plugins/layers/documentcloud/documentcloud',
	
	
	//'order!plugins/players/zeega.player.video',
	//'order!plugins/players/zeega.player.youtube',	
	       
	'order!plugins/players/plyr'
	];

require(loadFiles, function($) {
	zeega.app.init()

	var frameID = window.location.hash.substr(15);
	console.log(frameID)
	//this url needs to change
	
	/*
	if(sessionStorage.getItem('projectId')>0) $.get(sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'projects/'+sessionStorage.getItem('projectId')+'/all',function(data){ Player.init(data,null,frameID) });
	else $.get(sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'api/collections/'+sessionStorage.getItem('collectionId')+'/project',function(data){ Player.init(data,null,frameID) });
	*/
});

/**

	MAIN.JS
	
	VERSION 0.1
	
	LOADS JS FILES

**/
require.config({
	baseUrl : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'js/',
	paths : {
		'order' : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'js/lib/order',
		'text' : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'js/lib/text'
	}
})

var loadFiles = [

	'order!lib/underscore',
	'order!lib/backbone',
	'order!lib/leaflet/leaflet',
	'order!helpers/zeega.helpers',

	'order!app/zeega.frame-player',
	'order!lib/dropbox',


	//models
	'order!app/models/editor.model.layer',

	//views
	'order!app/views/editor.layer/editor.view.layer.visual-editor',
	'order!app/views/editor.layer/editor.view.layer.layer-list',
	//'order!app/views/editor.layer/editor.view.layer.visual-editor',
	//'order!app/views/editor.modals/editor.view.modal.ingest-dropbox',
	//'order!app/views/editor.modals/editor.view.modal.ingest-dropbox-iframe',

	//layers
	//'order!plugins/layers/video/video',
	//'order!plugins/layers/audio/audio',
	'order!plugins/layers/geo/geo',
	'order!plugins/layers/image/image',
	'order!plugins/layers/mapbox/mapbox',
	'order!plugins/layers/text/text',
	'order!plugins/layers/googlebook/googlebook',
	'order!plugins/layers/rectangle/rectangle',
	
	];

require(loadFiles, function($) {

	jQuery('body').css({'background-color': 'red'});
	console.log('LOADED')
	zeega.app.init();
	

/*
	//this url needs to change
	$.getJSON(sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'frames/'+frameId+'/layers',function(data){
		FramePlayer.init( data );
	});
*/

});

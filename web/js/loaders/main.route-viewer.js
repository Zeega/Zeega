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
	
	'order!jquery/ui/js/jquery-ui-1.8.17',
	
	'order!lib/underscore',
	
	'order!helpers/zeega.helpers',
	'order!helpers/zeega.extends',
	
	'order!lib/spin',
	'order!lib/jquery/plugins/spin',
	'order!lib/dropbox',
	
	
	'order!app/_layer',
	'order!plugins/layers/video/video',
	'order!plugins/layers/audio/audio',
	'order!plugins/layers/image/image',
	'order!plugins/layers/geo/geo',
	'order!plugins/layers/text/text',
	'order!plugins/layers/rdio/rdio',
	'order!plugins/layers/youtube/youtube',
	'order!plugins/layers/rectangle/rectangle',
	'order!plugins/layers/documentcloud/documentcloud',
	
	
	'order!plugins/players/zeega.player.video',
	'order!plugins/players/zeega.player.youtube',	
	
	//'order!app/views/editor.modals/editor.view.modal.ingest-dropbox',
	//'order!app/views/editor.modals/editor.view.modal.ingest-dropbox-iframe',
	       
	'order!app/player'
	];

require(loadFiles, function($) {
	var frameID = window.location.hash.substr(15);
	console.log(frameID)
	//this url needs to change
	
	if(sessionStorage.getItem('projectId')>0) $.get(sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'projects/'+sessionStorage.getItem('projectId')+'/all',function(data){ Player.init(data,null,frameID) });
	else $.get(sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'api/collections/'+sessionStorage.getItem('collectionId')+'/project',function(data){ Player.init(data,null,frameID) });
	
});

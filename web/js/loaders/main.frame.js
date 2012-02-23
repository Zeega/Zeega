/**

	MAIN.JS
	
	VERSION 0.1
	
	LOADS JS FILES

**/

var loadFiles = [
	'jquery',
	'order!app/zeega.frame-player',
	'order!helpers/zeega.helpers',
	'order!helpers/zeega.extends',
	'order!lib/underscore',
	
	'order!app/_layer',
	'order!plugins/layers/image/image',
	'order!plugins/layers/geo/geo',
	'order!plugins/layers/text/text',
	'order!plugins/layers/video/video',
	'order!plugins/layers/youtube/youtube',
	'order!plugins/layers/documentcloud/documentcloud',
	'order!plugins/layers/rectangle/rectangle',	            
    'order!plugins/layers/website/website',
	];

require(loadFiles, function($) {
	var frameId = sessionStorage.getItem('frameId');

	//this url needs to change
	$.getJSON(sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'frames/'+frameId+'/layers',function(data){
		FramePlayer.init( data );

	});
});

/**

	MAIN.JS
	
	VERSION 0.1
	
	LOADS JS FILES

**/

var loadFiles = [
	'jquery',
	'order!core/framePlayer',
	'order!helpers/zeega.helpers',
	'order!helpers/zeega.extends',
	'order!libraries/underscore',
	
	'order!layers/zeega._layer',
	'order!layers/zeega.image',
	'order!layers/zeega.geo',
	'order!layers/zeega.text',
	'order!layers/zeega.video',
	'order!layers/zeega.youtube',
	'order!layers/zeega.documentcloud',
	'order!layers/zeega.rectangle',	            
    'order!layers/zeega.website',
	];

require(loadFiles, function($) {
	var frameId = sessionStorage.getItem('frameId');

	//this url needs to change
	$.getJSON(sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'frames/'+frameId+'/layers',function(data){
		FramePlayer.init( data );

	});
});

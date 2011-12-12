/**

	MAIN.JS
	
	VERSION 0.1
	
	LOADS JS FILES

**/

var loadFiles = [
	'jquery',
	'order!core/nodePlayer',
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

	];

require(loadFiles, function($) {
	var nodeId = sessionStorage.getItem('nodeId');

	//this url needs to change
	$.getJSON(sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'nodes/'+nodeId+'/layers',function(data){
		NodePlayer.init( data );

	});
});

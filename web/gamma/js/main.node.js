/********************************************

	MAIN.JS
	
	VERSION 0.1
	
	LOADS JS FILES

*********************************************/

var loadFiles = [
	'jquery',
	
	'order!helpers/zeega.helpers',
	'order!helpers/zeega.extends',
	'order!libraries/underscore',
	
	'order!layers/zeega._layer',
	'order!layers/zeega.video',
	'order!layers/zeega.image',
	'order!layers/zeega.geo',
	'order!layers/zeega.text',
	'order!layers/zeega.rdio',
	       
	'order!js/core/nodePlayer.js'
	];

require(loadFiles, function($) {
	var nodeId = window.location.hash.substr(1);
	//this url needs to change
	$.getJSON('http://alpha.zeega.org/joseph/web/app_dev.php/nodes/'+nodeId+'/layers',function(data){
		NodePlayer.init( data );
	});
});

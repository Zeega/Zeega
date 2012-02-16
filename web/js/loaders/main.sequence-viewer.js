/********************************************

	main.sequence-viewer.JS
	
	VERSION 0.1
	
	LOADS JS FILES

*********************************************/

var loadFiles = [
	'jquery',
	
	'order!jquery/ui/js/jquery-ui-1.8.17',
	
	'order!libraries/underscore',
	
	'order!helpers/zeega.helpers',
	'order!helpers/zeega.extends',
	
	'order!libraries/spin',
	'order!jquery/plugins/spin',
	
	
	'order!layers/zeega._layer',
	'order!layers/zeega.video',
	'order!layers/zeega.audio',
	'order!layers/zeega.image',
	'order!layers/zeega.geo',
	'order!layers/zeega.text',
	'order!layers/zeega.rdio',
	'order!layers/zeega.youtube',
	'order!layers/zeega.rectangle',
	'order!layers/zeega.documentcloud',
	
	
	'order!players/zeega.player.video',
	'order!players/zeega.player.youtube',	
	       
	'order!core/player'
	];

require(loadFiles, function($) {
	var frameID = window.location.hash.substr(15);
	console.log(frameID)
	//this url needs to change
	
	if(sessionStorage.getItem('projectId')>0) $.get(sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'projects/'+sessionStorage.getItem('projectId')+'/all',function(data){ Player.init(data,null,frameID) });
	else $.get(sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'api/collections/'+sessionStorage.getItem('collectionId')+'/project',function(data){ Player.init(data,null,frameID) });
	
});

/********************************************

	MAIN.JS
	
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







// /min/g=editor

//  js/lib/jquery.tagsinput.min.js



var loadFiles0 = [

	// 'jquery',
	//'order!lib/backbone',
]



var loadFiles1 = [
	//'jquery',

	//libraries
	'order!lib/underscore',
	'order!lib/backbone',
	'order!lib/jquery/ui/js/jquery-ui.min',
	'order!lib/spin',
	//'order!lib/swfobject', // sfwobject should probably be somewhere else. helpers? plugins?
	'order!lib/visualsearch',
	//'order!lib/leaflet/leaflet',

	//custom
	'order!ux/zeega.ux.header',
	'order!ux/zeega.ux.editor',
	//'order!ux/layer-controls',
	//'order!helpers/zeega.extends',
	'order!helpers/zeega.helpers',

	//core
	'order!app/zeega',
    'order!app/zeega.player',

	//plugins
	'order!lib/jquery/plugins/spin',
	//'order!lib/jquery/plugins/jeditable.min',
	//'order!lib/jquery/plugins/jquery-cycle',
	//'order!lib/farbtastic/farbtastic',
	//'order!lib/jquery/plugins/jquerygetUrlParam',
	//'order!lib/jquery/plugins/jqueryjson',
	//'order!lib/jquery/plugins/jquerycookie',
	//'order!lib/popcorn_flash',
	//'order!lib/bootstrap',
	//'order!plugins/players/plyr',

//models
	'order!app/models/editor.model.project',
	'order!app/models/editor.model.sequence',
	'order!app/models/editor.model.item',
	'order!app/models/editor.model.frame',
	'order!app/models/editor.model.layer',

//collections
	'order!app/collections/editor.collections.sequence',
	'order!app/collections/editor.collections.item',
	'order!app/collections/editor.collections.frame',
	'order!app/collections/editor.collections.layer',

//views
	'order!app/views/editor.project/editor.view.project.editor',
	'order!app/views/editor.project/editor.view.publish.project.editor',
	'order!app/views/editor.item/editor.view.item.database-tray',
	'order!app/views/editor.frame/editor.view.frame.frame-sequence',
	'order!app/views/editor.layer/editor.view.layer.control-library',
	'order!app/views/editor.layer/editor.view.layer.layer-list',
	'order!app/views/editor.layer/editor.view.layer.visual-editor',

	//mvc

	//layers
	//'order!plugins/layers/video/video',
	//'order!plugins/layers/audio/audio',
	//'order!plugins/layers/geo/geo',
	//'order!plugins/layers/image/image',
	//'order!plugins/layers/mapbox/mapbox',
	//'order!plugins/layers/text/text',
	//'order!plugins/layers/googlebook/googlebook',
	//'order!plugins/layers/rectangle/rectangle',

	//'order!app/index'

	];

var loadFiles2 = [
	'order!app/index'

];

/*
require(loadFiles, function(jquery)
{
    console.log('ALL JS LOADED')

	//once the files have been loaded do this
	var sequence = $('#sequence-id').val();
	//zeega.app.init();
	initUX();
});
*/
require(loadFiles0, function(jquery) {
	console.log('loadFiles0')
	//initUX();
});

setTimeout(
	orderWorkaround0,
	1000
)
setTimeout(
	orderWorkaround1,
	2000
)

setTimeout(
	orderWorkaround2,
	3000
)

setTimeout(
	orderWorkaround3,
	4000
)

function orderWorkaround0(){
	require(['/min/g=editor0'], function(jquery) {
		console.log('/min/g=editor1')
		//ZeegaBrowser.init();
	})
}

function orderWorkaround1(){
	require(loadFiles1, function(jquery) {
		console.log('loadFiles1')
		//initUX();
	});
}
function orderWorkaround2(){
	require(['/min/g=editor1'], function(jquery) {
		console.log('/min/g=editor2')
		//ZeegaBrowser.init();
	})
}
function orderWorkaround3(){
	require(loadFiles2, function(jquery) {
		console.log('loadFiles2')
		//ZeegaBrowser.init();
		//initUX();
		//once the files have been loaded do this
		var sequence = $('#sequence-id').val();
		//zeega.app.init();
		initUX();
	})
}
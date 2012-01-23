/********************************************

	MAIN.JS
	
	VERSION 0.1
	
	LOADS JS FILES


*********************************************/
Aloha.ready( function() {
	
	//Aloha.jQuery('#tester').aloha();


require.config({
	baseUrl : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'gamma/js/',
	paths : {
		'order' : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'gamma/js/order'
	}
})

var loadFiles = [
	//'jquery',
	
	//css?
	//'text!../css/all.css', //not quite
	


	//libraries
	'order!libraries/underscore',
	'order!libraries/backbone',
	
	'order!libraries/spin',
	'order!libraries/swfobject', // sfwobject should probably be somewhere else. helpers? plugins?
	'order!jquery/ui/js/jquery-ui.min',
	
	//custom

	'order!ux/zeega.ux.header',
	'order!ux/zeega.ux.editor',
	'order!ux/layer-controls',
	'order!helpers/zeega.extends',
	'order!helpers/zeega.helpers',

	//core
	'order!core/zeega',
    'order!core/player',
    'order!core/database',
	
	//plugins
	'order!jquery/plugins/spin',
	'order!jquery/plugins/jeditable.min',
	'order!jquery/plugins/jquery-cycle',
	'order!jquery/plugins/colorpicker/js/colorpicker',
	'order!jquery/plugins/jquerygetUrlParam',
	'order!jquery/plugins/jqueryjson',
	'order!jquery/plugins/jquerycookie',
	'order!jquery/plugins/twitter-bootstrap',
	
	
	//mvc
	'order!backbone/models/route',
    'order!backbone/models/tag',
	'order!backbone/models/item',
	'order!backbone/models/editor.collection',
	'order!backbone/models/node',
	'order!backbone/models/layer',
	'order!backbone/models/project',
	'order!backbone/views/route-view',
	'order!backbone/views/item-view',
	'order!backbone/views/editor.collection-view',
	'order!backbone/views/node-view',
	'order!backbone/views/project-view',
	
	//'order!backbone/views/layer-view',
	'order!backbone/views/layer.view.visual',
	'order!backbone/views/layer.view.visual.list',
	'order!backbone/views/layer.view.visual.editor',
	//'order!backbone/views/layer.view.interaction.list',
	
	//routes
	'order!backbone/routes/routes',
	
	//layers
	'order!layers/zeega._layer',
	'order!layers/zeega.audio',
	'order!layers/zeega.geo',
	'order!layers/zeega.image',
	'order!layers/zeega.text',
	'order!layers/zeega.video',
	'order!layers/zeega.youtube',
	//'order!layers/zeega.rdio',
	//'order!layers/zeega.twilio',
	'order!layers/zeega.documentcloud',
	'order!layers/zeega.rectangle',
	'order!layers/zeega.website',
	
	//players
	
	'order!players/zeega.player.video',
	'order!players/zeega.player.youtube',	
	//'order!players/zeega.player.rdio',
	//'order!players/zeega.player.rdio.token',
	
	];

require(loadFiles, function(jquery)
{
    console.log('ALL JS LOADED')

	//once the files have been loaded do this
	var route = $('#route-id').val();
	console.log(route);
	Zeega.init();
	if(!route) Zeega.createRoute();
	else Zeega.loadRoute(route);
	
	
	Database.init();
	
	var router = new MyRouter;
	Backbone.history.start();
	
	initUX();
	
});

});

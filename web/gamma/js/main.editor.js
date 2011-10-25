/********************************************

	MAIN.JS
	
	VERSION 0.1
	
	LOADS JS FILES


*********************************************/

var loadFiles = [
	'jquery',
	
	//css?
	//'text!../css/all.css', //not quite
	
	//config
	'order!zeega.config',
	
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
	'order!helpers/sugar',

	//core
	'order!core/zeega',
    'order!core/zpub',
    'order!core/player',
    'order!core/database',
	
	//plugins
	'order!jquery/plugins/spin',
	'order!jquery/plugins/jeditable.min',
	'order!jquery/plugins/jquery-cycle',
	'order!jquery/plugins/jquery.paging',
	'order!jquery/plugins/colorpicker/js/colorpicker',
	'order!jquery/plugins/jquerygetUrlParam',
	'order!jquery/plugins/jqueryjson',
	'order!jquery/plugins/jquerycookie',
	'order!jquery/plugins/jquerytmpl',
	'order!jquery/plugins/bootstrapmodal',
	
	
	//mvc
	'order!backbone/models/route',
	'order!backbone/models/item',
	'order!backbone/models/node',
	'order!backbone/models/layer',
	'order!backbone/models/project',
	'order!backbone/views/route-view',
	'order!backbone/views/item-view',
	'order!backbone/views/node-view',
	'order!backbone/views/layer-view',
	'order!backbone/views/project-view',
	
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
	'order!layers/zeega.rdio',
	
	//players
	'order!players/zeega.html5av',
	'order!players/zeega.av.publish',
	'order!players/zeega.player.youtube',
	'order!players/zeega.rdio',
	'order!players/zeega.rdio.token'	
	];

require(loadFiles, function($) {
    
	//once the files have been loaded do this
	var route = $('#route-id').val();
	//console.log(route);
	if(!route) Zeega.createRoute();
	else Zeega.loadRoute(route);
	
	
	Database.init();
	
	var router = new MyRouter;
	Backbone.history.start();
	
	initUX();
	
});

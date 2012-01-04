/********************************************

	MAIN.JS
	
	VERSION 0.1
	
	LOADS JS FILES


*********************************************/

var loadFiles = [
	'jquery',
	
	//css?
	//'text!../css/all.css', //not quite
	

	//libraries
	'order!libraries/underscore',
	'order!libraries/backbone',
	'order!jquery/ui/js/jquery-ui.min',
	
	//custom

	'order!ux/ux',
	'order!ux/layer-controls',
	'order!helpers/sugar',
	'order!zeega',
	'order!database',
	
	//plugins
	'order!jquery/plugins/jeditable.min',
	'order!jquery/plugins/jquery-cycle',
	'order!jquery/plugins/jquery.paging',
	'order!jquery/plugins/colorpicker/js/colorpicker',
	'order!js/jquery/plugins/jquery.getUrlParam.js',
	'order!js/jquery/plugins/jquery.json-2.2.min.js',
	'order!js/jquery/plugins/jquery.cookie.js',
	'order!js/jquery/plugins/jquery.tmpl.js',
	'order!js/jquery/plugins/bootstrap-modal.js',
	
	//mvc
	'order!backbone/models/project',
	'order!backbone/models/route',
	'order!backbone/models/item',
	'order!backbone/models/node',
	'order!backbone/models/layer',
	'order!backbone/views/project-view',
	'order!backbone/views/route-view',
	'order!backbone/views/item-view',
	'order!backbone/views/node-view',
	'order!backbone/views/layer-view',
	
	//routes
	'order!backbone/routes/routes',
	
	//layers
	'order!layers/zeega._layer',
	'order!layers/zeega.audio',
	'order!layers/zeega.geo',
	'order!layers/zeega.image',
	'order!layers/zeega.text',
	'order!layers/zeega.video',
	'order!layers/zeega.documentcloud',
	
	//players
	'order!players/zeega.html5av'
	
	];

require(loadFiles, function($) {
    
	Zeega.init();
	//once the files have been loaded do this
	var route = 5;
	//console.log(route);
	if(!route) Zeega.createRoute();
	else Zeega.loadRoute(route);
	
	Database.init();
	
	var router = new MyRouter;
	Backbone.history.start();
	
	initUX();
	
});

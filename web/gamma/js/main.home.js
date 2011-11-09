/********************************************

	MAIN.JS
	
	VERSION 0.1
	
	LOADS JS FILES


*********************************************/

var loadFiles = [
	'jquery',
	
	//css?
	//'text!../css/all.css', //not quite
	'order!zeega.config',
	
	//libraries
	'order!libraries/underscore',
	'order!libraries/backbone',
	'order!jquery/ui/js/jquery-ui.min',
	
	//custom
	'order!ux/zeega.ux.header',
	'order!ux/zeega.ux.home',

	
	//plugins
	'order!jquery/plugins/jeditable.min',
	'order!jquery/plugins/jquery-cycle',
	'order!jquery/plugins/jquery.paging',
	'order!jquery/plugins/colorpicker/js/colorpicker',
	
	//mvc

	
	//routes

	
	//layers

	
	//players

	
	];

require(loadFiles, function($) {
    initUX();
	
});

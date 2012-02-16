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
	'order!lib/underscore',
	'order!lib/backbone',
	'order!jquery/ui/js/jquery-ui.min',
	
	//custom
	'order!ux/zeega.ux.header',
	'order!ux/zeega.ux.admin',
	

	
	//plugins
	'order!lib/jquery/plugins/jeditable.min',
	'order!lib/jquery/plugins/jquery-cycle',
	'order!lib/jquery/plugins/jquery.paging',
	'order!lib/jquery/plugins/colorpicker/js/colorpicker',
	'order!lib/jquery/plugins/bootstrapmodal',
	
	//mvc

	
	//sequences

	
	//layers

	
	//players

	
	];

require(loadFiles, function($) {
    initUX();
	
});

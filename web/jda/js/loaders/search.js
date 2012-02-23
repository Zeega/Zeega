/********************************************

	MAIN.JS
	
	VERSION 0.1
	
	LOADS JS FILES


*********************************************/

var loadFiles = [
	
	//libraries	
	//'text!../app/views/items/templates.html',
	
	
	'order!../lib/jquery/jquery-1.7.1.min',
	'order!../lib/underscore/underscore-min',
	'order!../lib/backbone/backbone-0.9.1',
	'order!../lib/jquery-easing/jquery.easing.1.3',
	'order!../lib/jquery.fancybox-1.3.4/fancybox/jquery.easing-1.3.pack',
	'order!../lib/jquery.fancybox-1.3.4/fancybox/jquery.fancybox-1.3.4.pack',
	'order!../lib/jquerySVG/jquery.svg',
	'order!../lib/jquery-ui-1.8.16.custom/js/jquery-ui-1.8.16.custom.min',
	'order!../lib/spin',
	'order!../lib/spin-jquery',
	'order!../lib/OpenLayers-2.11/OpenLayers',
	'order!../lib/date.format',

	//mvc
	'order!../app/jda',
	
	//models
	'order!../app/models/items',
	
	//collections
	'order!../app/collections/items',
	
	//views
	'order!../app/views/items/jda.view.item.search-results',
	'order!../app/views/items/jda.view.item.map-popup',
	
	'order!../app/index',

	//custom
	'order!../helpers/utils',
	'order!../ux/jda.ux.search',


		
	//core
	
	//'order!search',

	
	];

require(loadFiles, function(){

});


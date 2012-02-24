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
	'order!../lib/jquerySVG/jquery.svg',
	'order!../lib/jquery-ui-1.8.18.custom/js/jquery-ui-1.8.18.custom.min',
	'order!../lib/spin',
	'order!../lib/spin-jquery',
	'order!../lib/OpenLayers-2.11/OpenLayers',
	'order!../lib/date.format',
	'order!../lib/jquery-ui-timepicker-addon',

	'order!../lib/leaflet/leaflet',
	'order!../lib/jquery.tagsinput.min',
	'order!../lib/fancybox/jquery.easing-1.3.pack',
	'order!../lib/fancybox/jquery.mousewheel-3.0.6.pack',
	'order!../lib/fancybox/jquery.fancybox',
	'order!../lib/fancybox/jquery.fancybox.pack',
	'order!../lib/fancybox/helpers/jquery.fancybox-buttons',
	'order!../lib/jeditable.min',
	'order!../lib/dateformat/date.format',
	//mvc
	'order!../app/jda',
	
	//models
	'order!../app/models/items',
	'order!../app/models/tag',
	
	//collections
	'order!../app/collections/items',
	
	//views
<<<<<<< HEAD
	'order!../app/views/items/jda.view.item.search-results',
	'order!../app/views/items/jda.view.item.map-popup',
=======
	'order!../app/views/tag.view',
	'order!../app/views/items/items-list',
	'order!../app/views/fancybox.views',
	'order!../app/views/map.view',
	
>>>>>>> 4893180bfd1468de76b9b443c20e1d184cc664e2
	
	'order!../app/index',

	//custom
	'order!../helpers/utils',
	'order!../ux/jda.ux.search',


		
	//core
	
	//'order!search',

	
	];

require(loadFiles, function(){

});


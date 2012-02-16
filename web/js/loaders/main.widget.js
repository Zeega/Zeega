/********************************************

	MAIN.JS
	
	VERSION 0.1
	
	LOADS JS FILES


*********************************************/

var loadFiles = [
	'jquery',
	
	//libraries
	'order!libraries/underscore',
	'order!libraries/backbone',
	'order!libraries/spin',
	'order!jquery/ui/js/jquery-ui.min',
	
	//custom
	'order!ux/zeega.ux.widget',
	'order!core/zeegaWidget',
	'order!helpers/zeega.extends',
	'order!helpers/zeega.helpers',
	
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
	'order!jquery/plugins/twitter-bootstrap',
	
	//custom
	'order!filamentslider/selectToUISlider.jQuery',
	
	//mvc
	'order!backbone/models/tag',
	'order!backbone/models/item',
	'order!backbone/views/item-view',

	'order!backbone/views/widget.item-view',
];

require(loadFiles, function($) 
{
	ZeegaWidget.init();
	//initUX();	
});

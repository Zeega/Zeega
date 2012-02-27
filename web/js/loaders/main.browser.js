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
var loadFiles = [
	'jquery',
	
	//css?
	//'text!../css/all.css', //not quite
	

	
	//libraries
	'order!lib/underscore',
	'order!lib/backbone',
	'order!lib/spin',
	'order!libraries/swfobject', // sfwobject should probably be somewhere else. helpers? plugins?
	'order!jquery/ui/js/jquery-ui.min',
	
	//custom

	'order!ux/zeega.ux.header',
	'order!ux/zeega.ux.browser',
	'order!helpers/zeega.extends',
	'order!helpers/zeega.helpers',

	//core
	'order!app/zeega',
	'order!app/zeegaBrowser',
	
	//plugins
	'order!lib/jquery/plugins/spin',
	'order!lib/jquery/plugins/jeditable.min',
	'order!lib/jquery/plugins/jquery-cycle',
	'order!lib/jquery/plugins/jquery.paging',
	'order!lib/jquery/plugins/colorpicker/js/colorpicker',
	'order!lib/jquery/plugins/jquerygetUrlParam',
	'order!lib/jquery/plugins/jqueryjson',
	'order!lib/jquery/plugins/jquerycookie',
	'order!lib/jquery/plugins/jquerytmpl',
	'order!lib/jquery/plugins/twitter-bootstrap',
	
	//custom
	'order!filamentslider/selectToUISlider.jQuery',
	'order!jcarousel/jquery.jcarousel',
	'order!jcarousel/jcarousel.zeega',
	
	//mvc
	'order!backbone/models/tag',
	'order!app/models/editor.model.item',
	'order!backbone/models/browser.collection',
	'order!backbone/models/browser.myCollections',
	'order!backbone/models/browser.timeBin',
	'order!backbone/models/browser.search',


	'order!backbone/views/browser.my-collections-view',
	'order!backbone/views/browser.search-collections-view',
	'order!backbone/views/browser.search-item-views',
	'order!backbone/views/browser.search-map-view',
	'order!backbone/views/browser.search-time-view',
	'order!backbone/views/tag.view',
	'order!backbone/views/fancybox.views',
		'order!backbone/views/map.view',

	

	];

require(loadFiles, function($) {
    
	
	ZeegaBrowser.init();
	
	
	initUX();
	
});

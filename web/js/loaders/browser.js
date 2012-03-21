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

	//libraries
	'order!lib/underscore',
	'order!lib/backbone',
	'order!lib/spin',
	'order!lib/swfobject', // sfwobject should probably be somewhere else. helpers? plugins?
	'order!lib/jquery/ui/js/jquery-ui.min',
	
	//custom

	'order!ux/zeega.ux.header',
	'order!ux/zeega.ux.browser',
	'order!helpers/zeega.extends',
	'order!helpers/zeega.helpers',

	//core
	//'order!app/zeega',
	'order!app/zeega.browser',
	
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
	'order!lib/popcorn_flash',
	'order!plugins/players/plyr',
	
	//custom
	'order!lib/filamentslider/selectToUISlider.jQuery',
	'order!lib/jcarousel/jquery.jcarousel',
	'order!lib/jcarousel/jcarousel.zeega',
	
	//mvc
	'order!app/models/browser.model.collection',
	'order!app/models/browser.model.search',
	'order!app/models/browser.model.item',
	'order!app/models/browser.model.tag',

	'order!app/collections/browser.collections.collection',
	'order!app/collections/browser.collections.item',
	'order!app/collections/browser.collections.tag',
	
	'order!app/views/browser.item/browser.view.item.item-tray',
	'order!app/views/browser.collection/browser.view.collection.my-collection-drawer',

	'order!app/views/browser.fancybox/browser.view.fancybox._fancybox',
	'order!app/views/browser.fancybox/browser.view.fancybox.audio',
	'order!app/views/browser.fancybox/browser.view.fancybox.document-cloud',
	'order!app/views/browser.fancybox/browser.view.fancybox.image',
	'order!app/views/browser.fancybox/browser.view.fancybox.tweet',
	'order!app/views/browser.fancybox/browser.view.fancybox.video',
		'order!app/views/browser.fancybox/browser.view.fancybox.mapbox',
	'order!app/views/browser.fancybox/browser.view.fancybox.youtube',
	'order!app/views/browser.map/browser.view.map.fancybox',
	'order!app/views/browser.tag/browser.view.tag.fancybox',
	
	
	/*
	'order!app/models/editor.model.item',
	'order!app/models/browser.model.search',
	
	
	
	
	'order!backbone/models/tag',
	'order!backbone/models/browser.collection',
	'order!backbone/models/browser.myCollections',
	'order!backbone/models/browser.timeBin',
	//'order!backbone/models/browser.search',


	'order!backbone/views/browser.my-collections-view',
	'order!backbone/views/browser.search-collections-view',
	'order!backbone/views/browser.search-item-views',
	'order!backbone/views/browser.search-map-view',
	'order!backbone/views/browser.search-time-view',
	'order!backbone/views/tag.view',
	'order!backbone/views/fancybox.views',
	'order!backbone/views/map.view',

	*/
	'order!app/index.browser'
	

	];

require(loadFiles, function($) {
    
	console.log('loaded')
	//ZeegaBrowser.init();
	
	
	initUX();
	
});

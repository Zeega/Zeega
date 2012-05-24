/********************************************

	MAIN
	
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

	


require(
	[
		//'jquery',
		//libraries
		'web/js/lib/underscore',
		'web/js/lib/backbone',
		'web/js/lib/spin',
		'web/js/lib/swfobject', // sfwobject should probably be somewhere else. helpers? plugins?
		'web/js/lib/jquery/ui/js/jquery-ui.min',
		'web/js/lib/bootstrap',
		'web/js/lib/visualsearch',
		'web/js/lib/fancybox/jquery.fancybox',
		'web/js/lib/fancybox/jquery.fancybox.pack',
		'web/js/lib/fancybox/helpers/jquery.fancybox-buttons',
		'web/js/lib/fancybox/jquery.easing-1.3.pack',
		'web/js/lib/fancybox/jquery.mousewheel-3.0.6.pack',
		'web/js/lib/leaflet/leaflet',
		'web/js/lib/jquery.tagsinput.min',
		//plugins
		'web/js/lib/jquery/plugins/spin',
		'web/js/lib/jquery/plugins/jeditable.min',
		'web/js/lib/jquery/plugins/jquery-cycle',
		'web/js/lib/jquery/plugins/jquery.paging',
		'web/js/lib/jquery/plugins/colorpicker/js/colorpicker',
		'web/js/lib/jquery/plugins/jquerygetUrlParam',
		'web/js/lib/jquery/plugins/jqueryjson',
		'web/js/lib/jquery/plugins/jquerycookie',
		'web/js/lib/jquery/plugins/jquerytmpl',
		'web/js/lib/jquery/plugins/twitter-bootstrap',
		'web/js/lib/popcorn_flash',
		'web/js/plugins/players/plyr',
		//core
		'web/js/app/zeega',
		'web/js/app/zeega.browser',
		//custom
		'web/js/ux/zeega.ux.header',
		'web/js/ux/zeega.ux.browser',
		'web/js/helpers/zeega.extends',
		'web/js/helpers/zeega.helpers',
		//custom
		'web/js/lib/filamentslider/selectToUISlider.jQuery',
		'web/js/lib/jcarousel/jquery.jcarousel',
		'web/js/lib/jcarousel/jcarousel.zeega',
		//mvc
		'web/js/app/models/browser.model.collection',
		'web/js/app/models/browser.model.search',
		'web/js/app/models/browser.model.item',
		'web/js/app/collections/browser.collections.collection',
		'web/js/app/collections/browser.collections.item',
		'web/js/app/views/browser.item/browser.view.item.item-tray',
		'web/js/app/views/browser.collection/browser.view.collection.my-collection-drawer',
		'web/js/app/views/browser.fancybox/browser.view.fancybox._fancybox',
		'web/js/app/views/browser.fancybox/browser.view.fancybox.audio',
		'web/js/app/views/browser.fancybox/browser.view.fancybox.document-cloud',
		'web/js/app/views/browser.fancybox/browser.view.fancybox.image',
		'web/js/app/views/browser.fancybox/browser.view.fancybox.default',
		'web/js/app/views/browser.fancybox/browser.view.fancybox.tweet',
		'web/js/app/views/browser.fancybox/browser.view.fancybox.soundcloud',
		'web/js/app/views/browser.fancybox/browser.view.fancybox.video',
		'web/js/app/views/browser.fancybox/browser.view.fancybox.mapbox',
		'web/js/app/views/browser.fancybox/browser.view.fancybox.youtube',
		'web/js/app/views/browser.map/browser.view.map.fancybox',
		'web/js/app/views/browser.tag/browser.view.tag.fancybox',
		'web/js/app/index.browser'
	], 
	function($) {
		console.log('files loaded')
		initUX();
	}
);

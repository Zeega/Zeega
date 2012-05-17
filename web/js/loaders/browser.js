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
var loadFiles0 = [

	'jquery',
	//'order!lib/backbone',
]

var loadFiles1 = [

	//'jquery',

	//libraries
	//'order!lib/underscore',
	//'order!lib/backbone',
	'order!lib/spin',
	//'order!lib/swfobject', // sfwobject should probably be somewhere else. helpers? plugins?
	'order!lib/jquery/ui/js/jquery-ui.min',
	//'order!lib/bootstrap',
	'order!lib/visualsearch',

	//'order!lib/fancybox/jquery.fancybox',
	'order!lib/fancybox/jquery.fancybox.pack',
	//'order!lib/fancybox/helpers/jquery.fancybox-buttons',

	//'order!lib/fancybox/jquery.easing-1.3.pack',
	//'order!lib/fancybox/jquery.mousewheel-3.0.6.pack',
	//'order!lib/leaflet/leaflet',
	//'order!lib/jquery.tagsinput.min',

	//plugins
	'order!lib/jquery/plugins/spin',
	//'order!lib/jquery/plugins/jeditable.min',
	//'order!lib/jquery/plugins/jquery-cycle',
	//'order!lib/jquery/plugins/jquery.paging',
	//'order!lib/jquery/plugins/colorpicker/js/colorpicker',
	//'order!lib/jquery/plugins/jquerygetUrlParam',
	//'order!lib/jquery/plugins/jqueryjson',
	//'order!lib/jquery/plugins/jquerycookie',
	//'order!lib/jquery/plugins/jquerytmpl',
	'order!lib/jquery/plugins/twitter-bootstrap',
	//'order!lib/popcorn_flash',
	//'order!plugins/players/plyr',

	//core
	'order!app/zeega',
	'order!app/zeega.browser',

	//custom
	'order!ux/zeega.ux.header',
	'order!ux/zeega.ux.browser',
	'order!helpers/zeega.extends',
	'order!helpers/zeega.helpers',


	//custom
	//'order!lib/filamentslider/selectToUISlider.jQuery',
	'order!lib/jcarousel/jquery.jcarousel',
	'order!lib/jcarousel/jcarousel.zeega',

	//mvc
	'order!app/models/browser.model.collection',
	'order!app/models/browser.model.search',
	'order!app/models/browser.model.item',

	'order!app/collections/browser.collections.collection',
	'order!app/collections/browser.collections.item',
	'order!app/views/browser.item/browser.view.item.item-tray',
	'order!app/views/browser.collection/browser.view.collection.my-collection-drawer',

	//'order!app/views/browser.fancybox/browser.view.fancybox._fancybox',
	//'order!app/views/browser.fancybox/browser.view.fancybox.audio',
	//'order!app/views/browser.fancybox/browser.view.fancybox.document-cloud',
	//'order!app/views/browser.fancybox/browser.view.fancybox.image',
	//'order!app/views/browser.fancybox/browser.view.fancybox.default',
	//'order!app/views/browser.fancybox/browser.view.fancybox.tweet',
	//'order!app/views/browser.fancybox/browser.view.fancybox.soundcloud',
	//'order!app/views/browser.fancybox/browser.view.fancybox.video',
	//'order!app/views/browser.fancybox/browser.view.fancybox.mapbox',
	//'order!app/views/browser.fancybox/browser.view.fancybox.youtube',
	//'order!app/views/browser.map/browser.view.map.fancybox',
	//'order!app/views/browser.tag/browser.view.tag.fancybox',
	//'order!app/index.browser'

	];

var loadFiles2 = [

];

require(loadFiles0, function($) {
	console.log('loadFiles0')
	//initUX();
});

setTimeout(
	orderWorkaround0,
	2000
)
setTimeout(
	orderWorkaround1,
	4000
)

setTimeout(
	orderWorkaround2,
	6000
)

setTimeout(
	orderWorkaround3,
	8000
)

function orderWorkaround0(){
	require(['/min/g=browser1'], function($) {
		console.log('/min/g=browser1')
		//ZeegaBrowser.init();

	})
}

function orderWorkaround1(){
	require(loadFiles1, function($) {
		console.log('loadFiles1')
		//initUX();
	});
}
function orderWorkaround2(){
	require(['/min/g=browser2'], function($) {
		console.log('/min/g=browser2')
		//ZeegaBrowser.init();
		initUX();
	})
}
function orderWorkaround3(){
	require(loadFiles2, function($) {
		console.log('loadFiles2')
		//ZeegaBrowser.init();
		//initUX();
	})
}
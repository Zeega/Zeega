/********************************************

	MAIN.JS
	
	VERSION 0.1
	
	LOADS JS FILES


*********************************************/
require.config({
	baseUrl : sessionStorage.getItem('hostname') +  sessionStorage.getItem('directory')+'js/',
	paths : {
			'order' :  sessionStorage.getItem('hostname') +  sessionStorage.getItem('directory')+'js/lib/order',
		}
})
console.log(sessionStorage.getItem('hostname') +  sessionStorage.getItem('directory')+'js/lib/order')
require(
	[
	
	//libraries
	'order!lib/jquery/ui/js/jquery-1.5.1.min',
	'order!lib/underscore',
	'order!lib/backbone',
	'order!lib/spin',
	'order!lib/jquery/ui/js/jquery-ui.min',
	'order!lib/dropbox',
	
	//custom
	'order!ux/zeega.ux.widget',
	'order!app/zeega.widget',
	'order!helpers/zeega.extends',
	'order!helpers/zeega.helpers',
	
	//plugins
	'order!lib/jquery/plugins/spin',
	'order!lib/jquery/plugins/jeditable.min',
	//'order!lib/jquery/plugins/jquery-cycle',
	//'order!lib/jquery/plugins/jquery.paging',
	//'order!lib/jquery/plugins/colorpicker/js/colorpicker',
	'order!lib/jquery/plugins/jquerygetUrlParam',
	'order!lib/jquery/plugins/jqueryjson',
	'order!lib/jquery/plugins/jquerycookie',
	'order!lib/jquery/plugins/jquerytmpl',
	'order!lib/jquery/plugins/twitter-bootstrap',
	
	//custom
	//'order!lib/filamentslider/selectToUISlider.jQuery',
	
	//mvc
	//'order!backbone/models/tag',
	'order!app/models/widget.model.item',
	//'order!app/views/editor.modals/editor.view.modal.ingest-dropbox',
	//'order!app/views/editor.modals/editor.view.modal.ingest-dropbox-iframe',

	'order!app/collections/widget.collections.item',

	//'order!app/views/widget.item/widget.view.item.collection',
	'order!app/views/widget.item/widget.view.item.ingesting',

	],
	function(jquery) {
	    zeegaWidget.app.init();
});
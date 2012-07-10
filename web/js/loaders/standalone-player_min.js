/********************************************

	main.sequence-viewer.JS
	
	VERSION 0.1
	
	LOADS JS FILES

*********************************************/
require.config({
	baseUrl : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'js/.js',
	paths : {
		'order' : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'js/lib/order.js',
		'text' : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'js/lib/text'
	}
})

require(
	[
	//'jquery',
	
	//'web/js/lib/jquery/ui/js/jquery-ui-1.8.17',
	
	'web/js/lib/underscore',
	'web/js/lib/backbone',
	
	'web/js/lib/leaflet/leaflet',
	
	'web/js/app/zeega.project-viewer',
	'web/js/app/zeega.player',
	
	'web/js/helpers/zeega.helpers',
	'web/js/helpers/zeega.extends',
	
	'web/js/lib/spin',
	'web/js/lib/jquery/plugins/spin',
	'web/js/lib/popcorn_flash',
	
	//'web/js/app/views/editor.layer/editor.view.layer.control-library',
	'web/js/app/views/editor.layer/editor.view.layer.layer-list',
	'web/js/app/views/editor.layer/editor.view.layer.visual-editor',
	'web/js/app/models/editor.model.layer',

	'web/js/plugins/layers/video/video',
	'web/js/plugins/layers/audio/audio',
	'web/js/plugins/layers/geo/geo',
	'web/js/plugins/layers/image/image',
	'web/js/plugins/layers/mapbox/mapbox',
	'web/js/plugins/layers/text/text',
	'web/js/plugins/layers/googlebook/googlebook',
	'web/js/plugins/layers/link/link',
    'web/js/plugins/layers/rectangle/rectangle',
	'web/js/plugins/layers/website/website',
	'web/js/plugins/layers/twitter/twitter',
	'web/js/plugins/layers/testimonial/testimonial',
	'web/js/plugins/layers/documentcloud/documentcloud',
	
	
	//'web/js/plugins/players/zeega.player.video',
	//'web/js/plugins/players/zeega.player.youtube',	
	       
	'web/js/plugins/players/plyr'
	],
	function(jquery) {
		zeega.app.init()

		var frameID = window.location.hash.substr(15);
		console.log(frameID)
});

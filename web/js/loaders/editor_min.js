/********************************************

	MAIN.JS
	
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


// /min/g=editor

//  js/lib/jquery.tagsinput.min.js

require(
	[
		'web/js/lib/underscore.js',
		'web/js/lib/backbone.js',
		
		'web/js/lib/jquery/ui/js/jquery-ui.min.js',
		'web/js/lib/spin.js',
		'web/js/lib/swfobject.js', // sfwobject should probably be somewhere else. helpers? plugins?
		'web/js/lib/visualsearch.js',
		
		'web/js/lib/leaflet/leaflet.js',
		
		//custom
		'web/js/ux/zeega.ux.header.js',
		'web/js/ux/layer-controls.js',
		'web/js/helpers/zeega.extends.js',
		'web/js/helpers/zeega.helpers.js',
		
		//core
		'web/js/app/zeega.js',
	    'web/js/app/zeega.player.js',
		
		//plugins
		'web/js/lib/jquery/plugins/spin.js',
		'web/js/lib/jquery/plugins/jeditable.min.js',
		'web/js/lib/jquery/plugins/jquery-cycle.js',
		'web/js/lib/farbtastic/farbtastic.js',
		'web/js/lib/jquery/plugins/jquerygetUrlParam.js',
		'web/js/lib/jquery/plugins/jqueryjson.js',
		'web/js/lib/jquery/plugins/jquerycookie.js',
		'web/js/lib/popcorn_flash.js',
		'web/js/lib/bootstrap.js',
		
		'web/js/plugins/players/plyr.js',
		
		//models
		'web/js/app/models/editor.model.project.js',
		'web/js/app/models/editor.model.sequence.js',
		'web/js/app/models/editor.model.item.js',
		'web/js/app/models/editor.model.frame.js',
		'web/js/app/models/editor.model.layer.js',
		
		//collections
		'web/js/app/collections/editor.collections.sequence.js',
		'web/js/app/collections/editor.collections.item.js',
		'web/js/app/collections/editor.collections.frame.js',
		'web/js/app/collections/editor.collections.layer.js',
		
		//views
		'web/js/app/views/editor.project/editor.view.project.editor.js',
		'web/js/app/views/editor.sequence/editor.view.sequence.sequence-tab',
		'web/js/app/views/editor.item/editor.view.item.database-tray.js',
		'web/js/app/views/editor.frame/editor.view.frame.frame-sequence.js',
		'web/js/app/views/editor.layer/editor.view.layer.control-library.js',
		'web/js/app/views/editor.layer/editor.view.layer.layer-list.js',
		'web/js/app/views/editor.layer/editor.view.layer.visual-editor.js',
		'web/js/app/views/editor.modals/editor.view.modal.link-existing',
		'web/js/app/views/editor.modals/editor.view.modal.link-advanced',
		'web/js/app/views/editor.modals/editor.view.modal.share-project',
		
		//mvc
		//layers
		'web/js/plugins/layers/video/video.js',
		'web/js/plugins/layers/audio/audio.js',
		'web/js/plugins/layers/geo/geo.js',
		
		'web/js/plugins/layers/image/image.js',
		'web/js/plugins/layers/mapbox/mapbox.js',
		'web/js/plugins/layers/text/text.js',
		'web/js/plugins/layers/googlebook/googlebook.js',
		'web/js/plugins/layers/link/link',
		
		'web/js/plugins/layers/rectangle/rectangle',
		
		'web/js/app/index'
		
	],
	function(jquery) {
	    console.log('ALL JS LOADED')
		//once the files have been loaded do this
		var sequence = $('#sequence-id').val();
		//zeega.app.init();
});

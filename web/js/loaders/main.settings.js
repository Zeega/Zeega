/********************************************

	MAIN.JS
	
	VERSION 0.1
	
	LOADS JS FILES


*********************************************/

var loadFiles = [
	'jquery',
	
	//libraries
	'order!lib/underscore',
	'order!lib/backbone',
	'order!lib/jquery/ui/js/jquery-ui.min',
	'order!lib/bootstrap',
	'order!lib/dropbox',
	
	//custom
	'order!ux/zeega.ux.header',
	'order!ux/zeega.ux.settings',

	
	//plugins
	'order!lib/jquery/plugins/jeditable.min',
	'order!lib/jquery/plugins/jquery-cycle',
	'order!lib/jquery/plugins/jquery.paging',
	'order!lib/jquery/plugins/colorpicker/js/colorpicker',
	'order!lib/jquery/plugins/jquerygetUrlParam',
	'order!lib/jquery/plugins/jqueryjson',
	'order!lib/jquery/plugins/jquerycookie',
	'order!lib/jquery/plugins/jquerytmpl',

	//mvc
	//'order!app/views/editor.modals/editor.view.modal.ingest-dropbox',
	//'order!app/views/editor.modals/editor.view.modal.ingest-dropbox-iframe',

	];

require(loadFiles, function($) {
    initUX();
	
});

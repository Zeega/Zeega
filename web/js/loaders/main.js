/********************************************

	MAIN.JS
	
	VERSION 0.1
	
	LOADS JS FILES


*********************************************/

var loadFiles = [
	'jquery',
	
	//css?
	//'text!../css/all.css', //not quite
	

	//libraries
	'order!lib/underscore',
	'order!lib/backbone',
	'order!jquery/ui/js/jquery-ui.min',
	'order!lib/bootstrap',
	'order!lib/dropbox',
	
	//custom

	'order!ux/ux',
	'order!ux/layer-controls',
	'order!helpers/sugar',
	'order!zeega',
	'order!database',
	
	//plugins
	'order!lib/jquery/plugins/jeditable.min',
	'order!lib/jquery/plugins/jquery-cycle',
	'order!lib/jquery/plugins/jquery.paging',
	'order!lib/jquery/plugins/colorpicker/js/colorpicker',
	'order!js/lib/jquery/plugins/jquery.getUrlParam.js',
	'order!js/lib/jquery/plugins/jquery.json-2.2.min.js',
	'order!js/lib/jquery/plugins/jquery.cookie.js',
	'order!js/lib/jquery/plugins/jquery.tmpl.js',
	'order!js/lib/jquery/plugins/bootstrap-modal.js',
	
	//mvc
	'order!backbone/models/project',
	'order!backbone/models/sequence',
	'order!app/models/editor.model.item',
	'order!backbone/models/frame',
	'order!backbone/models/layer',
	'order!backbone/views/project-view',
	'order!backbone/views/sequence-view',
	'order!backbone/views/item-view',
	'order!backbone/views/frame-view',
	'order!backbone/views/layer-view',
	//'order!app/views/editor.modals/editor.view.modal.ingest-dropbox',
	//'order!app/views/editor.modals/editor.view.modal.ingest-dropbox-iframe',
	
	//sequences
	'order!backbone/sequences/sequences',
	
	//layers
	'order!app/_layer',
	'order!plugins/layers/audio/audio',
	'order!plugins/layers/geo/geo',
	'order!plugins/layers/image/image',
	'order!plugins/layers/text/text',
	'order!plugins/layers/video/video',
	'order!plugins/layers/documentcloud/documentcloud',
	
	//players
	'order!players/zeega.html5av'
	
	];

require(loadFiles, function($) {
    
	Zeega.init();
	//once the files have been loaded do this
	var sequence = 5;
	//console.log(sequence);
	if(!sequence) Zeega.createSequence();
	else Zeega.loadSequence(sequence);
	
	Database.init();
	
	var router = new MyRouter;
	Backbone.history.start();
	
	initUX();
	
});

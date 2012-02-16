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
	'order!libraries/underscore',
	'order!libraries/backbone',
	'order!jquery/ui/js/jquery-ui.min',
	
	//custom

	'order!ux/ux',
	'order!ux/layer-controls',
	'order!helpers/sugar',
	'order!zeega',
	'order!database',
	
	//plugins
	'order!jquery/plugins/jeditable.min',
	'order!jquery/plugins/jquery-cycle',
	'order!jquery/plugins/jquery.paging',
	'order!jquery/plugins/colorpicker/js/colorpicker',
	'order!js/jquery/plugins/jquery.getUrlParam.js',
	'order!js/jquery/plugins/jquery.json-2.2.min.js',
	'order!js/jquery/plugins/jquery.cookie.js',
	'order!js/jquery/plugins/jquery.tmpl.js',
	'order!js/jquery/plugins/bootstrap-modal.js',
	
	//mvc
	'order!backbone/models/project',
	'order!backbone/models/sequence',
	'order!backbone/models/item',
	'order!backbone/models/frame',
	'order!backbone/models/layer',
	'order!backbone/views/project-view',
	'order!backbone/views/sequence-view',
	'order!backbone/views/item-view',
	'order!backbone/views/frame-view',
	'order!backbone/views/layer-view',
	
	//sequences
	'order!backbone/sequences/sequences',
	
	//layers
	'order!layers/zeega._layer',
	'order!layers/zeega.audio',
	'order!layers/zeega.geo',
	'order!layers/zeega.image',
	'order!layers/zeega.text',
	'order!layers/zeega.video',
	'order!layers/zeega.documentcloud',
	
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

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
	//'jquery',


	//libraries
	'order!lib/underscore',
	'order!lib/backbone',

	'order!lib/spin',
	'order!lib/swfobject', // sfwobject should probably be somewhere else. helpers? plugins?
	'order!lib/jquery/ui/js/jquery-ui.min',

	//custom
	'order!ux/zeega.ux.header',
	'order!ux/zeega.ux.editor',
	'order!ux/layer-controls',
	'order!helpers/zeega.extends',
	'order!helpers/zeega.helpers',

	//core
	'order!app/zeega',
	
//	'order!app/zeega',
    'order!app/player',

	//plugins
	'order!lib/jquery/plugins/spin',
	'order!lib/jquery/plugins/jeditable.min',
	'order!lib/jquery/plugins/jquery-cycle',
	'order!lib/jquery/plugins/colorpicker/js/colorpicker',
	'order!lib/jquery/plugins/jquerygetUrlParam',
	'order!lib/jquery/plugins/jqueryjson',
	'order!lib/jquery/plugins/jquerycookie',
//	'order!lib/bootstrap',

//models
	'order!app/models/editor.model.project',
	'order!app/models/editor.model.sequence',
	'order!app/models/editor.model.item',
	'order!app/models/editor.model.frame',
	'order!app/models/editor.model.layer',

//collections
	'order!app/collections/editor.collections.sequence',
	'order!app/collections/editor.collections.item',
	'order!app/collections/editor.collections.frame',
	'order!app/collections/editor.collections.layer',

//views
	'order!app/views/editor.project/editor.view.project.editor',
	'order!app/views/editor.item/editor.view.item.database-tray',
	'order!app/views/editor.frame/editor.view.frame.frame-sequence',
	'order!app/views/editor.layer/editor.view.layer.layer-list',
	'order!app/views/editor.layer/editor.view.layer.visual-editor',

	//mvc
	'order!backbone/models/tag',

	//layers
	'order!app/_layer',
	'order!plugins/layers/audio/audio',
	'order!plugins/layers/geo/geo',
	'order!plugins/layers/image/image',
	'order!plugins/layers/text/text',
	'order!plugins/layers/video/video',
	'order!plugins/layers/youtube/youtube',
	'order!plugins/layers/documentcloud/documentcloud',
	'order!plugins/layers/rectangle/rectangle',
	'order!plugins/layers/website/website',

	//players
	'order!plugins/players/zeega.player.youtube',	
	'order!plugins/players/zeega.player.video',
	//'order!players/zeega.player.rdio',
	//'order!players/zeega.player.rdio.token',
	
	
	'order!app/index'
	

	];

require(loadFiles, function(jquery)
{
    console.log('ALL JS LOADED')

	//once the files have been loaded do this
	var sequence = $('#sequence-id').val();
	console.log(sequence);
	//zeega.app.init();

/*
	if(!sequence) Zeega.createSequence();
	else Zeega.loadSequence(sequence);


	var router = new MyRouter;
	Backbone.history.start();

	initUX();
*/
});


/*
Aloha.ready( function() {
	
	//Aloha.jQuery('#tester').aloha();


	require.config({
		baseUrl : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'js/'
	})

	var loadFiles = [
		//'jquery',
	
	
		//libraries
		'order!lib/underscore',
		'order!lib/backbone',
	
		'order!lib/spin',
		'order!lib/swfobject', // sfwobject should probably be somewhere else. helpers? plugins?
		'order!lib/jquery/ui/js/jquery-ui.min',
	
		//custom
		'order!ux/zeega.ux.header',
		'order!ux/zeega.ux.editor',
		'order!ux/layer-controls',
		'order!helpers/zeega.extends',
		'order!helpers/zeega.helpers',

		//core
		'order!app/index',
		'order!app/zeega',
		
		'order!app/zeega',
	    'order!app/player',
	    'order!core/database',
	
		//plugins
		'order!lib/jquery/plugins/spin',
		'order!lib/jquery/plugins/jeditable.min',
		'order!lib/jquery/plugins/jquery-cycle',
		'order!lib/jquery/plugins/colorpicker/js/colorpicker',
		'order!lib/jquery/plugins/jquerygetUrlParam',
		'order!lib/jquery/plugins/jqueryjson',
		'order!lib/jquery/plugins/jquerycookie',
		'order!lib/jquery/plugins/twitter-bootstrap',
	
	
		//mvc
		'order!backbone/models/sequence',
	    'order!backbone/models/tag',
		'order!app/models/editor.model.item',
		'order!backbone/models/editor.collection',
		'order!backbone/models/frame',
		'order!backbone/models/layer',
		'order!backbone/models/project',
		'order!backbone/views/sequence-view',
		'order!backbone/views/item-view',
		'order!backbone/views/editor.collection-view',
		'order!backbone/views/frame-view',
		'order!backbone/views/project-view',
	
		//'order!backbone/views/layer-view',
		'order!backbone/views/layer.view.visual',
		'order!backbone/views/layer.view.visual.list',
		'order!backbone/views/layer.view.visual.editor',
		//'order!backbone/views/layer.view.interaction.list',
	
		//sequences
		'order!backbone/routes/routes',
	
		//layers
		'order!app/_layer',
		'order!plugins/layers/audio/audio',
		'order!plugins/layers/geo/geo',
		'order!plugins/layers/image/image',
		'order!plugins/layers/text/text',
		'order!plugins/layers/video/video',
		'order!plugins/layers/youtube/youtube',
		//'order!plugins/layers/rdio/rdio',
		//'order!layers/zeega.twilio',
		'order!plugins/layers/documentcloud/documentcloud',
		'order!plugins/layers/rectangle/rectangle',
		'order!plugins/layers/website/website',
	
		//players
		'order!plugins/players/zeega.player.youtube',	
		'order!plugins/players/zeega.player.video',
		//'order!players/zeega.player.rdio',
		//'order!players/zeega.player.rdio.token',
	
		];

	require(loadFiles, function(jquery)
	{
	    console.log('ALL JS LOADED')

		//once the files have been loaded do this
		var sequence = $('#sequence-id').val();
		console.log(sequence);
		Zeega.init();
		if(!sequence) Zeega.createSequence();
		else Zeega.loadSequence(sequence);
	
	
		Database.init();
	
		var router = new MyRouter;
		Backbone.history.start();
	
		initUX();
	
	});

});
*/

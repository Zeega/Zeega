require.config({
	baseUrl : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'js/',
	paths : {
		'order' : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'js/lib/order',
		'text' : sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'js/lib/text'
	}
});

require (
	[
			//libraries
			'order!lib/underscore',
			'order!lib/backbone',
			
			'order!lib/jquery/ui/js/jquery-ui.min',
			'order!lib/spin',
			'order!lib/swfobject', // sfwobject should probably be somewhere else. helpers? plugins?
			'order!lib/visualsearch',
			'order!lib/leaflet/leaflet',
			
			//core
			'order!app/discovery/zeega.discovery',
			
			//plugins
			'order!lib/imagesloaded/jquery.imagesloaded',
			'order!lib/jquery/plugins/spin',
			'order!lib/jquery/plugins/jeditable.min',
			'order!lib/jquery/plugins/jquery-cycle',
			'order!lib/farbtastic/farbtastic',
			'order!lib/jquery/plugins/jquerygetUrlParam',
			'order!lib/jquery/plugins/jqueryjson',
			'order!lib/jquery/plugins/jquerycookie',
			'order!lib/popcorn-flash',
			'order!lib/bootstrap',
	
			'order!plugins/players/plyr',

			//models
			'order!app/discovery/discovery.model.item',
			
			//collections
			'order!app/discovery/discovery.collection.item',
		
			
			//views

			'order!app/discovery/discovery.view.item',
			'order!app/discovery/discovery.view.leaflet-map',
			'order!app/discovery/discovery.view.tag-display-edit',
			'order!app/discovery/discovery.view.item.viewer',
			'order!app/discovery/discovery.view.collection.results',
			
				//custom
			'order!helpers/utils',
			'order!app/discovery/index.discovery'
	
	],function(){});


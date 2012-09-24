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
			'order!app/zeega.discovery',
			
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
			
			'order!app/models/discovery.model.user',
			'order!app/models/discovery.model.item',
			'order!app/models/discovery.model.tag',
			
			//collections
			'order!app/collections/discovery.collection.item',
		
			
			//views
			
		
			'order!app/views/discovery.items/discovery.view.item.collection-details',
			'order!app/views/discovery.items/discovery.view.item.thumb',
			'order!app/views/discovery.items/discovery.view.item.publish-settings',
			
			
			'order!app/views/editor.common/editor.view.common.leaflet-map',
			'order!app/views/editor.common/editor.view.common.tag-display-edit',
			'order!app/views/editor.item/editor.view.item.viewer',
			
			'order!app/views/discovery.collections/discovery.view.collection.results',
			'order!app/views/discovery.collections/discovery.view.collection.my-collections-drawer',
			//'order!app/views/discovery.collections/discovery.view.collection.map-popup',
		
		
			'order!app/views/discovery.users/discovery.view.user.user-page',
			
				//custom
			'order!helpers/utils',
			'order!app/index.discovery',
	
	],function(){});


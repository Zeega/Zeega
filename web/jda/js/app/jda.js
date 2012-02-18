// This contains the module definition factory function, application state,
// events, and the router.
this.jda = {
	// break up logical components of code into modules.
	module: function()
	{
		// Internal module cache.
		var modules = {};

		// Create a new module reference scaffold or load an existing module.
		return function(name) 
		{
			// If this module has already been created, return it.
			if (modules[name]) return modules[name];

			// Create a module and save it under this name
			return modules[name] = { Views: {} };
		};
	}(),

  // Keep active application instances namespaced under an app object.
  app: _.extend({
	
	currentView : 'list',
	mapLoaded : false,
	japanMapUrl : "http://worldmap.harvard.edu/geoserver/",
	geoUrl : "http://geo.zeega.org/geoserver/",
	
	init : function()
	{
		// Include all modules
		var Items = jda.module("items");
		var Tags = jda.module("tags");
		// make item collection
		this.itemViewCollection = new Items.ViewCollection();
		
	},
	
	search : function(obj)
	{
		this.itemViewCollection.search(obj);

	},
	
	switchViewTo : function( view )
	{
		if( view != this.currentView )
		{
			$('#'+this.currentView+'-view').hide();
			this.currentView = view;
			$('#'+view+'-view').show();
			switch( this.currentView )
			{
				case 'list':
					this.showListView();
					break;
				case 'event':
					this.showEventView();
					break;
				case 'tag':
					this.showTagView();
					break;
				default:
					console.log('view type not recognized')
			}
		}
	},
	
	showListView : function()
	{
		console.log('switch to List view')

	},
	
	showEventView : function()
	{
		console.log('switch to Event view')
		this.initWorldMap();
	},
	
	showTagView : function()
	{
		console.log('switch to Tag view')
		
	},
	
	initWorldMap : function()
	{
		if( !this.mapLoaded )
		{
			//OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
			//OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;
			//this.CQLformat = new OpenLayers.Format.CQL();
		
			var map = new OpenLayers.Map('event-map');
			var baseLayer = new OpenLayers.Layer.WMS(
				"OpenLayers WMS",
				"http://vmap0.tiles.osgeo.org/wms/vmap0?",
				{ 'layers' : 'basic' } );
			map.addLayer( baseLayer );
			map.setCenter(new OpenLayers.LonLat(140.652466, 38.052417), 9);
			map.addLayers( this.getMapLayers() );

			this.startMapListeners( map );
			this.mapLoaded = true;
		}
	},
	
	startMapListeners : function( map )
	{
		var _this = this;
		map.events.register('click', map, function(e) {
			var params = {
				REQUEST : "GetFeatureInfo",
				EXCEPTIONS : "application/vnd.ogc.se_xml",
				BBOX : map.getExtent().toBBOX(),
				SERVICE : "WMS",
				VERSION : "1.1.1",
				X : e.xy.x,
				Y : e.xy.y,
				INFO_FORMAT : 'text/html',
				QUERY_LAYERS : 'cite:item',
				FEATURE_COUNT : 50,
				Layers : 'cite:item',
				WIDTH : map.size.w,
				HEIGHT : map.size.h,
				// format : format,
				styles : map.layers[0].params.STYLES,
				srs : map.layers[0].params.SRS
			};
			// merge filters
			if (map.layers[0].params.CQL_FILTER != null) params.cql_filter = map.layers[0].params.CQL_FILTER;
			if (map.layers[0].params.FILTER != null) params.filter = map.layers[0].params.FILTER;
			if (map.layers[0].params.FEATUREID) params.featureid = map.layers[0].params.FEATUREID;

			OpenLayers.loadURL(_this.geoUrl + "cite/wms", params, _this, _this.onMapClick, _this.onMapClick);
			_this.mapClickEvent = e;
			OpenLayers.Event.stop(e);
		});
	},
	
	onMapClick : function(response)
	{
		//TODO close existing popups
		var data = eval('(' + response.responseText + ')');
		//var data = jQuery.parseJSON( response.responseText ); //doesn't work in all cases :(
		
		console.log(data);
		
		
		/*******************
		
parse data.features into backbone collection and views for display in the popup window
		
		********************/
		
		
		/*
		features = data["features"];
		features.shift();  //removes first item which is empty
		mapPopUpList = new DiscoveryMapListView({
			collection : new ItemCollection(features)
		});
		mapPopupHTML = $(mapPopUpList.el).html();
		map.addPopup(new OpenLayers.Popup.FramedCloud("map-popup", map.getLonLatFromPixel(this.mapClickEvent.xy), map.size, mapPopupHTML, null, true));
		*/
	},
	
	getMapLayers : function()
	{
		var layers = [];
		
		layers.push(new OpenLayers.Layer.WMS(
			"cite:item - tiled",
			this.geoUrl + "cite/wms",
			{
				layers : 'cite:item',
				transparent : true,
				format : 'image/png'
			})
		);
		
		
		
		/*

		layers.push( new OpenLayers.Layer.WMS(
			"Municipal Districts",
			this.japanMapUrl + "wms",
			{
				layers : "geonode:Admin_Dissolve_Test2_JOB",
				format : 'image/png',
				transparent : true,
				tiled : true
			},
			{
				singleTile : false,
				wrapDateLine : true,
				visibility : false,
				opacity : 0.3
			})
		);
			
		layers.push( new OpenLayers.Layer.WMS(
			"Radiation",
			this.japanMapUrl + "wms",
			{
				layers : "geonode:rad_may11_contours_final_cgl",
				format : 'image/png',
				transparent : true,
				tiled : true
			},
			{
				singleTile : false,
				wrapDateLine : true,
				visibility : false
			})
		);
		
		layers.push( new OpenLayers.Layer.WMS(
			"Casualties",
			this.japanMapUrl + "wms",
			{
				layers : "geonode:Slct_Casualty2010Join1_Final_zDe",
				format : 'image/png',
				transparent : true,
				tiled : true
			},
			{
				singleTile : false,
				wrapDateLine : true,
				visibility : false,
				opacity : 0.5
			})
		);
		
		layers.push( new OpenLayers.Layer.WMS(
			"Flooding",
			this.japanMapUrl + "wms",
			{
				layers : "geonode:japan8m_ezt",
				format : 'image/png',
				transparent : true,
				tiled : true
			},
			{
				singleTile : false,
				wrapDateLine : true,
				visibility : false
			})
		);
			
		layers.push( new OpenLayers.Layer.WMS(
			"Shake",
			this.japanMapUrl + "wms",
			{
				layers : "geonode:InstruIntensity_Clip_dOd",
				format : 'image/png',
				transparent : true,
				tiled : true
			},
			{
				singleTile : false,
				wrapDateLine : true,
				visibility : false,
				opacity : 0.3
			})
		);
		*/
		
		return layers;
	}
	
	
	
	
}, Backbone.Events)


};

var TimelineView = Backbone.View.extend({

	className : "discovery-time-slider",

	events : {},

	initialize : function() {
		this.parent = this.options.parent;
		this.render();
	},

	render : function() {
		$(this.el).empty();
		thisTimelineView = this;
		w = $('#discovery-interface-content').width();
		h = 30;
		$(this.el).width(w - 480);
		$(this.el).height(h);
		this.timeSlider = $("<div></div>");
		this.markerWrapper = $("<div></div>");
		this.markerWrapper.css({
			"position" : "relative",
			"width" : $(this.el).width(),
			"height" : $(this.el).height(),
			"top" : -h,
			"left" : "0px"
		});

		this.timeSlider.slider({
			range : true,
			min : 1299819600000,
			max : new Date().getTime(),
			values : [ 1299819600000, new Date().getTime() ],
			stop : function(event, ui) {
				thisTimelineView.model.set({
					start : ui.values[0]
				});
				thisTimelineView.model.set({
					end : ui.values[1]
				});
				thisTimelineView.parent.updateTimeFilter(thisTimelineView.model);
			}
		});
		$(this.el).append(this.timeSlider);
		$(this.el).append(this.markerWrapper);

		return this;
	}
});

var DiscoveryEventMap = Backbone.View.extend({
	className : 'discovery-event-map',
	events : {
		"click #event-municipal-checkbox" : "toggleMunicipalLayer",
		"click #event-radiation-checkbox" : "toggleRadiationLayer",
		"click #event-casualties-checkbox" : "toggleCasualtiesLayer",
		"click #event-flooding-checkbox" : "toggleFloodingLayer",
		"click #event-shake-checkbox" : "toggleShakeLayer",
	},

	initialize : function() {
		this.parent = this.options.eventView;

		OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
		OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

		this.CQLformat = new OpenLayers.Format.CQL();

		// Add a div to put the map in
		this.container = $("<div id='discovery-event-map-container'></div>");

		japanMapLayers = [ this.municipalLayer, this.radiationLayer, this.casualtiesLayer, this.floodingLayer, this.shakeLayer ];

		layerCheckboxes = $("<form></form>");
		layerCheckboxes.append($("<input type='checkbox' id='event-municipal-checkbox'/>"));
		layerCheckboxes.append($("<label>Municipal Districts</label>"));
		layerCheckboxes.append($("<input type='checkbox' id='event-radiation-checkbox'/>"));
		layerCheckboxes.append($("<label>Radiation</label>"));
		layerCheckboxes.append($("<input type='checkbox' id='event-casualties-checkbox'/>"));
		layerCheckboxes.append($("<label>Casualties</label>"));
		layerCheckboxes.append($("<input type='checkbox' id='event-flooding-checkbox'/>"));
		layerCheckboxes.append($("<label>Flooding</label>"));
		layerCheckboxes.append($("<input type='checkbox' id='event-shake-checkbox'/>"));
		layerCheckboxes.append($("<label>Shake</label>"));

		$(this.el).append(this.container);
		$(this.el).append(layerCheckboxes);

		this.render();
	},

	render : function() {

		w = $('#discovery-interface-content').width();
		h = $('#discovery-interface-content').height();;
		this.container.width(w - 480).height(h-100);

		return this;
	},

	addMap : function() {
		map = new OpenLayers.Map('discovery-event-map-container');
		backgroundLayer = new OpenLayers.Layer.WMS("OpenLayers WMS", "http://vmap0.tiles.osgeo.org/wms/vmap0?", {
			layers : 'basic'
		});

		this.itemsLayer = new OpenLayers.Layer.WMS("cite:item - tiled", geoUrl + "cite/wms", {
			layers : 'cite:item',
			transparent : true,
			format : 'image/png'
		});

		this.municipalLayer = new OpenLayers.Layer.WMS("Municipal Districts", japanMapUrl + "wms", {
			layers : "geonode:Admin_Dissolve_Test2_JOB",
			format : 'image/png',
			transparent : true,
			tiled : true
		}, {
			singleTile : false,
			wrapDateLine : true,
			visibility : false,
			opacity : 0.3
		});
		this.radiationLayer = new OpenLayers.Layer.WMS("Radiation", japanMapUrl + "wms", {
			layers : "geonode:rad_may11_contours_final_cgl",
			format : 'image/png',
			transparent : true,
			tiled : true
		}, {
			singleTile : false,
			wrapDateLine : true,
			visibility : false
		});
		this.casualtiesLayer = new OpenLayers.Layer.WMS("Casualties", japanMapUrl + "wms", {
			layers : "geonode:Slct_Casualty2010Join1_Final_zDe",
			format : 'image/png',
			transparent : true,
			tiled : true
		}, {
			singleTile : false,
			wrapDateLine : true,
			visibility : false,
			opacity : 0.5
		});
		this.floodingLayer = new OpenLayers.Layer.WMS("Flooding", japanMapUrl + "wms", {
			layers : "geonode:japan8m_ezt",
			format : 'image/png',
			transparent : true,
			tiled : true
		}, {
			singleTile : false,
			wrapDateLine : true,
			visibility : false
		});
		this.shakeLayer = new OpenLayers.Layer.WMS("Shake", japanMapUrl + "wms", {
			layers : "geonode:InstruIntensity_Clip_dOd",
			format : 'image/png',
			transparent : true,
			tiled : true
		}, {
			singleTile : false,
			wrapDateLine : true,
			visibility : false,
			opacity : 0.3
		});

		japanMapLayers = [ this.municipalLayer, this.radiationLayer, this.casualtiesLayer, this.floodingLayer, this.shakeLayer ];

		map.addLayers(japanMapLayers);
		map.addLayers([ backgroundLayer, this.itemsLayer ]);
		map.setCenter(new OpenLayers.LonLat(140.652466, 38.052417), 9);

		// support GetFeatureInfo
		map.events.register('click', map, function(e) {
			// var params = {
			// REQUEST : "GetFeatureInfo",
			// EXCEPTIONS : "application/vnd.ogc.se_xml",
			// BBOX : map.getExtent().toBBOX(),
			// SERVICE : "WMS",
			// VERSION : "1.1.1",
			// X : e.xy.x,
			// Y : e.xy.y,
			// INFO_FORMAT : 'text/html',
			// QUERY_LAYERS : map.layers[0].params.LAYERS,
			// FEATURE_COUNT : 50,
			// Layers : 'cite:item',
			// WIDTH : map.size.w,
			// HEIGHT : map.size.h,
			// format : format,
			// styles : map.layers[0].params.STYLES,
			// srs : map.layers[0].params.SRS
			// };
			// // merge filters
			// if (map.layers[0].params.CQL_FILTER != null) {
			// params.cql_filter = map.layers[0].params.CQL_FILTER;
			// }
			// if (map.layers[0].params.FILTER != null) {
			// params.filter = map.layers[0].params.FILTER;
			// }
			// if (map.layers[0].params.FEATUREID) {
			// params.featureid = map.layers[0].params.FEATUREID;
			// }
			// OpenLayers.loadURL(geoUrl + "cite/wms", params, this,
			// this.clickResponseHandler, this.clickResponseHandler);
			// OpenLayers.Event.stop(e);

		});
	},

	clickResponseHandler : function(response) {
		console.log(response.responseText);
	},

	updateTimeFilter : function(timeFilter) {
		startString = mmsToString(timeFilter.get("start"));
		endString = mmsToString(timeFilter.get("end"));
		console.log(startString);
		CQL = "media_date_created >= '" + startString + "' AND media_date_created	 <= '" + endString + "'";
		this.itemsLayer.mergeNewParams({
			'CQL_FILTER' : CQL
		});

	},

	toggleMunicipalLayer : function() {
		this.municipalLayer.setVisibility($("#event-municipal-checkbox").is(':checked'));
	},
	toggleRadiationLayer : function() {
		this.radiationLayer.setVisibility($("#event-radiation-checkbox").is(':checked'));
	},
	toggleCasualtiesLayer : function() {
		this.casualtiesLayer.setVisibility($("#event-casualties-checkbox").is(':checked'));
	},
	toggleFloodingLayer : function() {
		this.floodingLayer.setVisibility($("#event-flooding-checkbox").is(':checked'));
	},
	toggleShakeLayer : function() {
		this.shakeLayer.setVisibility($("#event-shake-checkbox").is(':checked'));
	},

});

var DiscoveryEventView = Backbone.View.extend({
	// TODO incorporate Search as the model associated with this view.
	className : 'event-interfacce',

	events : {},

	initialize : function() {
		// Remove any existing event filters
		for ( var i = 0; i < filters.length; i++) {
			if (filters.at(i).get("type") == "event") {
				filters.remove(filters.at(i));
				break;
			}
		}
		
		filters.add(this.model);

		this.listView = new DiscoveryCompactListView({
			collection : this.collection
		});
		this.mapView = new DiscoveryEventMap({
			model : filters,
			parent : this
		});
		this.timelineView = new TimelineView({
			model : this.model,
			parent : this
		});
		this.render();
	},

	addMap : function() {
		this.mapView.addMap();
	},

	updateTimeFilter : function(timeFilter) {
		this.mapView.updateTimeFilter(timeFilter);
	},

	update : function() {
		this.updateTimelineMarkers();
		this.updateLayers();
	},

	render : function() {
		$(this.el).empty();
		that = this;
		var h = $('#discovery-interface-content').height();
		var w = $('#discovery-interface-content').width();

		var container = $("<div></div>");
		container.attr("id", "discovery-event-interface-container");
		container.height(h - 30);
		container.width(w);

		var navigation = $("<div></div>");
		navigation.addClass("discovery-event-navigation");
		navigation.height(h - 15);
		navigation.width(w - 600);

		navigation.append(this.timelineView.el);
		navigation.append(this.mapView.el);
		this.mapView.addMap();

		container.append(this.listView.el);
		container.append(navigation);

		$(this.el).append(container);

		return this;
	},

});
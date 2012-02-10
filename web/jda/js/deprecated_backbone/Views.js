var HomeThumbCarousel = Backbone.View.extend({
	tagName : 'ul',
	className : 'carousel',

	autoScrolling : true,

	events : {
		"mouseleave" : "resume",
		"mouseenter" : "pause"
	},

	initialize : function() {
		_.bindAll(this, 'slide');
		window.setInterval(this.slide, 5000);
		var self = this;
		this.autoScrolling = true;
		this._thumbViews = [];
		for ( var i = 0; i < 8; i++) {
			self._thumbViews.push(viewLookup(this.collection.models[i], "HomeCarouselItemView"));
		}
		;
		this.render();
	},

	render : function() {
		var that = this;
		$(this.el).empty();

		// Render each sub-view and append it to the parent view's
		// element.
		_(this._thumbViews).each(function(tv) {
			$(that.el).append(tv.el);
		});
		return this.el;
	},

	slide : function() {
		if (this.autoScrolling) {
			var item_width = $('#home-thumb-carousel ul li').outerWidth(true);
			var left_indent = parseInt($('#home-thumb-carousel ul').css('left')) - item_width;
			$('#home-thumb-carousel ul').animate({
				'left' : left_indent
			}, 3000, 'easeInOutQuint', function() {
				$('#home-thumb-carousel ul li:last').after($('#home-thumb-carousel ul li:first'));
				$('#home-thumb-carousel ul').css({
					'left' : -item_width
				});
			});
		}
	},

	pause : function() {
		this.autoScrolling = false;
	},

	resume : function() {
		this.autoScrolling = true;
	}
});

var MiniMapView = Backbone.View.extend({
	className : 'page-mini-map',
	events : {},

	initialize : function() {
		_.bindAll(this, "addMap");
		this.lonLat = new OpenLayers.LonLat(this.model.get("media_geo_longitude"), this.model.get("media_geo_latitude"));

		OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
		OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

		// Add a div to put the map in
		this.container = $("<div id='mini-map-" + this.model.get("id") + "'></div>");
		this.container.width(200).height(200);
		$(this.el).append(this.container);

		this.render();
	},

	render : function() {
		return this;
	},

	addMap : function() {
		map = new OpenLayers.Map("mini-map-" + this.model.get("id"), {
			controls : []
		});
		backgroundLayer = new OpenLayers.Layer.WMS("OpenLayers WMS", "http://vmap0.tiles.osgeo.org/wms/vmap0?", {
			layers : 'basic'
		});

		markers = new OpenLayers.Layer.Markers("Markers");
		size = new OpenLayers.Size(17, 20);
		offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
		icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);
		markers.addMarker(new OpenLayers.Marker(this.lonLat, icon));

		map.addLayers([ backgroundLayer, markers ]);
		map.setCenter(this.lonLat, 10);
	}
});

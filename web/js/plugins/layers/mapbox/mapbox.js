(function(Layer){

	Layer.Mapbox = Layer.Model.extend({
			
		layerType : 'Mapbox',
		

		defaultAttributes: {
		
			'title' : 'Mapbox Layer',
			'left' : 0,
			'top' : 0,
			'height' : 100,
			'width' : 100,
			'opacity':1,
			'aspect':1.33,
			'citation':true,
			'media_geo_latitude':  40.7774,
			'media_geo_longitude' : -73.9606,
			'attributes':{
				zoom:12,
				maxzoom: 18,
				minzoom:0,
			},
			'zoomControl':12,
			'interaction':false,
			
		},
		
	});
	
	Layer.Views.Controls.Mapbox = Layer.Views.Controls.extend();

	Layer.Views.Visual.Mapbox = Layer.Views.Visual.extend({
		
		draggable : false,
		linkable : true,
		visual : true,
		scalable : true,
		
		render : function()
		{
			
			this.tileUrl='http://{s}.tiles.mapbox.com/v3/'+this.attr.uri+'/{z}/{x}/{y}.png',
   			this.tileLayer = new L.TileLayer(this.tileUrl, {minZoom: this.attr.attributes.minzoom,maxZoom: this.attr.attributes.maxzoom, attribution: ''});
			this.latlng=new L.LatLng(parseFloat(this.attr.media_geo_latitude),parseFloat(this.attr.media_geo_longitude));

			$(this.el).css( {
				'width' : this.attr.width+ '%',
				'height' : this.attr.height +'%'
			});
			
			$(this.el).html( $('<div>')
				.css({'width':'100%','height':'100%'})
				.addClass('cloud-map')
				);
				
			return this;
		},
		
		onLayerEnter : function()
		{
			
			var div = $(this.el).find('.cloud-map').get(0);
		  	var mapOptions ={ 
		  		minZoom: this.attr.attributes.minzoom,
		  		maxZoom: this.attr.attributes.maxzoom, 
		  		scrollWheelZoom:false,
		  		zoomControl:false,
		  		doubleClickZoom:false
		  	}
		  	console.log(mapOptions);
		  	console.log(this.attr);
		  	
			this.map = new L.Map(div,mapOptions);
			console.log(this.attr);
			this.map.setView(this.latlng, this.attr.attributes.zoom).addLayer(this.tileLayer);
			
			//Save position and zoom level of map
			
			var _this=this;
			this.map.on('zoomend', function(e) {
				_this.model.update({attributes : {zoom: e.target.getZoom()} });
				_this.attr.attributes.zoom =e.target.getZoom();
			});
			
			
			this.map.on('dragend', function(e) {
				_this.model.update({media_geo_latitude : e.target.getCenter().lat, media_geo_longitude : e.target.getCenter().lng });
				_this.latlng=e.target.getCenter();
			});
			
			
			this.zoomControl = new L.Control.Zoom();
			this.map.addControl(this.zoomControl);
		},
		
		
		onPreload : function()
		{
			console.log('oh yeah');
			console.log(this.el);
			console.log('oh yeah');
			var div = $(this.el).find('.cloud-map').get(0);
		  console.log(this.el);
			this.map = new L.Map(div,{minZoom: this.attr.attributes.minzoom,maxZoom: this.attr.attributes.maxzoom, scrollWheelZoom:false,zoomControl:false,doubleClickZoom:false});
			this.map.setView(this.latlng, this.attr.attributes.zoom).addLayer(this.tileLayer);
			
			//Save position and zoom level of map
			
			var _this=this;
			this.map.on('zoomend', function(e) {
				_this.model.update({zoom :  e.target.getZoom() });
			});
			
			
			this.map.on('dragend', function(e) {
				_this.model.update({media_geo_latitude : e.target.getCenter().lat, media_geo_longitude : e.target.getCenter().lng });
			});
			
			
			this.zoomControl = new L.Control.Zoom();
			this.map.addControl(this.zoomControl);
			this.model.trigger('ready',this.model.id);
		}
		
		
	});
	
})(zeega.module("layer"));
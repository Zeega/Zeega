(function(Items) {

	Items.Views.Common = Items.Views.Common || {};
	// This will fetch the tutorial template and render it.
	Items.Views.Common.LeafletMap = Backbone.View.extend({

		className : 'leaflet-map',
		
		isEditable : true,
		isMapRendered : false,
		
		map : null,
		marker : null,
		
		mapTileURL : 'http://{s}.tiles.mapbox.com/v2/mapbox.mapbox-streets/{z}/{x}/{y}.png',
		
		initialize : function()
		{
			this.isGeoLocated = !_.isNull(this.model.get('media_geo_latitude')) ? true : false;
			if( this.isGeoLocated ) this.loc = new L.LatLng( parseFloat(this.model.get('media_geo_latitude')), parseFloat(this.model.get('media_geo_longitude')) )
		},
		
		render : function()
		{
			if( !this.isGeoLocated )
			{
				this.$el.html( this.getEmptyTemplate() ).css({
					'background-color':'#eee',
					'text-align':'center',
					'height' : '200px'
				});
			}
			else
			{
				this.$el.html("<div id='map-"+ this.model.id +"' class='item-map'></div><div class='geolocator hide'><input type='text' class='map-search-input span3' placeholder='search locations'/></div>")
			}
			//console.log($('<div>').append(this.$el.find('.item-map').clone()).html() +'')
			
			return this;
		},
		
		events : {
			'click .add-map-location' : 'addMapLocation',
			'click .edit-leaflet-map' : 'editExistingMap',
			'click .save-leaflet-map' : 'saveMap',
			'keypress .map-search-input' : 'inputKeypress'
		},
		
		inputKeypress : function(e)
		{
			if(e.which == 13)
			{
				this.geolocate( this.$el.find('input').val() );
				return false;
			}
		},
		
		renderMap : function()
		{
			console.log('render map!!!','map-'+this.model.id )
			this.map = new L.Map('map-'+this.model.id);
			this.tiles = new L.TileLayer(this.mapTileURL, {
				maxZoom: 18,
				attribution: ''
			});
			this.marker = new L.Marker(this.loc,{
				//draggable : this.isEditable ? true : false, //when editing is allowed
				draggable : false, // for now
			});
			this.map.setView(this.loc,13).addLayer(this.tiles).addLayer(this.marker);
			if(this.isEditable) this.addEditIconToMap();
			this.isMapRendered = true;
		},
		
		addEditIconToMap : function()
		{
			this.$el.find('.leaflet-control-zoom').append('<a href="#" class="edit-leaflet-map leaflet-map-control-custom"><i class="icon-pencil"></i></a>')
		},
		
		editExistingMap : function()
		{
			this.$el.find('.edit-leaflet-map .icon-pencil').removeClass('icon-pencil').addClass('icon-ok-sign save-map');
			this.$el.find('.edit-leaflet-map').removeClass('edit-leaflet-map').addClass('save-leaflet-map');
			this.$el.find('.geolocator').show();
			this.makeMapEditable();
			
			return false;
		},
		
		makeMapEditable : function()
		{
			var _this = this;
			this.marker.dragging.enable();
			this.marker.on('dragend',this.markerDragged, this);
		},
		
		saveMap : function()
		{
			console.log('save map!!')
			this.$el.find('.save-leaflet-map .save-map').addClass('icon-pencil').removeClass('icon-ok-sign').removeClass('save-map');
			this.$el.find('.save-leaflet-map').addClass('edit-leaflet-map').removeClass('save-leaflet-map');
			this.$el.find('.map-search-input').remove();
			this.$el.find('.geolocator').hide();
			this.marker.dragging.disable();
			this.marker.off('dragend');
			
			return false;
		},
		
		geolocate : function( addr )
		{
			var _this = this;
			if(!this.geocoder) this.geocoder = new google.maps.Geocoder();
			this.geocoder.geocode( { 'address': addr}, function(results, status){
							if (status == google.maps.GeocoderStatus.OK)
							{
								_this.loc=new L.LatLng(results[0].geometry.location.lat(),results[0].geometry.location.lng());

								_this.map.setView( _this.loc,8);
								_this.marker.setLatLng(_this.loc);

								_this.model.save({
									'media_geo_latitude': results[0].geometry.location.lat(),
									'media_geo_longitude': results[0].geometry.location.lng()
								})
							}
							else console.log("Geocoder failed at address look for "+$(that.el).find('.locator-search-input').val()+": " + status);
						});
			
		},
		
		markerDragged : function(e)
		{
			this.model.save({
				'media_geo_latitude' : e.target.getLatLng().lat,
				'media_geo_longitude' : e.target.getLatLng().lng,
			})
		},
		
		addMapLocation : function()
		{
			this.loc = new L.LatLng( 42.370673,-71.10446 );
			this.isGeoLocated = true;
			this.render();
			this.renderMap();
			this.makeMapEditable();
		},
		
		getMapTemplate : function()
		{
			var html = 
				"";
			return html;
		},
		getEmptyTemplate : function()
		{
			return '<a href="#" class="add-map-location" style="position:relative; top:90px"><i class="icon-map-marker"></i> add location</a>'
		}
	});

	
})(zeega.module("items"));




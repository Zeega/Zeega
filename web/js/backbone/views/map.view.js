var LocatorMapView = Backbone.View.extend({
	
	tagName : 'div',
	className: 'item-map',
	
	initialize : function()
	{
		this.mapRendered=false;
		this.cloudmadeUrl = 'http://{s}.tile.cloudmade.com/da4f1fa0e3634976afb1083e06407ffc/3121/256/{z}/{x}/{y}.png',
    	this.cloudmadeAttrib = '',
   		this.cloudmade = new L.TileLayer(this.cloudmadeUrl, {maxZoom: 18, attribution: this.cloudmadeAttrib});
		if(parseFloat(this.model.get('media_geo_latitude'))) this.geoLocated=true;
		else this.geoLocated=false;
		
		this.latlng = new L.LatLng(parseFloat(this.model.get('media_geo_latitude')),parseFloat(this.model.get('media_geo_longitude')));
		
		var values = {
			latitude : this.model.get('media_geo_latitude'),
			longitude : this.model.get('media_geo_longitude'),
		};
		//use template to clone the database items into
		var template = _.template( this.getTemplate() );
		//copy the cloned item into the el
		$(this.el).append( template( values ) );
	},
	
	events : {
		
		'click .edit-geo-location' : 'displaySearch',
		'focus .locator-search-input': 'clearSearch',
		'keypress .locator-search-input': 'runSearch',
	},
	
	render : function( )
	{
		return this.el;
	},
	
	
	/*Map Functionality */
	
	addMap:function()
	{
		$(this.el).find('.item-lat-lng').fadeIn();
		$(this.el).find('.locator-map').fadeIn();
		this.mapRendered=true;
		var div = $(this.el).find('.locator-map').get(0);

		this.map = new L.Map(div);
    	this.map.setView(this.latlng, 13).addLayer(this.cloudmade);
    	$('.leaflet-control-attribution').hide();
    	
    	var that=this;
    
		//this.circle = new L.CircleMarker(this.latlng, 100, this.circleOptions);
		this.marker = new L.Marker(this.latlng,{draggable:true});
		this.map.addLayer(that.marker);
		this.marker.addEventListener( 'drag', that.updateLatLng, that );
		this.marker.addEventListener( 'dragend', that.updateItem, that );
	},
	updateMap:function(){
		this.map.setView(this.latlng, 13);
		this.marker.setLatLng(this.latlng);
	},

	updateLatLng:function(e)
	{
		$(this.el).find('.item-latitude').html(e.target.getLatLng().lat);
		$(this.el).find('.item-longitude').html(e.target.getLatLng().lng);
	},
	
	updateItem:function(e)
	{
		this.model.set({'media_geo_latitude':e.target.getLatLng().lat,'media_geo_longitude':e.target.getLatLng().lng,});
		this.model.save();
	},
	
	/* Search bar functionality */
	
	clearSearch : function(){
		$(this.el).find('.locator-search-input').attr('value','');
	},
	displaySearch : function(){
		var that=this;
		$(this.el).find('.edit-geo-location').fadeOut('fast',function(){$(that.el).find('.locator-search-bar').fadeIn();});
		this.geocoder = new google.maps.Geocoder();
	},
	runSearch : function(e){
		if(e.keyCode==13){
			$(this.el).find('.locator-search-input').blur();
			var that=this;
			var placeText = $(that.el).find('.locator-search-input').val();
			this.geocoder.geocode( { 'address': placeText}, function(results, status) {
				
				if (status == google.maps.GeocoderStatus.OK) {
					
					that.latlng=new L.LatLng(results[0].geometry.location.lat(),results[0].geometry.location.lng());
					if(that.mapRendered) that.updateMap();
					else that.addMap();
					that.model.set({'media_geo_latitude':that.latlng.lat,'media_geo_longitude':that.latlng.lng,});
					that.model.save({},{success: function(){
						$(that.el).find('.locator-search-bar').fadeOut('fast',
								function(){
									$(that.el).find('.edit-geo-location a').text('Edit item location (' + placeText + ")");
									$(that.el).find('.edit-geo-location').fadeIn();

								});
					}});
				}
				else console.log("Geocoder failed at address look for "+$(that.el).find('.locator-search-input').val()+": " + status);
			});
		}
	
	},
	
	
	/* Template */
	
	getTemplate : function()
	{
		var html =	'<p class="map-title">Map</p><div class="locator-map"></div><span class="edit edit-geo-location"><a>Edit item location</a></span>'+
			'<div class="item-lat-lng"><span class="item-latitude"><%= latitude %></span><span class="item-longitude"><%= longitude %></span></div>'+
			'<div class="locator-search-bar"><input class="locator-search-input" type="text" value="Search a Location"  ></div>';
		return html;
	}

	
	
});
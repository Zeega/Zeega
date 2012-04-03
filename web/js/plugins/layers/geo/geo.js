(function(Layer){

	Layer.Geo = Layer.Model.extend({
			
		layerType : 'Geo',

		defaultAttributes : {
			'title' : 'Map Layer',
			'height' : 100,
			'width' : 100,
			'lat' : 42.3735626,
			'lng' : -71.1189639,
			'zoom' : 10,
			'streetZoom' : 1,
			'heading' : 0,
			'pitch' : 0,
			'mapType' : 'satellite',
			
			'url' : 'http://4.mshcdn.com/wp-content/gallery/awkward-stock-photos/tumblr_lt2fe6mnmw1qakqfvo1_400.jpg',
			'left' : 0,
			'top' : 0,
			'height' : 100,
			'width' : 100,
			'opacity':1,
			'aspect':1.33,
			'citation':true,
			
			'linkable' : true
		}

	});
	
	Layer.Views.Controls.Geo = Layer.Views.Controls.extend({
		
		render : function()
		{
			
			var widthSlider = new Layer.Views.Lib.Slider({
				property : 'width',
				model: this.model,
				label : 'Width',
				suffix : '%',
				min : 1,
				max : 200,
			});
			var heightSlider = new Layer.Views.Lib.Slider({
				property : 'height',
				model: this.model,
				label : 'Height',
				suffix : '%',
				min : 1,
				max : 200,
			});
			
			var opacitySlider = new Layer.Views.Lib.Slider({
				property : 'opacity',
				model: this.model,
				label : 'Opacity',
				step : 0.01,
				min : .05,
				max : 1,
			});
			
			var gMaps = new Layer.Views.Lib.GoogleMaps({
				model: this.model,
			});
			
			$(this.controls)
				.append( gMaps.getControl() )
				.append( widthSlider.getControl() )
				.append( heightSlider.getControl() )
				.append( opacitySlider.getControl() );
			
			return this;
		
		}
		
	});

	Layer.Views.Visual.Geo = Layer.Views.Visual.extend({
		
		draggable : true,
		linkable : true,
		
		init : function()
		{
			console.log('	GEO INIT')
			this.model.on('change', this.updateVisual, this)
		},
		
		render : function()
		{
			
			var map = $('<div id="gmap-'+ this.model.id +'">')
				.css({
					'width':'100%',
					'height':'100%'
				});

			$(this.el).html( map ).css({height:this.attr.height+'%'});
			
						
			return this;
		},
		
		updateVisual : function()
		{
			console.log('	update visual')
			console.log(this)
			var center = new google.maps.LatLng( this.model.get('attr').lat, this.model.get('attr').lng);
			
			//this.map.setMapTypeId( this.model.get('attr').mapType.toUpperCase() );
			
			if( this.model.get('attr').type == "streetview" )
			{
				this.map.getStreetView().setVisible( true );
				
				var pov = {
						'heading' : this.model.get('attr').heading,
						'pitch' : this.model.get('attr').pitch,
						'zoom' : this.model.get('attr').streetZoom,
						}
				this.map.getStreetView().setPosition( center );
				this.map.getStreetView().setPov( pov );
				this.map.getStreetView().setVisible( true );
			}
			else
			{
				this.map.getStreetView().setVisible( false );
				this.map.setCenter(center)
				this.map.setZoom( this.model.get('attr').zoom )
			}
			
		},
		
		onLayerEnter : function()
		{
			
			console.log('geo layer enter')
			if( !this.isLoaded )
			{
				var center = new google.maps.LatLng( this.model.get('attr').lat, this.model.get('attr').lng);

				//var gMapType = google.maps.MapTypeId[ this.model.get('attr').mapType.toUpperCase() ];

				var mapOptions = {
					zoom : this.model.get('attr').zoom,
					center : center,
					mapTypeId : google.maps.MapTypeId[ this.model.get('attr').mapType.toUpperCase() ],
				
					disableDefaultUI : true,
					draggable : false
				};
				this.map = new google.maps.Map( $(this.el).find('#gmap-'+this.model.id)[0], mapOptions);
			
				if( this.model.get('attr').type == "streetview" )
				{
					var pov = {
							'heading' : this.model.get('attr').heading,
							'pitch' : this.model.get('attr').pitch,
							'zoom' : this.model.get('attr').streetZoom,
							}
					this.map.getStreetView().setPosition( center );
					this.map.getStreetView().setPov( pov );
					this.map.getStreetView().setVisible( true );
				}
				
				this.isLoaded = true;
			}
		},
		
		onPreload : function()
		{
			if( !this.isLoaded )
			{
				var center = new google.maps.LatLng( this.model.get('attr').lat, this.model.get('attr').lng);

				//var gMapType = google.maps.MapTypeId[ this.model.get('attr').mapType.toUpperCase() ];

				var mapOptions = {
					zoom : this.model.get('attr').zoom,
					center : center,
					mapTypeId : google.maps.MapTypeId[ this.model.get('attr').mapType.toUpperCase() ],
				
					disableDefaultUI : true,
					draggable : false
				};
				this.map = new google.maps.Map( $(this.el).find('#gmap-'+this.model.id)[0], mapOptions);
			
				if( this.model.get('attr').type == "streetview" )
				{
					var pov = {
							'heading' : this.model.get('attr').heading,
							'pitch' : this.model.get('attr').pitch,
							'zoom' : this.model.get('attr').streetZoom,
							}
					this.map.getStreetView().setPosition( center );
					this.map.getStreetView().setPov( pov );
					this.map.getStreetView().setVisible( true );
				}
				
				this.isLoaded = true;
			}
			
			this.model.trigger('ready', this.model.id)
		}
		
	});

})(zeega.module("layer"));
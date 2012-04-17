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
			
			'url' : '',
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
			
			var leftSlider = new Layer.Views.Lib.Slider({
				property : 'left',
				model: this.model,
				label : 'Horizontal Position',
				suffix : '%',
				min : 0,
				max : 100,
			});
			var topSlider = new Layer.Views.Lib.Slider({
				property : 'top',
				model: this.model,
				label : 'Vertical Position',
				suffix : '%',
				min : 0,
				max : 100,
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
				.append( leftSlider.getControl() )
				.append( topSlider.getControl() )
				.append( opacitySlider.getControl() );
			
			return this;
		
		}
		
	});

	Layer.Views.Visual.Geo = Layer.Views.Visual.extend({
		
		draggable : false,
		linkable : true,
		
		init : function()
		{
			console.log('	GEO INIT')
			this.model.on('change', this.updateVisual, this)
		},
		
		render : function()
		{
			
			var map = $('<div class="gmap-container">')
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
			var pov = {
					'heading' : this.model.get('attr').heading,
					'pitch' : this.model.get('attr').pitch,
					'zoom' : this.model.get('attr').streetZoom,
			}
			
			this.streetview.setPosition( center );
			this.streetview.setPov( pov );
			
		},
		
		onLayerEnter : function()
		{
			
			console.log('geo layer enter')
			if( !this.isLoaded )
			{
				var center = new google.maps.LatLng( this.model.get('attr').lat, this.model.get('attr').lng);

				var mapOptions = {
					
					addressControl : false,
					addressControlOptions : false,
					clickToGo : true,
					disableDoubleClickZoom : false,
					enableCloseButton : false,
					imageDateControl : false,
					linksControl : false,
					panControl : true,
					panControlOptions : true,
					//pano : '',
					position : center,
					visible :true,
					zoomControl :true,
					zoomControlOptions :true,
					
					pov : {
							'heading' : this.model.get('attr').heading,
							'pitch' : this.model.get('attr').pitch,
							'zoom' : this.model.get('attr').streetZoom,
					}
					
				};
				
				this.streetview = new google.maps.StreetViewPanorama( $(this.el).find('.gmap-container')[0], mapOptions);

				
				this.isLoaded = true;
			}
		},
		
		onLayerExit : function()
		{
			//this destroys the map every time the frame is changed. there is probably a better way to do this
			this.map = {};
			$(this.el).find('.gmap-container').hide();
			this.isLoaded = false;
		},
		
		onPreload : function()
		{
			if( !this.isLoaded )
			{
				var center = new google.maps.LatLng( this.model.get('attr').lat, this.model.get('attr').lng);

				var mapOptions = {
					
					addressControl : false,
					addressControlOptions : false,
					clickToGo : true,
					disableDoubleClickZoom : false,
					enableCloseButton : false,
					imageDateControl : false,
					linksControl : false,
					panControl : true,
					panControlOptions : true,
					//pano : '',
					position : center,
					visible :true,
					zoomControl :true,
					zoomControlOptions :true,
					
					pov : {
							'heading' : this.model.get('attr').heading,
							'pitch' : this.model.get('attr').pitch,
							'zoom' : this.model.get('attr').streetZoom,
					}
					
				};
				
				//console.log($(this.el).find($(this.el).find('.gmap-container')[0]);
				this.streetview = {}
				this.streetview = new google.maps.StreetViewPanorama( $(this.el).find('.gmap-container')[0], mapOptions);
				
				this.isLoaded = true;
			}
			
			this.model.trigger('ready', this.model.id)
		}
		
	});

})(zeega.module("layer"));
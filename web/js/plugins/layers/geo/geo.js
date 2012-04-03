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

/*
var GeoLayer = ProtoLayer.extend({


	layerType : 'visual',
	draggable : true,
	linkable : true,

	defaultAttributes: {
		type : 'map',
		title : 'Map Layer',
		left : 0, //x,y,w,h are in percentages
		top : 0,
		height : 100, 
		width : 100, 
		opacity : 1,
		lat : 42.3735626,
		lng : -71.1189639,
		zoom : 10,
		streetZoom : 1,
		heading : 0,
		pitch : 0,
		mapType : 'satellite',
	},


	controls : function()
	{
		var opacityArgs = {
			max : 1,
			label : 'Opacity',
			step : 0.01,
			property : 'opacity',
			value : this.model.get('attr').opacity,
			dom : this.layerControls,
			css : true
		};
		var opacitySlider = makeUISlider( opacityArgs );
		
		var widthArgs = {
			min : 1,
			max : 200,
			label : 'Width',
			step : 1,
			property : 'width',
			suffix : '%',
			value : this.model.get('attr').width,
			dom : this.layerControls,
			css : true
		};
		var widthSlider = makeUISlider( widthArgs );
		
		var heightArgs = {
			min : 1,
			max : 200,
			label : 'Height',
			step : 1,
			property : 'height',
			suffix : '%',
			value : this.model.get('attr').height,
			dom : this.layerControls,
			css : true
		};
		var heightSlider = makeUISlider( heightArgs );
		
		this.layerControls
			.append( widthSlider )
			.append( heightSlider )
			.append( opacitySlider )
			.append( makeGoogleMapTarget( this.model.id ) )
			.append( makeFullscreenButton( this.layerControls ) );
	},

	onControlsOpen : function()
	{
		if( !this.editorLoaded )
		{
			var mapSettings = 
			{
				searchBar : true,
				controls : this.layerControls,
				visual : this.visualEditorElement,
				id : this.model.id
			};
		
			this.layerControls.find('.google-map-wrapper').append( makeGoogleMap( _.extend( mapSettings , this.attr ) ) );
		}
		this.editorLoaded = true;

	},

	visual : function()
	{
		var _this = this;

		var cssObj = {
			'position' : 'absolute',
			'top' : this.attr.top+"%",
			'left' : this.attr.left+"%",
			'width' : this.attr.width+"%",
			'height' : this.attr.height+"%",
			'opacity' : this.attr.opacity
		};
		var img = $('<img>')
			.css({'width':'100%','height':'100%'});


		//Pull static map image using google api
		if( this.attr.type == 'map' )
		{

			var w = 6 * parseInt( this.attr.width );
			var h = 4 * parseInt( this.attr.height );
			img.attr('src',"http://maps.googleapis.com/maps/api/staticmap?center="+this.attr.lat+","+this.attr.lng+"&zoom="+this.attr.zoom+"&size="+w+"x"+h+"&maptype="+this.attr.mapType+"&sensor=false");

		}else{
			console.log('streetview')

			var centerLatLng = new google.maps.LatLng(this.attr.lat, this.attr.lng);

			var service = new google.maps.StreetViewService();
			service.getPanoramaByLocation(centerLatLng,50,function(data,status){
				_this.model.get('attr').panoId = data.location.pano;
				var x = 2;
				var y = 1;
				if( _this.attr.pitch > 25 ) y=0;
				else if( _this.attr.pitch < -25 ) y=2;
				x = (Math.floor((_this.attr.heading+360)/60)) % 6;

				var w = 6*parseInt(_this.attr.width);
				var h = 4*parseInt(_this.attr.height);

				img.attr('src','http://maps.googleapis.com/maps/api/streetview?size='+w+'x'+h+'&fov='+180 / Math.pow(2,_this.attr.streetZoom)+'&location='+_this.attr.lat+','+_this.attr.lng+'&heading='+_this.attr.heading+'&pitch='+_this.attr.pitch+'&sensor=false');
			});
		}
		
		this.visualEditorElement
			.css( cssObj )
			.append( img );
		
	},
	
	thumb : function()
	{
		var _this  = this;

		

		//Create static map object and attach to workspace
		
		var img = $('<img>').css({'width':'100%'}).attr({'id':'layer-image-'+this.model.id});
		
		
		//Pull static map image using google api
		
		if( this.attr.type == 'map' )
		{
			var w = 6 * parseInt( this.attr.width );
			var h = 4 * parseInt( this.attr.height );
			img.attr('src',"http://maps.googleapis.com/maps/api/staticmap?center="+this.attr.lat+","+this.attr.lng+"&zoom="+this.attr.zoom+"&size="+w+"x"+h+"&maptype="+this.attr.mapType+"&sensor=false");
		
		}else{
		
			var centerLatLng = new google.maps.LatLng(this.attr.lat, this.attr.lng);

			var service=new google.maps.StreetViewService();
			service.getPanoramaByLocation(centerLatLng,50,function(data,status){
				_this.attr.panoId=data.location.pano;
				var x = 2;
				var y = 1;
				if(_this.attr.pitch>25) y=0;
				else if(_this.attr.pitch<-25) y=2;
				x=(Math.floor((_this.attr.heading+360)/60))%6;
				
				var w = 6*parseInt(_this.attr.width);
				var h = 4*parseInt(_this.attr.height);
				
				img.attr('src','http://maps.googleapis.com/maps/api/streetview?size='+w+'x'+h+'&fov='+180 / Math.pow(2,_this.attr.streetZoom)+'&location='+_this.attr.lat+','+_this.attr.lng+'&heading='+_this.attr.heading+'&pitch='+_this.attr.pitch+'&sensor=false');
			});
		}
		
		
		this.thumbnail.append(img);
	},

	preload : function( target )
	{
		
		var _this = this;

		var cssObj = {
			'position' : 'absolute',
			'top' : '-1000%',
			'left' : '-1000%',
			'width' : this.attr.width+"%",
			'height' : this.attr.height+"%",
			'opacity' : this.attr.opacity
		};
		var img = $('<img>')
			.css({'width':'100%','height':'100%'});


		//Pull static map image using google api
		if( this.attr.type == 'map' )
		{

			var w = 6 * parseInt( this.attr.width );
			var h = 4 * parseInt( this.attr.height );
			img.attr('src',"http://maps.googleapis.com/maps/api/staticmap?center="+this.attr.lat+","+this.attr.lng+"&zoom="+this.attr.zoom+"&size="+w+"x"+h+"&maptype="+this.attr.mapType+"&sensor=false");

		}else{
			console.log('streetview')

			var centerLatLng = new google.maps.LatLng(this.attr.lat, this.attr.lng);

			var service = new google.maps.StreetViewService();
			service.getPanoramaByLocation(centerLatLng,50,function(data,status){
				_this.model.attr.panoId = data.location.pano;
				var x = 2;
				var y = 1;
				if( _this.attr.pitch > 25 ) y=0;
				else if( _this.attr.pitch < -25 ) y=2;
				x = (Math.floor((_this.attr.heading+360)/60)) % 6;

				var w = 6*parseInt(_this.attr.width);
				var h = 4*parseInt(_this.attr.height);

				img.attr('src','http://maps.googleapis.com/maps/api/streetview?size='+w+'x'+h+'&fov='+180 / Math.pow(2,_this.attr.streetZoom)+'&location='+_this.attr.lat+','+_this.attr.lng+'&heading='+_this.attr.heading+'&pitch='+_this.attr.pitch+'&sensor=false');
			});
		}
		
		this.display
			.css( cssObj )
			.append( img );
			
		target.trigger( 'ready' , { 'id' : this.model.id } );
	},
		
	play : function( z )
	{
		this.display.css({'z-index':z,'top':this.attr.top+"%",'left':this.attr.left+"%"});
	},

	stash : function()
	{
		this.display.css({'top':"-1000%",'left':"-1000%"});
	},
	

	
	
});
*/

/************************************

	GEO LAYER CHILD CLASS





TODO


	
	Features:
		-Get more accurate pano tile
		-Allow static/interactive choice for maps/streetview


************************************/

var GeoLayer = ProtoLayer.extend({


	layerType : 'visual',
	draggable : true,

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
		var mapSettings = {
			searchBar : true,
			
			controls : this.layerControls,
			visual : this.visualEditorElement,
			id : this.model.id
		};
		
		this.layerControls.find('.google-map-wrapper').append( makeGoogleMap( _.extend( mapSettings , this.attr ) ) );
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

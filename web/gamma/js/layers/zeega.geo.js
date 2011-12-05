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
		x : 0, //x,y,w,h are in percentages
		y : 0,
		h : 100, 
		w : 100, 
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

	},

	onControlsClose : function()
	{

	},
	
	visual : function()
	{
		
		var _this = this;
		_this.editorLoaded = false;

		var img = $('<img>')
			.css({'width':'100%'});


		//Pull static map image using google api
		if( this.attr.type == 'map' )
		{
			console.log('map')
			var w = 6 * parseInt( this.attr.w );
			var h = 4 * parseInt( this.attr.h );
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

				var w = 6*parseInt(_this.attr.w);
				var h = 4*parseInt(_this.attr.h);

				img.attr('src','http://maps.googleapis.com/maps/api/streetview?size='+w+'x'+h+'&fov='+180 / Math.pow(2,_this.attr.streetZoom)+'&location='+_this.attr.lat+','+_this.attr.lng+'&heading='+_this.attr.heading+'&pitch='+_this.attr.pitch+'&sensor=false');
			});
		}
		
		this.visualEditorElement.append(img);
		
	},
	
	drawThumb : function()
	{
		var _this  = this;
		console.log('drawing geo preview');
		
		//Create dom element
		this.editorLoaded=false;
		var div = $('<div>');
		var cssObj = {
			'position' : 'absolute',
			'top' : this.attr.y+"%",
			'left' : this.attr.x+"%",
			'z-index' : this.zIndex,
			'width' : this.attr.w+"%",
			'height' : this.attr.h+"%",
			'opacity' : this.attr.opacity
		};
		
		console.log(cssObj);
		
		div.css(cssObj);
			
		
	
		
		
		//Create static map object and attach to workspace
		
		var img = $('<img>').css({'width':'100%'}).attr({'id':'layer-image-'+this.model.id});
		
		
		div.append(img);
		$('#preview-media').append(div);
		
		//Pull static map image using google api
		
		if(this.attr.type=='map'){
			var w=6*parseInt(this.attr.w);
			var h=4*parseInt(this.attr.h);
			$('#layer-image-'+this.model.id).attr('src',"http://maps.googleapis.com/maps/api/staticmap?center="+this.attr.lat+","+this.attr.lng+"&zoom="+this.attr.zoom+"&size="+w+"x"+h+"&maptype="+this.attr.mapType+"&sensor=false");
		
		}
		else{
		
			var centerLatLng = new google.maps.LatLng(this.attr.lat, this.attr.lng);

			var service=new google.maps.StreetViewService();
			service.getPanoramaByLocation(centerLatLng,50,function(data,status){
				_this.attr.panoId=data.location.pano;
				var x=2;
				var y=1;
				if(_this.attr.pitch>25) y=0;
				else if(_this.attr.pitch<-25) y=2;
				x=(Math.floor((_this.attr.heading+360)/60))%6;
				
				var w = 6*parseInt(_this.attr.w);
				var h = 4*parseInt(_this.attr.h);
				
				console.log('load moment');
				console.log(_this);
				$('#layer-image-'+_this.model.id).attr('src','http://maps.googleapis.com/maps/api/streetview?size='+w+'x'+h+'&fov='+180 / Math.pow(2,_this.attr.streetZoom)+'&location='+_this.attr.lat+','+_this.attr.lng+'&heading='+_this.attr.heading+'&pitch='+_this.attr.pitch+'&sensor=false');
			});
		}
		
		
	},
		
	onAttributeUpdate : function()
	{
		/*
		var newAttr = {
			x : Math.floor( this.visualEditorElement.position().left / 6.0),
			y : Math.floor( this.visualEditorElement.position().top / 4.0),
			w : Math.floor( this.layerControls.find('#width-slider').slider('value') ),
			h : Math.floor( this.layerControls.find('#height-slider').slider('value') ),
			opacity : Math.floor( this.layerControls.find('#opacity-slider').slider('value') * 100 )/100
		};
		
		if( !_.isUndefined(this.streetView) && this.streetView.getVisible() )
		{
			console.log('setting as streetview')
			var latlng = this.streetView.getPosition();
			var pov=this.streetView.getPov();

			newAttr.type = 'streetview'
			newAttr.lat = latlng.lat();
			newAttr.lng = latlng.lng();
			newAttr.heading=pov.heading;
			newAttr.pitch=pov.pitch;
			newAttr.streetZoom=Math.floor(pov.zoom);
			if( this.streetView.getPano() ) newAttr.panoId = this.streetView.getPano();
			
		}else if( !_.isUndefined(this.map) ){
			console.log('setting as map');
			var latlng = this.map.getCenter();

			newAttr.type='map';
			newAttr.lat = latlng.lat();
			newAttr.lng = latlng.lng();
			newAttr.zoom = this.map.getZoom();
			newAttr.mapType = this.map.getMapTypeId();
		}


		this.setAttributes(newAttr);


		//update the dom map/streetview image
		if( this.attr.type == 'map' )
		{
			$('#layer-image-'+this.model.id).attr('src',"http://maps.googleapis.com/maps/api/staticmap?center="+this.attr.lat+","+this.attr.lng+"&zoom="+this.attr.zoom+"&size="+$('#layer-preview-'+this.model.id).width()+"x"+$('#layer-preview-'+this.model.id).height()+"&maptype="+this.attr.mapType+"&sensor=false");
		}else{
			console.log('http://maps.googleapis.com/maps/api/streetview?size=600x400&fov='+180 / Math.pow(2,this.attr.streetZoom)+'&location='+this.attr.lat+','+this.attr.lng+'&heading='+this.attr.heading+'&pitch='+this.attr.pitch+'&sensor=false');
			$('#layer-image-'+this.model.id).attr('src','http://maps.googleapis.com/maps/api/streetview?size=600x400&fov='+180 / Math.pow(2,this.attr.streetZoom)+'&location='+this.attr.lat+','+this.attr.lng+'&heading='+this.attr.heading+'&pitch='+this.attr.pitch+'&sensor=false');
		}


		this.save();
		*/

	},

	preload : function()
	{
		/**************** NEEDS UPGRADING *******************/
		
		//make dom object
		//maybe these should all be wrapped in divs?
		var div = $('<div>');

		var cssObj = {
			'position' : 'absolute',
			'top' : '-100%',
			'left' : '-100%',
			'z-index' : this.zIndex,
			'width' : this.attr.w+'%',
			'opacity' : this.attr.opacity
		};

		div.css(cssObj);

		$(div).attr('data-layer',this.model.id);

		var img=$('<img>')
			.attr({'src':this.attr.url,'id':'layer-image-'+this.model.id})
			.css({'width':'100%'});

		this.dom = div;

		//make dom
		$(this.dom).append(img);
		//add to dom

		$('#zeega-player').find('#preview-media')
			.append(this.dom)
			.trigger('ready',{'id':this.model.id});
		
	},
		
	play : function( z )
	{
		console.log('geo player.play');
		this.dom.css({'z-index':z,'top':this.attr.y+"%",'left':this.attr.x+"%"});
	},
	
	pause : function()
	{
		// not needed
	},
	
	stash : function()
	{
		console.log('image player.stash');
		this.dom.css({'top':"-100%",'left':"-100%"});
	},
	

	
	
});

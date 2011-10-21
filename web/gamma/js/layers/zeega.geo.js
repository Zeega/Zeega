/************************************

	GEO LAYER CHILD CLASS





TODO


	
	Features:
		-Get more accurate pano tile
		-Allow static/interactive choice for maps/streetview









************************************/








var GeoLayer = ProtoLayer.extend({

	defaultAttributes: {
		
				type:'map',
				title:'Map Layer',
				x:0, //x,y,w,h are in percentages
				y:0,
				h:100, 
				w:100, 
				opacity:1,
				lat:42.3735626,
 				lng:-71.1189639,
 				zoom:10,
 				streetZoom:1,
 				heading:0,
 				pitch:0,
				mapType:'satellite',
			},

	drawControls : function(template){
		var opacityArgs = {
			min:0,
			max:1,
			value:this.attr.opacity,
			step:0.01,
			layer_id:this.model.id,
			label:'Opacity',
			css: 'opacity',
			suffix: '',
		};
		var widthArgs = {
			min:0,
			max:100,
			value:this.attr.w,
			step:1,
			layer_id:this.model.id,
			label:'Width',
			css: 'width',
			suffix: '%',
		};
		var heightArgs = {
			min:0,
			max:100,
			value:this.attr.h,
			step:1,
			layer_id:this.model.id,
			label:'Height',
			css: 'height',
			suffix: '%',
		};

		//Load Sliders + Button
		
		template.find('#controls').append( makeCSSLayerSlider(widthArgs) );
		template.find('#controls').append( makeCSSLayerSlider(heightArgs) );
		template.find('#controls').append( makeCSSLayerSlider(opacityArgs) );
		template.find('#controls').append( makeFullscreenButton());
		//need this to be accessable inside the event functions
		var that  = this;
		template.find('#controls').find('.layer-slider').bind( "slidestop", function(event, ui) { that.updateAttr(); });
		template.find('#controls').find('.fullscreen-submit').click(function(){
			$('#layer-preview-'+that.model.id ).css( {'top':'0px','left':'0px','width':'100%','height':'100%'});
			$('#layer-edit-'+that.model.id).find('#Width-slider').slider('value',100);
			$('#layer-edit-'+that.model.id).find('#Height-slider').slider('value',100);
			that.updateAttr();
		});
		
		//Load map ui
		template.find('#controls').append( $('<div>').attr({'id' : 'map-'+this.model.id}).css( {'width' : "350px", 'height' : "200px"}));
		template.find('#controls').append( $('<input>').attr({'id' : 'map-search-'+this.model.id,'type':'text'}));
		template.find('#controls').append( $('<input>').attr({'id' : 'map-submit-'+this.model.id,'type':'submit'}));

		//change icon on layer template
		template.find('.asset-type-icon').removeClass('ui-icon-pin-w');
		template.find('.asset-type-icon').addClass('ui-icon-flag');
		
		
	},
	
	preloadMedia : function(){
		
		console.log('map drawPublish');
		//Create dom element
		this.editorLoaded=false;
		var div = $('<div>');
		var cssObj = {
			'position' : 'absolute',
			'top' : '-100%',
			'left' : '-100%',
			'width' : this.attr.w+"%",
			'height' : this.attr.h+"%",
			'opacity' : this.attr.opacity
		};
		
		
		div.addClass('media editable draggable')
			.attr({
				'id' : 'layer-preview-'+this.model.id,
				'data-layer-id' : this.model.id
			})
			.css(cssObj);
			
		var that  = this;
	
		
		//Create static map object and attach to workspace
		
		var img = $('<img>').css({'width':'100%'}).attr({'id':'layer-image-'+this.model.id});
		
		this.dom = div;
		
		//Pull static map image using google api
		
		if(this.attr.type=='map'){
			var w=Math.floor(7.20*this.attr.w);
			var h=Math.floor(4.80*this.attr.h);
			img.attr('src',"http://maps.googleapis.com/maps/api/staticmap?center="+this.attr.lat+","+this.attr.lng+"&zoom="+this.attr.zoom+"&size="+w+"x"+h+"&maptype="+this.attr.mapType+"&sensor=false");
		
		}else{
		
			var centerLatLng=new google.maps.LatLng(this.attr.lat, this.attr.lng);
			var service=new google.maps.StreetViewService();
			service.getPanoramaByLocation(centerLatLng,50,function(data,status){
				that.attr.panoId=data.location.pano;
				var x=2;
				var y=1;
				if(that.attr.pitch>25) y=0;
				else if(that.attr.pitch<-25) y=2;
				x=(Math.floor((that.attr.heading+360)/60))%6;
				console.log('load moment');
				img.attr('src','http://cbk0.google.com/cbk?output=tile&panoid='+that.attr.panoId+'&x='+x+'&y='+y+'&zoom=3');
			});
		}
		
		div.append(img);
		$('#zeega-player').append(this.dom).trigger('ready',{'id':this._id});

		

	},
	
	drawPublish : function(z){
		this.dom.css({'z-index':z,'top':this.attr.y+'%','left':this.attr.x+'%'});
	},
	
	drawPreview : function(){
		
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
		
		
		div.addClass('media editable draggable')
			.attr({
				'id' : 'layer-preview-'+this.model.id,
				'data-layer-id' : this.model.id
			})
			.css(cssObj);
			
		var that  = this;
		
		div.draggable({
			stop : function(){
				
				//Update x,y attributes
				
				that.attr.x=$(this).css('left');
				that.attr.y=$(this).css('top');
				
				//save the layer to the database
				that.saveLayer();
			}
		});
		
		
		
		//Create static map object and attach to workspace
		
		var img = $('<img>').css({'width':'100%'}).attr({'id':'layer-image-'+this.model.id});
		
		this.dom = div;
		div.append(img);
		$('#workspace').append(this.dom);
		
		//Pull static map image using google api
		
		if(this.attr.type=='map'){
			var w=Math.floor(7.20*this.attr.w);
			var h=Math.floor(4.80*this.attr.h);
			$('#layer-image-'+this.model.id).attr('src',"http://maps.googleapis.com/maps/api/staticmap?center="+this.attr.lat+","+this.attr.lng+"&zoom="+this.attr.zoom+"&size="+w+"x"+h+"&maptype="+this.attr.mapType+"&sensor=false");
		
		}
		else{
		
			var centerLatLng=new google.maps.LatLng(this.attr.lat, this.attr.lng);
			var service=new google.maps.StreetViewService();
			service.getPanoramaByLocation(centerLatLng,50,function(data,status){
				that.attr.panoId=data.location.pano;
				var x=2;
				var y=1;
				if(that.attr.pitch>25) y=0;
				else if(that.attr.pitch<-25) y=2;
				x=(Math.floor((that.attr.heading+360)/60))%6;
				console.log('load moment');
				$('#layer-image-'+that.model.id).attr('src','http://cbk0.google.com/cbk?output=tile&panoid='+that.attr.panoId+'&x='+x+'&y='+y+'&zoom=3');
			});
		}
		
		
	},
	
	
	openControls: function(){
	
		//Load map/streetview into template controls 
		
		if(!this.editorLoaded)
		{
			
			// throws error: 'google is not defined'
			var centerLatLng = new google.maps.LatLng(this.attr.lat, this.attr.lng);
			var tempType=this.attr.mapType.toUpperCase();
			
			
			
			
			eval( 'var mapType = google.maps.MapTypeId.'+tempType+';' );
		
			var mapOptions = {
				zoom: this.attr.zoom,
				center: centerLatLng,
				mapTypeId: mapType,
				disableDoubleClickZoom: true,
			
			};
		
			this.map = new google.maps.Map(document.getElementById('map-'+this.model.id), mapOptions);
	
			this.streetView=this.map.getStreetView();
			this.geocoder = new google.maps.Geocoder();
		
			// Check if streetView
		
			if(this.attr.type=="streetview")
			{
				var pov={
						heading:this.attr.heading,
						pitch:this.attr.pitch,
						zoom:this.attr.streetZoom,
						}
				this.streetView.setPosition(centerLatLng);
				this.streetView.setPov(pov);
				this.streetView.setVisible(true);
		
			}
		
			// Add event listeners
			var that=this;
		
			google.maps.event.addListener(this.streetView, 'pov_changed', function() { that.updateAttr();});
			google.maps.event.addListener(this.streetView, 'visible_changed', function() { that.updateAttr();});
			google.maps.event.addListener(this.map, 'zoom_changed', function() { that.updateAttr(); });
			google.maps.event.addListener(this.map, 'center_changed', function() { that.updateAttr(); });
			google.maps.event.addListener(this.map, 'maptypeid_changed', function() { that.updateAttr(); });
		
		
		
			// Activate search field
		
			$('#map-submit-'+this.model.id).click(function(){
				that.geocoder.geocode( { 'address': $('#map-search-'+that.model.id).val()}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						if(that.streetView.getVisible()) that.streetView.setVisible(false);
						var mLatlng=results[0].geometry.location;
						that.map.setCenter(mLatlng);
					}
					else alert("Geocoder failed at address look for "+$('#map-search-'+that.model.id).val()+": " + status);
				});
			});
	
			$('#map-search-'+this.model.id).keypress(function(event){
				if ( event.which == 13 )
				{
					event.preventDefault();
					that.geocoder.geocode( { 'address': $('#map-search-'+that.model.id).val()}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK)
					{
						if(that.streetView.getVisible()) that.streetView.setVisible(false);
						var mLatlng=results[0].geometry.location;
						that.map.setCenter(mLatlng);
					}
					else alert("Geocoder failed at address look for "+$('#map-search-'+that.model.id).val()+": " + status);
				});
			   }
			});
			this.editorLoaded=true;
		}
	},
	
	updateAttr: function(){
		
		//get a copy of the old attributes into a variable
		var newAttr = this.attr;
			
		//set the new dom attributes
		
		newAttr.x = Math.floor( this.dom.position().left/6);
		newAttr.y = Math.floor( this.dom.position().top/4);
		newAttr.opacity = $('#layer-edit-'+this.model.id).find('#Opacity-slider').slider('value');
		newAttr.w = $('#layer-edit-'+this.model.id).find('#Width-slider').slider('value');
		newAttr.h = $('#layer-edit-'+this.model.id).find('#Height-slider').slider('value');
		
		//check if map or streetview
		
		if(this.streetView.getVisible()){
		
			newAttr.type='streetview';
			
			var latlng=this.streetView.getPosition();
			newAttr.lat=latlng.lat();
			newAttr.lng=latlng.lng();
			
			var pov=this.streetView.getPov();
			newAttr.heading=pov.heading;
			newAttr.pitch=pov.pitch;
			newAttr.streetZoom=Math.floor(pov.zoom);
			if(this.streetView.getPano()){
			newAttr.panoId=this.streetView.getPano();
			}
		}
		else{
		
			newAttr.type='map';
			
			var latlng=this.map.getCenter();
			newAttr.lat=latlng.lat();
			newAttr.lng=latlng.lng();
			newAttr.zoom=this.map.getZoom();
			newAttr.mapType=this.map.getMapTypeId();
		
		
		}
		
		
		//set the attributes into the layer
		this.updateLayerAttr(newAttr);
		
		//save the layer back to the database
		this.saveLayer();
		
		//update the dom map/streetview image
		if(this.attr.type=='map'){
			$('#layer-image-'+this.model.id).attr('src',"http://maps.googleapis.com/maps/api/staticmap?center="+this.attr.lat+","+this.attr.lng+"&zoom="+this.attr.zoom+"&size="+$('#layer-preview-'+this.model.id).width()+"x"+$('#layer-preview-'+this.model.id).height()+"&maptype="+this.attr.mapType+"&sensor=false");
		}
		else{
		
		
			//Sloppy attempt to pull corresponding streetview static tile
			
			var x=2;
			var y=1;
			if(newAttr.pitch>25) y=0;
			else if(newAttr.pitch<-25) y=2;
			x=(Math.floor((newAttr.heading+360)/60))%6;
			
			/*****  This returns tile data, should be able to infer from heading info appropriate tile to retrieve 
			
			var service=new google.maps.StreetViewService();
			service.getPanoramaById(this.streetView.getPano(),function(data,status){
			console.log(data.tiles.centerHeading);
			});
			
			*/
			
			console.log('save moment');
			$('#layer-image-'+this.model.id).attr('src','http://cbk0.google.com/cbk?output=tile&panoid='+this.attr.panoId+'&x='+x+'&y='+y+'&zoom=3');
		
		}
		
		
		
		
		
	
	}
	
	
});


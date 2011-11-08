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

	controls : {
		
		draw : function()
		{
			var _this  = this.parent;
			var controls = $('<div>');

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
			controls.append( makeCSSLayerSlider(widthArgs) );
			controls.append( makeCSSLayerSlider(heightArgs) );
			controls.append( makeCSSLayerSlider(opacityArgs) );
			controls.append( makeFullscreenButton());
			
			controls.find('.layer-slider').bind( "slidestop", function(event, ui) { _this.editor.onAttributeUpdate() });
			controls.find('.fullscreen-submit').click(function(){
				$('#layer-preview-'+_this.model.id ).css( {'top':'0px','left':'0px','width':'100%','height':'100%'});
				$('#layer-edit-'+_this.model.id).find('#Width-slider').slider('value',100);
				$('#layer-edit-'+_this.model.id).find('#Height-slider').slider('value',100);
				_this.editor.onAttributeUpdate() ;
			});

			//Load map ui
			controls.append( $('<div>').attr({'id' : 'map-'+this.model.id}).css( {'width' : "350px", 'height' : "200px"}));
			controls.append( $('<input>').attr({'id' : 'map-search-'+this.model.id,'type':'text'}));
			controls.append( $('<input>').attr({'id' : 'map-submit-'+this.model.id,'type':'submit'}));
			
			return(controls);
		},

	}, // controls
	
	editor : {
				
		visual : {
			
			draw : function()
			{
				var _this = this.parent;
				var el = $('<div>');

				//Create dom element
				_this.editorLoaded = false;
				
				//var div = $('<div>');

				//Create static map object and attach to workspace

				var img = $('<img>').css({'width':'100%'}).attr({'id':'layer-image-'+this.model.id});

				el.append(img);

				//Pull static map image using google api

				if( this.attr.type == 'map' )
				{
					var w = 6 * parseInt( this.attr.w );
					var h = 4 * parseInt( this.attr.h );
					img.attr('src',"http://maps.googleapis.com/maps/api/staticmap?center="+this.attr.lat+","+this.attr.lng+"&zoom="+this.attr.zoom+"&size="+w+"x"+h+"&maptype="+this.attr.mapType+"&sensor=false");

				}else{

					var centerLatLng = new google.maps.LatLng(this.attr.lat, this.attr.lng);

					var service = new google.maps.StreetViewService();
					service.getPanoramaByLocation(centerLatLng,50,function(data,status){
						_this.model.get('attr').panoId = data.location.pano;
						var x=2;
						var y=1;
						if(_this.attr.pitch>25) y=0;
						else if(_this.attr.pitch<-25) y=2;
						x = (Math.floor((_this.attr.heading+360)/60)) % 6;

						var w = 6*parseInt(_this.attr.w);
						var h = 4*parseInt(_this.attr.h);

						img.attr('src','http://maps.googleapis.com/maps/api/streetview?size='+w+'x'+h+'&fov='+180 / Math.pow(2,_this.attr.streetZoom)+'&location='+_this.attr.lat+','+_this.attr.lng+'&heading='+_this.attr.heading+'&pitch='+_this.attr.pitch+'&sensor=false');
					});
				}

				//add to dom
				_this.dom = el;
				return( el );
			
			}
		}, // visual
		
		onAttributeUpdate : function()
		{
			var _this = this.parent;
			var newAttr = {};
			
			if(this.streetView.getVisible())
			{
				newAttr.type = 'streetview'
				var latlng = this.streetView.getPosition();
				newAttr.lat = latlng.lat();
				newAttr.lng = latlng.lng();
				var pov=this.streetView.getPov();
				newAttr.heading=pov.heading;
				newAttr.pitch=pov.pitch;
				newAttr.streetZoom=Math.floor(pov.zoom);
				if( this.streetView.getPano() ) newAttr.panoId = this.streetView.getPano();
				
			}else{
				newAttr.type='map';
				var latlng = this.map.getCenter();
				newAttr.lat = latlng.lat();
				newAttr.lng = latlng.lng();
				newAttr.zoom=this.map.getZoom();
				newAttr.mapType=this.map.getMapTypeId();
			}

			newAttr.x = Math.floor( this.dom.position().left / 6.0),
			newAttr.y = Math.floor( this.dom.position().top / 4.0),
			newAttr.opacity = this.dom.find('#Opacity-slider').slider('value'),
			newAttr.w = this.dom.find('#Width-slider').slider('value'),
			newAttr.h = this.dom.find('#Height-slider').slider('value')


/*
			//update the dom map/streetview image
			if(this.attr.type=='map')
			{
				$('#layer-image-'+this.model.id).attr('src',"http://maps.googleapis.com/maps/api/staticmap?center="+this.attr.lat+","+this.attr.lng+"&zoom="+this.attr.zoom+"&size="+$('#layer-preview-'+this.model.id).width()+"x"+$('#layer-preview-'+this.model.id).height()+"&maptype="+this.attr.mapType+"&sensor=false");
			}else{
				console.log('save moment');
				$('#layer-image-'+this.model.id).attr('src','http://maps.googleapis.com/maps/api/streetview?size=600x400&fov='+180 / Math.pow(2,this.attr.streetZoom)+'&location='+this.attr.lat+','+this.attr.lng+'&heading='+this.attr.heading+'&pitch='+this.attr.pitch+'&sensor=false');
			}
*/

			_this.util.setAttributes(newAttr);
			_this.util.save();
		},

		
	}, // editor
	
	player : {
		
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
		
		play : function()
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
		
	} // player
	
	
	
});


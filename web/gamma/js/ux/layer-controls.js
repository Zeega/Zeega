/************************

	LAYER CONTROL TOOLBOX
	
	Functions that return standardized ui elements
	maybe these should be a jQuery plugin?????
	
*************************/

/**
	args = {
		min:n,
		max:n,
		value:n,
		step:n,
		layer_id:id,
		label:txt,
		css:property
	}
**/






function makeLayerSlider(args)
{
	var sliderDiv = $('<div>').addClass('layer-slider-div')
		.append( $("<h4>")
		.html(args.label) )
		.append( $('<div>')
		.attr({
			'id': args.label+'-slider',
			'data-layer-id': args.layer_id
		})
		.addClass('layer-slider'));
		
	sliderDiv.find('.layer-slider').slider({
		min : args.min,
		max : args.max,
		value : args.value,
		step : args.step,
		slide : function(e, ui){
			$('#layer-preview-'+args.layer_id ).css( args.css, ui.value);
		}
	});
	
	return sliderDiv;
}



function makeSlider(args)
{
	var sliderDiv = $('<div>').addClass('layer-slider-div')
		.append( $("<h4>").html(args.label) )
		.append( $('<div>').attr({
			'id': args.label+'-slider',
			'data-layer-id': args.layer_id
		}).addClass('layer-slider'));
		
	sliderDiv.find('.layer-slider').slider({
		min : args.min,
		max : args.max,
		value : args.value,
		step : args.step,
		slide : function(e, ui){
			$('#layer-preview-'+args.layer_id ).trigger('slide');
		}
	});
	
	return sliderDiv;
}


function makeCSSLayerSlider(args)
{
	
	var defaults = {
		min : 0,
		max : 100,
		step : 1,
	};
	
	args = _.defaults(args,defaults);
	
	var sliderDiv = $('<div>')
		.addClass('layer-slider-div')
		.append( $("<h4>")
		.html(args.label) )
		.append( $('<div>')
		.attr({
			'id': args.label+'-slider',
			'data-layer-id': args.layer_id
		})
		.addClass('layer-slider'));
		
	sliderDiv.find('.layer-slider').slider({
		min : args.min,
		max : args.max,
		value : args.value,
		step : args.step,
		slide : function(e, ui){
			if(args.css!='none'){
				$('#layer-preview-'+args.layer_id ).css( args.css, ui.value+args.suffix);
			}
		},
		stop : function(e,ui)
		{
			console.log(args.layerClass)
		}
	});
	
	return sliderDiv;
}


function textArea()
{
	var html = "<input type='textarea'>";

	
	return template;
}

function makeGoogleMapTarget( layerID )
{
	var target = $('<div>').addClass('google-map-wrapper');
	var map = $('<div>').addClass('map').attr({'id' : 'map-'+ layerID }).css( {'width' : "350px", 'height' : "233px"});
	target.append( map );
	return target;
}

function makeGoogleMap( args )
{
	var defaults = {
		type : 'map',
		streetView : true,
		searchBar : true,
		disableDoubleClickZoom : true,
		
		panControl: false,
		zoomControl: true,
		mapTypeControl: true,
		scaleControl: false,
		streetViewControl: true,
		overviewMapControl: false
	};
	
	_.defaults( args, defaults);

	//make center lat lng
	var center = new google.maps.LatLng( args.lat, args.lng);
	
	eval( 'var gMapType = google.maps.MapTypeId.'+ args.mapType.toUpperCase() );

	var mapOptions = {
		zoom : args.zoom,
		center : center,
		mapTypeId : gMapType,
		disableDoubleClickZoom : args.disableDoubleClickZoom,
		
		panControl: args.panControl,
		zoomControl: args.zoomControl,
		mapTypeControl: args.mapTypeControl,
		scaleControl: args.scaleControl,
		streetViewControl: args.streetView,
		overviewMapControl: args.overviewMapControl
	};
	var map = new google.maps.Map( args.controls.find( '.map' )[0], mapOptions);
	var streetView = map.getStreetView();
	
	//if streetview
	if( args.type == "streetview" )
	{
		var pov = {
				'heading' : args.heading,
				'pitch' : args.pitch,
				'zoom' : args.streetZoom,
				}
		streetView.setPosition( center );
		streetView.setPov( pov );
		streetView.setVisible( true );
	}
	
	google.maps.event.addListener( map , 'zoom_changed', function(){
		args.controls.trigger( 'update' , [{
			zoom : {
				property : 'zoom',
				value : map.getZoom(),
				css : false
			}
		}]);
		updateStaticMap( _.extend(args,{'zoom':map.getZoom()}) );
	});
	
	google.maps.event.addListener( map, 'idle', function(){
		var newCenter = map.getCenter();
		
		//save to the database
		args.controls.trigger( 'update' , [{
			lat : {
				property : 'lat',
				value : newCenter.lat(),
				css : false
			},
			lng : {
				property : 'lng',
				value : newCenter.lng(),
				css : false
			}
		}]);
		
		//update the visual editor element
		updateStaticMap( _.extend(args,{'lat':newCenter.lat(),'lng':newCenter.lng()}) );
	});
	
	google.maps.event.addListener(map, 'maptypeid_changed', function(){
		args.controls.trigger( 'update' , [{
			mapType : {
				property : 'mapType',
				value : '"'+ map.getMapTypeId() +'"',
				css : false
			}
		}]);
		updateStaticMap( _.extend(args,{'mapType': map.getMapTypeId()}) );
	});
	
	//called when switching between streetview and map view
	google.maps.event.addListener( streetView, 'visible_changed', function() {
		if( streetView.getVisible() )
		{
			var center = streetView.getPosition();
			
			//when streetview is visible
			args.controls.trigger( 'update' , [{
				streetView : {
					property : 'type',
					value : '"streetview"',
					css : false
				},
				lat : {
					property : 'lat',
					value : center.lat(),
					css : false
				},
				lng : {
					property : 'lng',
					value : center.lng(),
					css : false
				},
			}]);
			updateStaticMap( _.extend(args,{'type':'streetview'}) );
		}else{
			//when streetview is hidden
			args.controls.trigger( 'update' , [{
				map : {
					property : 'type',
					value : '"map"',
					css : false
				}
			}]);
			updateStaticMap( _.extend(args,{'type':'map'}) );
		}
	});
	
	
	//called when the streetview is panned
	google.maps.event.addListener( streetView, 'pov_changed', function() {
		delayedUpdate();
	});
	
	// need this so we don't spam the servers
	var delayedUpdate = _.debounce( function(){
		var center = streetView.getPosition();
		var pov = streetView.getPov();
		
		args.controls.trigger( 'update' , [{
			heading : {
				property : 'heading',
				value : pov.heading,
				css : false
			},
			lat : {
				property : 'lat',
				value : center.lat(),
				css : false
			},
			lng : {
				property : 'lng',
				value : center.lng(),
				css : false
			},
			pitch : {
				property : 'pitch',
				value : pov.pitch,
				css : false
			},
			streetZoom : {
				property : 'streetZoom',
				value : Math.floor( pov.zoom ),
				css : false
			}			
		}]);
		
		updateStaticMap( _.extend(args,{
			'heading':pov.heading,
			'pitch':pov.pitch,
			'streetZoom':Math.floor( pov.zoom ),
			'lat':center.lat(),
			'lng':center.lng()
		}) )
	} , 1000);

	//if the searchBar is active, then draw in the form and activate geocoder
	if( args.searchBar )
	{
		var input = $('<input>').attr({ 'id' : 'map-search' , 'type' : 'text' });
		var button = $('<input>').attr({ 'id' : 'map-submit' , 'type' : 'submit' });
		args.controls.find('.google-map-wrapper').append(input).append(button);
		
		var geocoder = new google.maps.Geocoder();
		
		button.click(function(){
			_this.geocoder.geocode( { 'address': $('#map-search-'+_this.model.id).val()}, function(results, status) {
				doMapSearch();
			});
		});
		
		input.keypress(function(event){
			if ( event.which == 13 )
			{
				doMapSearch();
			}
		});

		var doMapSearch = function()
		{
			event.preventDefault();
			geocoder.geocode( { 'address': input.val()}, function(results, status) {
				if ( status == google.maps.GeocoderStatus.OK )
				{
					if( streetView.getVisible() ) streetView.setVisible( false );
					var center = results[0].geometry.location;
					map.setCenter( center );
				}
				else alert("Geocoder failed at address look for "+ input.val()+": " + status);
			});
			
			args.controls.trigger( 'update' , [{
				title : {
					property : 'title',
					value : '"'+ input.val() +'"',
					css : false
				}
			}]);
			
		}

	} // end if searchbar

}

function updateStaticMap( args )
{

	var wPercent = 6 * parseInt( args.w );
	var hPercent = 4 * parseInt( args.h );
	
	if(args.type == 'streetview')
	{
		args.visual.find('img').attr( 'src' , 'http://maps.googleapis.com/maps/api/streetview?size='+wPercent+'x'+hPercent+'&fov='+180 / Math.pow(2,args.streetZoom)+'&location='+ args.lat+','+args.lng+'&heading='+args.heading+'&pitch='+args.pitch+'&sensor=false');
	}else{
		args.visual.find('img').attr( 'src' , "http://maps.googleapis.com/maps/api/staticmap?center="+ args.lat +","+args.lng+"&zoom="+ args.zoom +"&size="+ wPercent +"x"+ hPercent +"&maptype="+ args.mapType +"&sensor=false");
	}
}

function makeFullscreenButton( dom )
{
	var button = $('<input>').attr({'class':'fullscreen-submit btn','type':'submit','value':'Fullscreen'});
	
	button.click(function(){
		//set height width:100% ; top:0 ; left:0
		dom.find('#width-slider').slider("option", "value", 100 );
		dom.trigger( 'update' , [{
			width : {
				property : 'width',
				value : 100,
				suffix : '%'
				},
			top : {
				property : 'top',
				value : 0,
				},
			left : {
				property : 'left',
				value : 0,
				}
		}]);
	});
	
	return button;
}

function makeUISlider(args)
{
	var defaults = {
		min : 0,
		max : 100,
		step : 1,
		value : 100,
		silent : false,
		suffix : '',
		css : false
	};
	
	_.defaults(args,defaults);
	
	var sliderWrapper = $('<div>').addClass('slider');
	if( args.label ) sliderWrapper.append( $("<h4>").html( args.label) );
	var slider = $('<div>').addClass('layer-slider').attr('id',args.property+'-slider');
		
	slider.slider({
		min : args.min,
		max : args.max,
		value : args.value,
		step : args.step,
		slide : function(e, ui)
		{
			if( args.input ) args.input.val( ui.value )
			args.dom.trigger( 'update' , [{
				property : {
					property : args.property,
					value : ui.value,
					suffix : args.suffix,
					css : args.css
					}
				},true]);
		},
		stop : function(e,ui)
		{
			args.dom.trigger( 'update' , [{
				property : {
					property : args.property,
					value : ui.value,
					suffix : args.suffix,
					css : args.css
					}
			}, args.silent]);
		}
	});
	
	sliderWrapper.append( slider );
	
	return sliderWrapper;
}

function makeColorPicker( args )
{
	defaults = {
		color : {r:255,g:255,b:255,a:1},
		opacity : true
	};
	
	_.defaults( args , defaults );

    //clean label of spaces
    var cleanLabel = args.label.replace(/\s/g, '-').toLowerCase();

	var colorPicker = $('<div>');
	var colorWrapper = $('<div>').addClass('color-window')
		.data('info', {id:args.id,property:args.property});

	var colorPreview = $('<div>').addClass('color-preview')
		.css('background-color', '#' + RGBToHex(args.color) );

	var rInput = makeHiddenInput({label:'r',value:args.color.r});
	var gInput = makeHiddenInput({label:'g',value:args.color.g});
	var bInput = makeHiddenInput({label:'b',value:args.color.b});
	var aInput = makeHiddenInput({label:'a',value:args.color.a});

	// maybe not every color picker needs opacity?
	if( args.opacity )
	{
		var opacityArgs = {
			max : 1,
			label : 'Opacity',
			step : 0.01,
			property : 'alpha',
			value : args.color.a,
			dom : colorPicker,
			input : aInput,
			css : false,
		};
		var opacitySlider = makeUISlider( opacityArgs );
	}
	
	colorWrapper.append( colorPreview )
		.append( rInput )
		.append( gInput )
		.append( bInput )
		.append( aInput );

	colorPicker.append('<h4>'+args.label+'</h4>')
		.append(colorWrapper);
	if( args.opacity ) colorPicker.append(opacitySlider);
	
	/*****
	EVENTS
	******/	
	
	colorPicker.bind( 'update', function(e, alpha, silent){
		var rgbaString = 'rgba('+rInput.val()+','+gInput.val()+','+bInput.val()+','+aInput.val()+')';
		args.target.css( args.property , rgbaString );
		
		//save if the last call
		if( !silent )
		{
			var rgba = {
				r : rInput.val(),
				g : gInput.val(),
				b : bInput.val(),
				a : aInput.val()
			};
			
			args.controls.trigger( 'update' , [{
				color : {
					property : args.property,
					value : rgba,
					css : false
				}
			}]);
		}
	});
	
	colorPicker.bind( 'updateColor', function(e){
		var rgbaString = 'rgba('+rInput.val()+','+gInput.val()+','+bInput.val()+','+aInput.val()+')';
		args.target.css( args.property , rgbaString );
	});

	var picker = colorWrapper.ColorPicker({
		color : args.color,
		
		onShow : function(c)
		{
			$(c).fadeIn();
		},

	    onHide : function(c){
			$(c).fadeOut();
			//args.update();
			
			var rgba = {
				r : rInput.val(),
				g : gInput.val(),
				b : bInput.val(),
				a : aInput.val()
			};
			
			args.controls.trigger( 'update' , [{
				color : {
					property : args.property,
					value : rgba,
					css : false
				}
			}]);
	    },

		onChange : function(hsb, hex, rgb){
			//update the preview box
			colorPreview.css( 'background-color', '#' + hex );
			//update the input
			rInput.val( rgb.r );
			gInput.val( rgb.g );
			bInput.val( rgb.b );
			//update the visual editor
			colorPicker.trigger('updateColor');
		}
	});

    return colorPicker;
}

function makeHiddenInput( options )
{
	var hiddenInput = $('<input type="hidden" />')
		.attr( 'id' , options.label )
		.val( options.value );		
		return hiddenInput;
}


//do we need this?
//Shamelessly cribbed from ColorPicker <---yessss
function RGBToHex (rgb)
{
    var hex = [
	       parseInt(rgb.r).toString(16),
	       parseInt(rgb.g).toString(16),
	       parseInt(rgb.b).toString(16)
	       ];
    $.each(hex, function (nr, val) {
	    if (val.length == 1) {
		hex[nr] = '0' + val;
	    }
	});
    return hex.join('');
}			

function getItemIcon(type)
{
	//console.log(type.toLowerCase());
	switch(type.toLowerCase())
	{
		case "audio":
			return 'ui-icon-volume-on';
			break;
		case "image":
			return 'ui-icon-image';
			break;
		case "video":
			return 'ui-icon-video';
			break;
	}
}
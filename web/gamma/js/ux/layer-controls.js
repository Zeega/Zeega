/************************

	LAYER CONTROL TOOLBOX
	
	Functions that return standardized ui elements
	maybe these should be a jQuery plugin?????
	
*************************/


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
				value : map.getMapTypeId(),
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
			
			var properties = {
				streetView : {
					property : 'type',
					value : 'streetview',
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
				}
			};
			
			args.controls.trigger( 'update' , [ properties ] );
			updateStaticMap( _.extend(args,{'type':'streetview','lat':properties.lat.value,'lng':properties.lng.value}) );
		}else{
			//when streetview is hidden
			
			var properties = {
				map : {
					property : 'type',
					value : 'map',
					css : false
				}
			};
			
			args.controls.trigger( 'update' , [ properties ]);
			updateStaticMap( _.extend(args,{'type':'map'}) );
		}
	});
	
	
	//called when the streetview is panned
	google.maps.event.addListener( streetView, 'pov_changed', function(){
		delayedUpdate();
	});
	
	// need this so we don't spam the servers
	var delayedUpdate = _.debounce( function(){
		var center = streetView.getPosition();
		var pov = streetView.getPov();
		var properties = {
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
		};
		args.controls.trigger( 'update' , [ properties ] );
		
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
			
			var properties = {
				title : {
					property : 'title',
					value : input.val(),
					css : false
				}
			};
			args.controls.trigger( 'update' , [properties] );
			
		}

	} // end if searchbar

}

function updateStaticMap( args )
{

	console.log('UPDATE STATIC MAP')
	console.log(args);
	console.log(args.width +':'+ args.height);
	
	var wPercent = 6 * parseInt( args.width );
	var hPercent = 4 * parseInt( args.height );
	
	if(args.type == 'streetview')
	{
		console.log( 'http://maps.googleapis.com/maps/api/streetview?size='+wPercent+'x'+hPercent+'&fov='+180 / Math.pow(2,args.streetZoom)+'&location='+ args.lat+','+args.lng+'&heading='+args.heading+'&pitch='+args.pitch+'&sensor=false');
		args.visual.find('img').attr( 'src' , 'http://maps.googleapis.com/maps/api/streetview?size='+wPercent+'x'+hPercent+'&fov='+180 / Math.pow(2,args.streetZoom)+'&location='+ args.lat+','+args.lng+'&heading='+args.heading+'&pitch='+args.pitch+'&sensor=false');
	}else{
		args.visual.find('img').attr( 'src' , "http://maps.googleapis.com/maps/api/staticmap?center="+ args.lat +","+args.lng+"&zoom="+ args.zoom +"&size="+ wPercent +"x"+ hPercent +"&maptype="+ args.mapType +"&sensor=false");
	}
}

function makeFullscreenButton( dom )
{
	var button = $('<input>').attr({'class':'fullscreen-submit btn','type':'submit','value':'Fullscreen'});
	
	button.click(function(){
		dom.find('#width-slider').slider("option", "value", 100 );
		
		var properties = {
			width : {
				property : 'width',
				value : 100,
				suffix : '%',
				css : true
			},
			height : {
				property : 'height',
				value : 100,
				suffix : '%',
				css : true
			},
			top : {
				property : 'top',
				value : 0,
				css : true
			},
			left : {
				property : 'left',
				value : 0,
				css : true
			}
		};
		
		dom.trigger( 'update' , [ properties , false ]);
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
		css : false,
		
		scaleWith : false,
		scaleValue : false,
		
		callback : false
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
			//sets the optional input field to the value
			if( args.input ) args.input.val( ui.value )
			
			//set the object to save.
			var properties = {
				propertyA : {
					property : args.property,
					value : ui.value,
					suffix : args.suffix,
					css : args.css
				}
			};
			// test to see if scale is set
			if( args.scaleWith && args.scaleValue )
			{
				var scaled = ( ui.value * args.scaleValue ) / args.value;
				properties.propertyB = {
					property : args.scaleWith,
					value : scaled,
					suffix : args.suffix,
					css : args.css
				}
			}
			
			args.dom.trigger( 'update' , [ properties , true ] );
		},
		stop : function(e,ui)
		{
			//sets the optional input field to the value
			if( args.input ) args.input.val( ui.value )
			
			console.log( args );
			
			//set the object to save.
			var properties = {
				propertyA : {
					property : args.property,
					value : ui.value,
					suffix : args.suffix,
					css : args.css
				}
			};
			// test to see if scale is set
			if( args.scaleWith && args.scaleValue )
			{
				var scaled = ( ui.value * args.scaleValue ) / args.value;
				properties.propertyB = {
					property : args.scaleWith,
					value : scaled,
					suffix : args.suffix,
					css : args.css
				}
			}
			
			args.dom.trigger( 'update' , [ properties , args.silent ] );
			
			if( args.callback )
			{
				console.log( args.callback );
			}
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
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




function makeFullscreenButton(){

	var button=$('<input>').attr({'class':'fullscreen-submit btn','type':'submit','value':'Fullscreen'});
	return button;
}


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

function makeUISlider(args)
{
	var defaults = {
		min : 0,
		max : 100,
		step : 1,
		value : 100
	};
	
	args = _.defaults(args,defaults);
	
	var sliderWrapper = $('<div>').addClass('slider');
	if( args.label ) sliderWrapper.append( $("<h4>").html( args.label) );
	var slider = $('<div>').addClass('layer-slider');
		
	slider.slider({
		min : args.min,
		max : args.max,
		value : args.value,
		step : args.step,
		slide : function(e, ui)
		{
			if( args.input ) args.input.val( ui.value )
			args.dom.trigger( 'updateColor' );
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
	
	args = _.defaults(args,defaults);
	
	var dom = $(args.dom);
	
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

	//add change handlers to hidden inputs
	$(rInput).change(function(){
		console.log('this');
	});

	// maybe not every color picker needs opacity?
	if( args.opacity )
	{
		var opacityArgs = {
			min : 0,
			max : 1,
			label : 'Opacity',
			value : args.color.a,
			step : 0.01,
			dom : args.dom,
			input : aInput
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
	EVENT
	******/	
	dom.bind( 'updateColor' , function(e){
		var rgba = 'rgba('+rInput.val()+','+gInput.val()+','+bInput.val()+','+aInput.val()+')';
		dom.css( args.property , rgba );
	});

	var picker = colorWrapper.ColorPicker({
		color : args.color,
		onShow : function(c)
		{
			$(c).fadeIn();
		},

	    onHide : function(c){
			$(c).fadeOut();
			args.update();
	    },

		onChange : function(hsb, hex, rgb){
			//update the preview box
			colorPreview.css( 'background-color', '#' + hex );
			//update the input
			rInput.val( rgb.r );
			gInput.val( rgb.g );
			bInput.val( rgb.b );
			//update the visual editor
			dom.trigger( 'updateColor' );
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
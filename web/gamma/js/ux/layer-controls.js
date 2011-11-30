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


function makeColorPicker( args )
{
	console.log(args)
    //clean label of spaces
    var cleanLabel = args.label.replace(/\s/g, '-').toLowerCase();

	var colorPicker = $('<div>');
	var colorWrapper = $('<div>').addClass('color-window');
	
	var colorPreview = $('<div>').addClass('color-preview').
		attr('id', cleanLabel+'-preview-'+args.id).
		css('background-color', '#'+RGBToHex(args.color) );

	var colorInput = $('<input type="hidden" />')
		.attr({
			id : cleanLabel+'-colorPicker-'+args.layer_id,
			'data-layer-id' : args.id,
			value : RGBToHex( args.color )
		});

	colorWrapper.append( colorPreview )
		.append( colorInput );
		
	colorPicker.append('<h4>'+args.label+'</h4>')
		.append(colorWrapper);
		
	var picker = colorWrapper.ColorPicker({
		color : args.color,
		onShow : function(c)
		{
			$(c).fadeIn();
		},
		
	    onHide : function(c){
			$(c).fadeOut();
			//args._this.updateAttr();
	    },
	
		onChange : function(hsb, hex, rgb){
			colorPreview.css( 'background-color', '#' + hex );
			colorInput.val( hex );
			/*
			$('input#'+cleanLabel+'-colorPicker-'+args.layer_id).val(hex);
			args.custom_handler(rgb, args.layer_id);
			*/
		}
	});
	
    return colorPicker;
}

//Shamelessly cribbed from ColorPicker <---yessss
function RGBToHex (rgb){
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
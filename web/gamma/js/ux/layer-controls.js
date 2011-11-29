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
			if(args.css!='none'){
				$('#layer-preview-'+args.layer_id ).css( args.css, ui.value+args.suffix);
			}
		}
	});
	
	return sliderDiv;
}


function textArea()
{
	var html = "<input type='textarea'>";

	
	return template;
}


function makeColorPicker(args)
{

    //clean label of spaces
    var cleanLabel = args.label.replace(/\s/g, '_');
    var pickerDiv = $('<div/>').addClass('layer-colorPicker-div')
		.append($('<h4>').html(args.label))
		.append($('<input />').attr({
			id : cleanLabel+'-colorPicker-'+args.layer_id,
			'data-layer-id' : args.layer_id,
			readonly : 'readonly',
			value : RGBToHex(args.color)
		})
		.addClass('layer-colorPicker'));
		
	var picker = pickerDiv.find('.layer-colorPicker').ColorPicker({
		color : args.color,
		onShow : function(c)
		{
			$(c).fadeIn();
		},
		
	    onHide : function(c){
			$(c).fadeOut();
			args._this.updateAttr();
	    },
	
		onChange : function(hsb, hex, rgb){
			$('input#'+cleanLabel+'-colorPicker-'+args.layer_id).val(hex);
			args.custom_handler(rgb, args.layer_id);
		}
	});
	
    return pickerDiv;
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
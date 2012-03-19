(function(Layer){

	Layer.Views.Lib = Backbone.View.extend({});

	Layer.Views.Lib.Slider = Layer.Views.Lib.extend({
		
		className : 'control control-slider',
		
		defaults : {
			label : 'control',
			min : 0,
			max : 100,
			step : 1,
			value : 100,
			silent : false,
			suffix : '',
			css : true,
			scaleWith : false,
			scaleValue : false,
			callback : false
		},
		
		initialize : function( args )
		{
			this.settings = _.defaults( args, this.defaults );
		},
		
		render : function()
		{
			var _this = this;
			
			this.$el.append( _.template( this.getTemplate(), this.settings ));
			
			//slider stuff here
			this.$el.find('.control-slider').slider({
				min : this.settings.min,
				max : this.settings.max,
				value : this.model.get('attr')[this.settings.property] || this.settings.value,
				step : this.settings.step,
				slide : function(e, ui)
				{
					if( _this.settings.css )
						_this.model.visual.$el.css( _this.settings.property, ui.value + _this.settings.suffix );
				},
				stop : function(e,ui)
				{
					var attr = {};
					attr[_this.settings.property] = ui.value;
					_this.model.update( attr )
				}
			});
			
			return this;
		},
		
		getTemplate : function()
		{
			var html = ''+
			
					"<div class='control-name'><%= label %></div>"+
					"<div class='control-slider'></div>";
			
			return html;
		}
	});
	
	
	Layer.Views.Lib.ColorPicker = Layer.Views.Lib.extend({
		
		className : 'control control-colorpicker',
		
		defaults : {
			property : 'backgroundColor',
			color : '#ffffff'
		},
		
		initialize : function( args )
		{
			this.settings = _.defaults( args, this.defaults );
		},
		
		save : function()
		{
			console.log('save rect')
			var attr = {};
			console.log(this)
			attr[ this.settings.property ] = this.settings.color;
			this.model.update( attr )
		},
		
		render : function()
		{
			var _this = this;
			
			
			
			this.$el.append( _.template( this.getTemplate(), this.settings ));
			
			$.farbtastic(this.$el.find('.control-colorpicker'))
				.setColor( _this.settings.color )
				.linkTo(function(color){
					console.log(color)
					_this.model.visual.$el.css( _this.settings.property, color );
					_this.settings.color = color;
					_this.lazySave();
				});
			
			return this;
		},
		
		lazySave : _.debounce( function(){
			var attr = {};
			attr[ this.settings.property ] = this.settings.color;
			this.model.update( attr );
		}, 3000),
		
		getTemplate : function()
		{
			var html = ''+
			
					"<div class='control-name'><%= label %></div>"+
					"<div class='control-colorpicker'></div>";
			
			return html;
		}
	});

	
})(zeega.module("layer"));


/*
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
*/
(function(Layer){

	Layer.Image = Layer.Model.extend({
			
		layerType : 'Image',

		defaultAttributes : {
			'title' : 'Image Layer',
			'url' : 'none',
			'left' : 0,
			'top' : 0,
			'height' : 100,
			'width' : 100,
			'opacity':1,
			'aspect':1.33,
			'citation':true,
		},

	});
	
	Layer.Views.Controls.Image = Layer.Views.Controls.extend({
		
		render : function()
		{
			
			var scaleSlider = new Layer.Views.Lib.Slider({
				property : 'width',
				model: this.model,
				label : 'Scale',
				suffix : '%',
				min : 1,
				max : 200,
			});
			
			var opacitySlider = new Layer.Views.Lib.Slider({
				property : 'opacity',
				model: this.model,
				label : 'Opacity',
				step : 0.01,
				min : .05,
				max : 1,
			});
			
			this.controls.append( scaleSlider.getControl() )
				.append( opacitySlider.getControl() );
			
			return this;
		
		}
		
	});

	Layer.Views.Visual.Image = Layer.Views.Visual.extend({
		
		draggable : true,
		linkable : true,
		
		render : function()
		{
			var img = $('<img>')
				.attr('src', this.attr.url)
				.css({'width':'100%'});

			$(this.el).html( img );
			
			this.model.trigger('ready',this.model.id)
			
			return this;
		}
	});
/*	
	Layer.Views.Player.Image = Layer.Views.Visual.extend({
		
		render : function()
		{
			var img = $('<img>')
				.attr('src', this.attr.url)
				.css({'width':'100%'});

			$(this.el).html( img );
				
			return this;
		}
	});
*/	
})(zeega.module("layer"));
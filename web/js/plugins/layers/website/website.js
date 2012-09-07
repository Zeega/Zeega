(function(Layer){

	Layer.Website = Layer.Model.extend({
			
		layerType : 'Website',

		defaultAttributes : {
			'title' : 'Website Layer',
			'url' : 'none',
			'left' : 0,
			'top' : 0,
			'height' : 100,
			'width' : 100,
			'opacity':1,
			'aspect':1.33,
			'citation':true,
		}

	});
	
	Layer.Views.Controls.Website = Layer.Views.Controls.extend({
		
		render : function()
		{
			var dissolveCheck = new Layer.Views.Lib.Checkbox({
				property : 'dissolve',
				model: this.model,
				label : 'Fade In'
			});
			
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
			
			this.controls
				.append(dissolveCheck.getControl() )
				.append( scaleSlider.getControl() )
				.append( opacitySlider.getControl() );
			
			return this;
		
		}
		
	});

	Layer.Views.Visual.Website = Layer.Views.Visual.extend({
		
		draggable : true,
		linkable : true,
		
		render : function()
		{
			var iframe = $('<iframe>')
				.attr('src', this.attr.uri)
				.css({'background-color':'white','width':'100%','height':'100%','border':'none'});

			$(this.el).html( iframe );
						
			return this;
		}
	});

})(zeega.module("layer"));

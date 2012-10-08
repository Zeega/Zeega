/************************************

	Rectangle LAYER CHILD CLASS
	
	
	TODO:
		
		Features: 
			-fullscreen bleed?

************************************/
(function(Layer){

	Layer.Rectangle = Layer.Model.extend({

		layerType : 'Rectangle',
		displayCitation : false,
		visual : true,
		scalable : true,
		
		defaultAttributes : {
			'title' : 'Color Layer',
			'url' : null,
			'backgroundColor': '#ff00ff',
			'left' : 0,
			'top' : 0,
			'height' : 100,
			'width' : 100,
			'opacity':.75,
			
		}	
		
	});
	
	Layer.Views.Controls.Rectangle = Layer.Views.Controls.extend({
		
		render : function()
		{

			
			var color = new Layer.Views.Lib.ColorPicker({
				property : 'backgroundColor',
				color : this.attr.backgroundColor,
				model: this.model,
				label : 'Color'
			});
			
			this.controls
				.append( color.getControl() );

			return this;
		
		}
		
	});

	Layer.Views.Visual.Rectangle = Layer.Views.Visual.extend({
		
		render : function()
		{
			var style = {
				'backgroundColor' : this.model.get('attr').backgroundColor,
				'height' : this.model.get('attr').height +'%'
			}

			$(this.el).css( style );
			
			this.model.trigger('ready',this.model.id)
			
			return this;
		}
		
		
	});
	
})(zeega.module("layer"));
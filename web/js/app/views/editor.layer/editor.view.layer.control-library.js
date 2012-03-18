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

	
})(zeega.module("layer"));
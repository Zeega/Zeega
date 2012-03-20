(function(Layer){

	Layer.Views.Lib = Backbone.View.extend({
		getControl : function()
		{
			this.render();
			return this.el;
		}
	});

	Layer.Views.Lib.Target = Layer.Views.Lib.extend({
		
		defaults : {
			className : '',
			idName : ''
		},
		
		initialize : function( args )
		{
			this.settings = _.defaults( args, this.defaults );
			this.className = this.settings.className;
		},
		
		render : function()
		{
			$(this.el).attr('id', this.settings.idName);
		}
		
	});



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
			callback : false,
			save : true
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
					if(_this.settings.save)
					{
						var attr = {};
						attr[_this.settings.property] = ui.value;
						_this.model.update( attr )
					}
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
			color : '#ffffff',
			save : 'true'
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
					if(_this.settings.save) _this.lazySave();
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

	Layer.Views.Lib.Playback = Layer.Views.Lib.extend({
		
		className : 'control control-playback',
		
		defaults : {},
		
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
					if(_this.settings.save) _this.lazySave();
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


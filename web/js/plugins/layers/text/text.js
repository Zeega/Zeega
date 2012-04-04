(function(Layer){

	Layer.Text = Layer.Model.extend({

		layerType : 'Text',
		
		defaultAttributes: {
			'title' :'Text Layer',
			'content' : 'Text',
			'left' :0,
			'top' :0,
			'color' : '#ff0000',
			'backgroundColor' : '#ffffff',
			'opacity' : 0.9,
			'fontSize' : 100,
			'padding' : 5,
		},
		
		updateContentInPlace : function()
		{
			this.visual.updateContentInPlace();
		},

		preload : function( target )
		{
			
		},
	
		play : function( z )
		{
			
		},

		stash : function()
		{
			this.display.css({'top':"-1000%",'left':"-1000%"});
		}
	
		
	});
	
	Layer.Views.Controls.Text = Layer.Views.Controls.extend({
		
		render : function()
		{
			var bgcolor = new Layer.Views.Lib.ColorPicker({
				property : 'backgroundColor',
				color : this.attr.backgroundColor,
				model: this.model,
				label : 'Background Color',
			});
			
			var color = new Layer.Views.Lib.ColorPicker({
				property : 'color',
				color : this.attr.color,
				model: this.model,
				label : 'Text Color'
			});
			
			var opacitySlider = new Layer.Views.Lib.Slider({
				property : 'opacity',
				model: this.model,
				label : 'Opacity',
				step : 0.01,
				min : .05,
				max : 1,
				
			});
			
			var sizeSlider = new Layer.Views.Lib.Slider({
				property : 'fontSize',
				model: this.model,
				label : 'Font Size',
				suffix : '%',
				min : 100,
				max : 1000,
				
			});
			
			var paddingSlider = new Layer.Views.Lib.Slider({
				property : 'padding',
				model: this.model,
				label : 'Padding',
				suffix : '%',
				min : 1,
				max : 50,
				
			});
			
			var clearButton = new Layer.Views.Lib.ClearStyles({ model : this.model });
			
			this.controls
				.append( bgcolor.getControl() )
				.append( color.getControl() )
				.append( opacitySlider.getControl() )
				.append( sizeSlider.getControl() )
				.append( paddingSlider.getControl() )
				.append( clearButton.getControl() );
			
			return this;
		}
		
	});

	Layer.Views.Visual.Text = Layer.Views.Visual.extend({
		
		render : function()
		{
			var style = {
				'color' : this.attr.color,
				'backgroundColor' : this.attr.backgroundColor,
				'opacity' : this.attr.opacity,
				'fontSize' : this.attr.fontSize +'%',
				'padding' : this.attr.padding +'%',
				'whiteSpace' : 'nowrap'
			}

			$(this.el).html( _.template( this.getTemplate(), this.model.get('attr') ) ).css( style );
			
			this.model.trigger('ready',this.model.id)
			
			return this;
		},
		
		onLayerEnter : function()
		{
			var _this = this;
			this.$el.find('#zedit-target').keypress(function(e){
				_this.lazySave();
			});
			
			this.$el.click(function(){
				_this.$el.find('#zedit-target').focus();
				_this.$el.draggable('option','disabled', true);
			}).focusout(function(){
				_this.$el.draggable('option','disabled', false);
			})
			
		},
		
		lazySave : _.debounce( function(){
			
			var str = this.$el.find('#zedit-target').html();
			
			var clean = this.cleanString( str );
			
			this.model.update( {
				content : str,
				title : clean
			} );
		}, 1000),
		
		cleanString : function(str)
		{
			return str.replace(/(<([^>]+)>)/ig, "");
		},
		
		updateContentInPlace : function()
		{
			$(this.el).find('#zedit-target').html(this.model.get('attr').content );
		},
		
		getTemplate : function()
		{
			var html = 
			
					'<div id="zedit-target" class="inner" contenteditable="true" ><%= content %></div>';
			
			return html;
		}
		
	});
	
})(zeega.module("layer"));




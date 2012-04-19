(function(Layer){

	Layer.Text = Layer.Model.extend({

		layerType : 'Text',
		
		linkable : true,
		
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
			
			linkable : true
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
				color : this.model.get('attr').backgroundColor,
				model: this.model,
				label : 'Background Color',
				opacity : true,
				opacityValue : 0
			});
			
			var color = new Layer.Views.Lib.ColorPicker({
				property : 'color',
				color : this.model.get('attr').color,
				model: this.model,
				label : 'Text Color',
				opacity : true
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
			
			var textStyles = new Layer.Views.Lib.TextStyles({
				model : this.model
			})
			
			var fontChooser = new Layer.Views.Lib.FontChooser({
				model : this.model
			})
			
			var clearButton = new Layer.Views.Lib.ClearStyles({ model : this.model });
			
			this.controls
				.append( textStyles.getControl() )
				.append( fontChooser.getControl() )
				.append( color.getControl() )
				.append( bgcolor.getControl() )
				.append( sizeSlider.getControl() )
				.append( paddingSlider.getControl() )
				.append( clearButton.getControl() );
			
			return this;
		}
		
	});

	Layer.Views.Visual.Text = Layer.Views.Visual.extend({
		
		draggable : true,
		
		render : function()
		{
			
			// this should be removed later!
			var c = '';
			var b = '';
			if( _.isObject( this.model.get('attr').color ) )
			{
				var a = this.model.get('attr').color;
				c = rgbToHex(a.r,a.g,a.b);
				
			}
			else c = this.model.get('attr').color;
			
			if( _.isObject( this.model.get('attr').backgroundColor ) )
			{
				var a = this.model.get('attr').backgroundColor;
				b = rgbToHex(a.r,a.g,a.b);
			}
			else b = this.model.get('attr').backgroundColor;
			
			
			var style = {
				'color' : 'rgba('+ c.toRGB() +','+ (this.model.get('attr').colorOpacity || 1) +')',
				'backgroundColor' : 'rgba('+ b.toRGB() +','+ (this.model.get('attr').backgroundColorOpacity || 0) +')',
				'opacity' : this.model.get('attr').opacity,
				'fontSize' : this.model.get('attr').fontSize < 100 ? '100%' : this.model.get('attr').fontSize +'%', // enforces minimum. remove this later
				'padding' : this.model.get('attr').padding +'%',
				'whiteSpace' : 'nowrap'
			}
			console.log(this.model.get('attr'))
			console.log('color: '+ style.backgroundColor)
			console.log(this.model)

			$(this.el).html( _.template( this.getTemplate(), this.model.get('attr') ) ).css( style );
			
			this.model.trigger('ready',this.model.id)
			
			return this;
		},
		
		onLayerEnter : function()
		{
			var _this = this;
			this.$el.find('#zedit-target').keypress(function(e){
				_this.lazySave();
			})
			.bind('paste', function(e){
				console.log('content pasted in!')
				_this.lazySave();
			});
			
			this.$el.click(function(){
				_this.$el.find('#zedit-target').focus();
				_this.$el.draggable('option','disabled', true);
			}).focusout(function(){
				_this.$el.draggable('option','disabled', false);
				_this.lazySave();
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




(function(Layer){

	Layer.Tweet = Layer.Model.extend({

		layerType : 'Tweet',
		displayCitation : true,
		linkable : true,
		
		defaultAttributes: {
			'title' :'Twitter Layer',
			'content' : 'Text',
			'left' :0,
			'top' :25, 
			'color' : '#ffffff',
			'opacity' : 0.9,
			'fontSize' : 200,
			'overflow' : 'visible',
			'width' : 100,
			//'height' : 10,
			
			linkable : true
		}
		
	});
	
	Layer.Views.Controls.Tweet = Layer.Views.Controls.extend({
		
		render : function()
		{
			var dissolveCheck = new Layer.Views.Lib.Checkbox({
				property : 'dissolve',
				model: this.model,
				label : 'Fade In'
			});
			
			var color = new Layer.Views.Lib.ColorPicker({
				property : 'color',
				color : this.model.get('attr').color,
				model: this.model,
				label : 'Text Color',
				opacity : true
			});
			
			var textStyles = new Layer.Views.Lib.TextStyles({
				model : this.model
			})
			
			var fontChooser = new Layer.Views.Lib.FontChooser({
				model : this.model
			})
			
			this.controls
				.append( dissolveCheck.getControl() )
				.append( textStyles.getControl() )
				.append( fontChooser.getControl() )
				.append( color.getControl() );
			
			return this;
		}
		
	});

	Layer.Views.Visual.Tweet = Layer.Views.Visual.extend({
		
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
				'opacity' : this.model.get('attr').opacity,
				'fontSize' : this.model.get('attr').fontSize < 100 ? '200%' : this.model.get('attr').fontSize +'%', // enforces minimum. remove this later
				'width' : this.model.get('attr').width+'%',
				'overflow' : 'visible',
				'line-height' : '100%',
			}

			$(this.el).html( _.template( this.getTemplate(), _.extend(this.model.get('attr'), {contentEditable:!this.model.player} ) ) ).css( style );
			if(!this.model.player) $(this.el).addClass('text-non-editing');
			
			this.model.trigger('ready',this.model.id)
			
			return this;
		},
		
		onLayerEnter : function()
		{
			var _this = this;
			
			$(this.el).resizable({
				stop : function(e,ui)
				{
					$(this).css('height','');
					_this.model.update({
						'width' : $(this).width() / $(this).parent().width() * 100,
					})
				}
			});
		},
		
		getTemplate : function()
		{
			var html = 
			
					'<div id="zedit-target" class="inner"  ><%= description %></div>';
			
			return html;
		}
		
	});
	
})(zeega.module("layer"));




/************************************

	LINK LAYER CHILD CLASS

************************************/
(function(Layer){

	Layer.Link = Layer.Model.extend({

		layerType : 'Link',
		
		defaultAttributes : {
			'title' : 'Link Layer',
			'to_frame' : null,
			'from_frame': null,
			'left' : 25,
			'top' : 25,
			'height' : 50,
			'width' : 50,
		}	
		
	});
	
	Layer.Views.Controls.Link = Layer.Views.Controls.extend({
		
		render : function()
		{
			$(this.el).remove();
			return this;
		}
		
	});

	Layer.Views.Visual.Link = Layer.Views.Visual.extend({
		
		render : function()
		{
			var _this = this;
			var style = {
				'height' : this.model.get('attr').height +'%',
			}
			$(this.el).css( style );
			
			this.model.trigger('ready',this.model.id)
			
			return this;
		},
		
		onLayerEnter : function()
		{
			var _this = this;
			var style = {
				'border' : '2px dashed red'
			}

			$(this.el).css( style );
			this.$el.resizable({
				stop: function(e,ui)
				{
					console.log('save this bad boy')
					_this.model.update({
						'width' : $(this).width() / $(this).parent().width() * 100,
						'height' : $(this).height() / $(this).parent().height() * 100
					})
				}
			})
		}
		
		
	});
	
})(zeega.module("layer"));
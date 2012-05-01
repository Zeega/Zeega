/************************************

	LINK LAYER CHILD CLASS

************************************/
(function(Layer){

	Layer.Link = Layer.Model.extend({

		layerType : 'Link',
		
		defaultAttributes : {
			'title' : 'Link Layer',
			'to_frame' : null,
			'from_frame' : null,
			'left' : 25,
			'top' : 25,
			'height' : 50,
			'width' : 50
		},
		
		init : function()
		{
			if( this.isNew() ) this.get('attr').from_frame = zeega.app.currentFrame.id;
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
		
		events : {
			'click .delete-link' : 'deleteLink',
			'mousedown .show-controls' : 'showControls'
		},
		
		deleteLink : function(e)
		{
			if( confirm('delete link?') )
			{
				this.model.trigger('editor_removeLayerFromFrame', this.model);
				this.remove();
			}
		},
		
		showControls : function(e)
		{
			
		},
		
		onLayerEnter : function()
		{
			
			if(this.model.get('attr').from_frame == zeega.app.currentFrame.id)
			{
				var _this = this;
				var style = {
					'border' : '2px dashed red',
					'border-radius' : '6px'
				}

				this.$el.css( style );

				this.$el.find('.icon-remove').remove();
				this.$el.prepend('<i class="icon-remove delete-link"></i>');
			
				//this.$el.append('<i class="icon-edit show-controls"></i>');
			
			
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
			
		}
		
		
	});
	
})(zeega.module("layer"));
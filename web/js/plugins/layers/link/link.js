/************************************

	LINK LAYER CHILD CLASS

************************************/
(function(Layer){

	Layer.Link = Layer.Model.extend({

		layerType : 'Link',
		layerPanel : $('#links-list'),
		hasControls : false,
		defaultControls : false,
		displayCitation : false,
		
		
		
		defaultAttributes : {
			'title' : 'Link Layer',
			'to_sequence' : null,
			'from_sequence' : null,
			'to_frame' : null,
			'from_frame' : null,
			'left' : 25,
			'top' : 25,
			'height' : 50,
			'width' : 50
		}
		
	});
	
	Layer.Views.Controls.Link = Layer.Views.Controls.extend({
		
		onLayerEnter : function()
		{
			var layerIndex = this.model.layerIndex || this.model.layerColor.length;
			
			$(this.el).find('.zicon-link').css({'background-color': this.model.layerColor[( layerIndex % this.model.layerColor.length )] })
			if(this.model.get('attr').to_frame == zeega.app.currentFrame.id)
			{
				this.remove();
			}
		},
		
		render : function()
		{
			return this;
		}
		
	});

	Layer.Views.Visual.Link = Layer.Views.Visual.extend({
		
		preview : false,
		
		init : function()
		{
			var _this = this;
			this.preview = zeega.app.previewMode;
			this.model.on('update_link', this.onUpdate, this);
		},

		onUpdate : function()
		{
			console.log('$$		on link update');
			this.$el.html( this.getTemplate() );
			this.delegateEvents();
		},
		
		render : function()
		{
			var _this = this;
			console.log('$$		render link', this)
			
			var style = {
				'height' : this.model.get('attr').height +'%',
				'cursor' : 'pointer',
				'z-index' : 100
			}
			
			if(!zeega.app.previewMode )
			{
				var layerIndex = this.model.layerIndex || this.model.layerColor.length;
				
				_.extend( style, {
					'border' : '2px dashed '+ this.model.layerColor[( layerIndex % this.model.layerColor.length )],
					'border-radius' : '6px'
				})
			}
			else
			{
				this.delegateEvents({'click':'goClick'})
			}
			
			$(this.el).html( this.getTemplate() ).css( style ).addClass('linked-layer');

			return this;
		},
		
		events : {
			'click .go-to-sequence' : 'goToSequenceFrame',
			'click .delete-link' : 'deleteLink',
			'mousedown .show-controls' : 'showControls'
		},
		
		goClick : function()
		{
			zeegaPlayer.app.project.goToFrame(this.model.get('attr').to_frame);
		},
		
		goToSequenceFrame : function()
		{
			if(zeega.app.previewMode) zeega.app.project.goToFrame(this.model.get('attr').to_frame);
			else zeega.app.goToFrame(this.model.get('attr').to_frame);
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
			console.log('$$		on update', this, this.$el)
			var _this = this;
			this.$el.resizable({
				stop: function(e,ui)
				{
					_this.model.update({
						'width' : $(this).width() / $(this).parent().width() * 100,
						'height' : $(this).height() / $(this).parent().height() * 100
					})
				}
			})
			this.delegateEvents();
		},
		
		onPlay : function()
		{
			this.render();
			this.delegateEvents({'click':'goClick'})
		},
		
		getTemplate : function()
		{
			var html = '';
			
				if( !this.preview && !_.isNull( this.model.get('attr').to_sequence ) ) html += '<i class="icon-share go-to-sequence"></i>';
				
			return html;
		}
		
		
	});
	
})(zeega.module("layer"));
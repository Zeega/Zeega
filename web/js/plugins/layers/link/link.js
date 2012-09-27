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
		
		render : function()
		{
			var linkTypeSelect = new Layer.Views.Lib.LinkTypeSelect({
				model: this.model,
				label : 'Link Type'
			});
			
			$(this.controls).append( linkTypeSelect.getControl() );
			
			return this;
		
		},
		
	});

	Layer.Views.Visual.Link = Layer.Views.Visual.extend({
		
		preview : false,
		
		init : function()
		{
			var _this = this;
			this.preview = zeega.app.previewMode;
			//this.model.on('updateLink', this.onUpdate, this);
			this.model.on('update', this.onUpdate, this);
		},

		onUpdate : function()
		{
			this.$el.resizable('destroy');
			this.render();
			this.makeResizable();
		},
		
		render : function()
		{
			var _this = this;
			var style = {
				'overflow' : 'visible',
				'cursor' : 'pointer',
				'z-index' : 100,
				'width' : 'auto',
				'height' : 'auto',
				'border' : 'none',
				'border-radius' : '0',
				'height' : this.model.get('attr').height +'%',
				'width' : this.model.get('attr').width +'%'
			}

			this.$el.removeClass('linked-layer');

			if( zeega.app.previewMode ) this.delegateEvents({'click':'goClick'});

			if(this.model.get('attr').link_type == 'arrow_left')
				this.$el.html( this.getTemplate() ).css( style ).addClass('link-arrow-left');
			else if(this.model.get('attr').link_type == 'arrow_right')
				this.$el.html( this.getTemplate() ).css( style ).addClass('link-arrow-right');
			else if(this.model.get('attr').link_type == 'arrow_up')
				this.$el.html( this.getTemplate() ).css( style ).addClass('link-arrow-up');

			if(!zeega.app.previewMode )
			{
				_.extend( style, {
					'border' : '2px dashed orangered',
					'border-radius' : '6px'
				})
			}
			
			this.$el.html( this.getTemplate() ).css( style ).addClass('linked-layer');
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
			var _this = this;
			if(this.model.get('attr').link_type == 'Rectangle')
			{
				this.$el.resizable('destroy');
				this.$el.resizable({
					stop: function(e,ui)
					{
						_this.model.update({
							'width' : $(this).width() / $(this).parent().width() * 100,
							'height' : $(this).height() / $(this).parent().height() * 100
						})
					}
				})
			}

			//this.makeResizable();
			this.delegateEvents();
		},

		makeResizable : function()
		{
			var _this = this;
			var linkType = this.model.get('attr').link_type;
			if( linkType == 'Rectangle' || _.isUndefined(linkType))
			{

				this.$el.resizable({
					handles: 'all',
					stop : function()
					{
						var attr = {
							'width' : $(this).width() / $(this).parent().width() * 100,
							'height' : $(this).height() / $(this).parent().height() * 100
						};
						console.log('save attr', attr);
						_this.model.update(attr);
					}
				});
			}
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
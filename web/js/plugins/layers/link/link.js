/************************************

	LINK LAYER CHILD CLASS

************************************/
(function(Layer){

	Layer.Link = Layer.Model.extend({

		layerType : 'Link',
		layerPanel : $('#links-list'),
		hasControls : false,
		defaultControls : false,
		scalable : true,
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
			'width' : 50,
			'opacity' : 1,
			'opacity_hover' : 1,
			'blink_on_start' : true,
			'glow_on_hover' : true
		}
		
	});
	
	Layer.Views.Controls.Link = Layer.Views.Controls.extend({
		
		render : function()
		{
			var linkTypeSelect = new Layer.Views.Lib.LinkTypeSelect({
				model: this.model,
				label : 'Link Type'
			});

			var opacitySlider = new Layer.Views.Lib.Slider({
				property : 'opacity',
				model: this.model,
				label : 'Opacity',
				step : 0.01,
				min : 0,
				max : 1
			});

			var hoverOpacitySlider = new Layer.Views.Lib.Slider({
				property : 'opacity_hover',
				model: this.model,
				label : 'Opacity on Hover',
				step : 0.01,
				min : 0,
				max : 1
			});

			var blinkOnStart = new Layer.Views.Lib.Checkbox({
				property : 'blink_on_start',
				model: this.model,
				label : 'Blink layer when frame plays'
			});

			var glowOnHover = new Layer.Views.Lib.Checkbox({
				property : 'glow_on_hover',
				model: this.model,
				label : 'Layer glows on hover'
			});
			
			$(this.controls)
				.append( linkTypeSelect.getControl() )
				//.append( opacitySlider.getControl() )
				.append( hoverOpacitySlider.getControl() )
				//.append( blinkOnStart.getControl() )
				.append( glowOnHover.getControl() );
			
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

			this.$el.removeClass('link-arrow-right link-arrow-down link-arrow-up link-arrow-left');



			if( zeega.app.previewMode ) this.delegateEvents({'click':'goClick'});

			if(this.model.get('attr').link_type == 'arrow_left')
				this.$el.html( this.getTemplate() ).css( style ).addClass('link-arrow-left');
			else if(this.model.get('attr').link_type == 'arrow_right')
				this.$el.html( this.getTemplate() ).css( style ).addClass('link-arrow-right');
			else if(this.model.get('attr').link_type == 'arrow_up')
				this.$el.html( this.getTemplate() ).css( style ).addClass('link-arrow-up');
			else if(this.model.get('attr').link_type == 'arrow_down')
				this.$el.html( this.getTemplate() ).css( style ).addClass('link-arrow-down');

			if( this.model.get('attr').glow_on_hover ) this.$el.addClass('linked-layer-glow');

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
			'mousedown .show-controls' : 'showControls',
			'mouseover' : 'onMouseOver',
			'mouseout' : 'onMouseOut'
		},

		onMouseOver : function()
		{
			this.$el.stop().fadeTo( 500, this.model.get('attr').opacity_hover );
		},

		onMouseOut : function()
		{
			this.$el.stop().fadeTo( 500, this.model.get('attr').opacity );
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
		
			this.makeResizable();
			this.delegateEvents();
		},

		makeResizable : function()
		{
			var _this = this;
			var linkType = this.model.get('attr').link_type;

			this.$el.resizable({
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
		},
		
		onPlay : function()
		{
			this.render();
			this.delegateEvents({
				'click':'goClick',
				'mouseover' : 'onMouseOver',
				'mouseout' : 'onMouseOut'
			})
		},
		
		getTemplate : function()
		{
			var html = '';
				if( !this.preview && !_.isNull( this.model.get('attr').to_sequence ) ) html += '<i class="icon-share go-to-sequence"></i>';		
			return html;
		}
		
		
	});
	
})(zeega.module("layer"));
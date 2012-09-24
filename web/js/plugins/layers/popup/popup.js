(function(Layer){

	Layer.Popup = Layer.Model.extend({
			
		layerType : 'Popup',

		hasControls : true,
		defaultControls : false,
		displayCitation : false,

		defaultAttributes : {
			'title' : 'Popup Layer',
			'url' : 'none',
			'left' : 0,
			'top' : 0,
			'height' : 25,
			'width' : 25,
			'opacity':1,
			'citation':false,
			'linkable' : false
		}

	});
	
	Layer.Views.Controls.Popup = Layer.Views.Controls.extend({
		
		render : function()
		{

			// needs two droppables
			// one for the popup item
			// one for the trigger image
			var popupContentDrop = new Layer.Views.Lib.Droppable({
				model: this.model,
				attribute: 'popup_content',
				label : 'Media to Show'
			});
			var popupTargettDrop = new Layer.Views.Lib.Droppable({
				model: this.model,
				attribute: 'popup_target',
				label : 'Media Target to Show'
			});
			var opacitySlider = new Layer.Views.Lib.Slider({
				property : 'opacity',
				model: this.model,
				label : 'Target Opacity',
				step : 0.01,
				min : 0,
				max : 1,
			});
			
			$(this.controls)
				.append( popupContentDrop.getControl() )
				.append( popupTargettDrop.getControl() )
				.append( opacitySlider.getControl() );
			return this;
		
		}
		
	});

	Layer.Views.Visual.Popup = Layer.Views.Visual.extend({
		
		draggable : true,
		
		template : '<a href="#"></a>',

		init : function()
		{
			//this.model.on('all', function(e){console.log('e',e)})
			this.model.on('update', this.onUpdate, this);
		},

		render : function()
		{
			this.$el.html( _.template(this.template, this.model.toJSON() ) )
				.css({
					height : this.model.get('attr').height +'%',
					'border' : 'none',
					'height' : this.model.get('attr').height +'%',
					'border-radius' : '0',
				});

			if( this.model.get('attr').popup_target )
			{
				this.$('a').html('<img src="'+ this.model.get('attr').popup_target.uri  +'" height="100%" width="100%"/>');
			}
			else
			{
				if(!zeega.app.previewMode )
				{
					this.$el.css({
						'width' : this.model.get('attr').width +'%',
						'border' : '2px dashed orangered',
						'border-radius' : '6px',
						'height' : '25%'
					})
				}
				else
				{
					this.$el.css({
						'width' : this.model.get('attr').width +'%',
						'border-radius' : '6px',
						'height' : '25%'
					})
				}

			}
			return this;
		},

		onUpdate : function()
		{
			this.$el.resizable('destroy');
			this.render();
			this.makeResizable();
		},

		makeResizable : function()
		{
			var _this = this;
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
		},

		events : {
			'click' : 'onClick'
		},

		onClick : function()
		{
			console.log('popup clicked');
			//launch overlay
			if( zeega.app.previewMode )
				this.popup = new Layer.Views.Visual.Popup.Modal({model:this.model});


			return false;
		},

		onLayerEnter: function()
		{
			this.makeResizable();

		},

		onExit : function()
		{
			if(this.popup) this.popup.cleanup()
		},
		
		onPreload : function()
		{
			
/*
			var img = this.$el.imagesLoaded();
			img.done(function(){
				_this.model.trigger('ready',_this.model.id);
			});
			img.fail(function(){
				_this.model.trigger('error',_this.model.id);
			});
*/
			this.model.trigger('ready',this.model.id);
		}
	});

	Layer.Views.Visual.Popup.Modal = Backbone.View.extend({
		className : 'popup-layer-modal',

		initialize : function()
		{

			var Model = Backbone.Model.extend();
			this.contentModel = new Model( this.model.get('attr').popup_content );
			this.contentModel.set('attr', this.model.get('attr').popup_content ); // redundant. this should be changed later


			console.log('popupview init', this)
			$('body').append(this.render().el)
			this.afterRender();
		},

		render : function()
		{
			console.log('render',this)
			var style = {
				//background: 'rgba(255,255,255,0.25)',
				width: '1000px',
				height: '500px',
				'z-index': 10000,
				position: 'relative',
				margin: '50px auto',
				overflow: 'hidden'
			};
			this.$el.html(this.template());
			console.log( this.template() );
			this.$('.popup-target').css(style);

			// image
			if(this.contentModel.get('media_type') == 'Image')
			{
				this.$('.popup-target').html('<img src="'+ this.contentModel.get('uri') +'" width="100%"/>');
			}
			// video
			else if(this.contentModel.get('media_type') == 'Video')
			{
				var Player = zeega.module('player');
				this.player = new Player.Views.Player({
					model: this.contentModel,
					control_mode : 'standard',
					media_target : '.popup-target'
				});
				this.player.model.on('ready', function(){_this.player.play()})
				//this.$('.popup-target').html('<img src="'+ this.contentModel.get('uri') +'"/>');
			}

			return this;
		},

		afterRender : function()
		{
			if(this.contentModel.get('media_type') == 'Video')
			{
				this.$('.popup-target').html( this.player.render().el );
				this.player.placePlayer();
			}
		},

		cleanup : function()
		{
			if(this.player)
			{
				this.player.pause();
				this.player.destroy();
			}
			this.remove();
		},

		events : {
			'click' : 'onClick'
		},

		onClick : function()
		{
			this.cleanup();
			this.remove();
			return false
		},

		template : function()
		{
			html = '<div class="popup-target"></div>';
			return html;

		}
	})

})(zeega.module("layer"));
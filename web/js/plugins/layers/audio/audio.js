(function(Layer){


	Layer.Audio = Layer.Video.extend();
	Layer.Views.Controls.Audio = Layer.Views.Controls.Video.extend({
		
			render : function()
			{

				var playbackControls = new Layer.Views.Lib.Playback({
					model : this.model
				});

				var volumeSlider = new Layer.Views.Lib.Slider({
					property : 'volume',
					model: this.model,
					label : 'Volume',
					min : 0,
					max : 1,
					step : 0.01,
					css : false
				});

				this.controls
					.append( playbackControls.getControl() )
					.append( volumeSlider.getControl() );
					
				return this;

			}
		
	});
	Layer.Views.Visual.Audio = Layer.Views.Visual.Video.extend({
		
		draggable : false,
		linkable : false,
		
		render : function()
		{
			return this;
		},
		
		onLayerEnter : function()
		{
			//if coming from another frame and the controls are open but the video isn't loaded
			if( this.model.controls.visible == true )
			{
				this.model.video.placeVideo( $(this.el) );
				this.model.loaded = true;
			}
		},
		
		onLayerExit : function()
		{
			if( this.model.video.isVideoLoaded )
			{
				this.model.video.destroy();
			} 
			this.model.loaded = false;
			
			//must call this if you extend onLayerExit
			this.model.trigger('editor_readyToRemove')
		},
		
		onControlsOpen : function()
		{
			console.log('video controls open : visual')
			var _this = this;
			if( !this.model.loaded )
			{
					this.model.video.on('video_canPlay', function(){ _this.model.trigger('video_ready', _this.model.id ) }, this )
					this.model.video.placeVideo( this.$el );
					this.model.loaded = true;
			}
			else
			{
				this.model.video.pop.pause();
			}
			
		
			//replace with the actual video object
		},
		
		onControlsClosed : function()
		{
			this.model.video.pop.pause();
		},
		
		onPreload : function()
		{
			var _this = this;
			if( !this.model.loaded )
			{
				this.model.video.placeVideo( $(this.el) );
				this.model.video.on('video_canPlay', function(){console.log('video ready player'); _this.model.trigger('ready', _this.model.id ) }, this )
				this.model.loaded = true;
			}
			else
			{
				this.model.video.pop.pause();
			}
		},
		
		onPlay : function()
		{
			this.model.video.pop.play();
		},
		
		onExit : function()
		{
			console.log('video pauseeee')
			this.model.video.pop.pause();
		},
		
		onUnrender : function()
		{
			this.model.video.pop.pause();
			//Popcorn.destroy(this.model.video.pop);	

		}
		
	});
/*
	Layer.Audio = Layer.Model.extend({
			
		layerType : 'Audio',

		defaultAttributes : 
		{
			'title' : 'Video Layer',
			'url' : 'none',
			'left' : 0,
			'top' : 0,
			'height' : 100,
			'width' : 100,
			'volume' : 0.5,
			'in'  : 0,
			'out' : 0,
			'opacity':1,
			'dimension':1.5,
			'citation':true,
		},

		init : function()
		{
			console.log('AUDIO INIT')
			//load popcorn object
			this.video = new Plyr2({
				uri : this.get('attr').uri,
				id : this.id
			})
		}

	});
	
	Layer.Views.Controls.Audio = Layer.Views.Controls.extend({
				
		render : function()
		{
			
			var playbackControls = new Layer.Views.Lib.Playback({
				model : this.model
			});
			
			var volumeSlider = new Layer.Views.Lib.Slider({
				property : 'volume',
				model: this.model,
				label : 'Volume',
				min : 0,
				max : 1,
				step : 0.01,
				css : false
			});
			
			this.controls
				.append( playbackControls.getControl() )
				.append( volumeSlider.getControl() );
			
			return this;
		
		}
	
	});

	Layer.Views.Visual.Audio = Layer.Views.Visual.extend({
		
		draggable : true,
		linkable : true,
		
		render : function()
		{
			return this;
		},
		
		onLayerEnter : function()
		{
			//if coming from another frame and the controls are open but the video isn't loaded
			if( this.model.controls.visible == true )
			{
				this.model.video.placeVideo( this.$el );
				this.model.loaded = true;
			}
		},
		
		onLayerExit : function()
		{
			if( this.model.video.isVideoLoaded )
			{
				this.model.video.pop.pause();
				Popcorn.destroy(this.model.video.pop);	
			} 
			this.model.loaded = false;
			
			//must call this if you extend onLayerExit
			this.model.trigger('editor_readyToRemove')
		},
		
		onControlsOpen : function()
		{
			console.log('video controls open : visual')
			
			if( !this.model.loaded )
			{
				this.model.video.placeVideo( this.$el );
				this.model.loaded = true;
			}
			else
			{
				this.model.video.pop.pause();
			}
			
			this.model.trigger('video_ready');
			//replace with the actual video object
		},
		
		onControlsClosed : function()
		{
			this.model.video.pop.pause();
		},
		
		onPreload : function()
		{
			var _this = this;
			if( !this.model.loaded )
			{
				this.model.video.placeVideo( this.$el );
				this.model.video.on('video_canPlay', function(){ _this.model.trigger('ready', _this.model.id ) }, this )
				this.model.loaded = true;
			}
			else
			{
				this.model.video.pop.pause();
			}
		},
		
		onPlay : function()
		{
			this.model.video.pop.play();
		},
		
		onExit : function()
		{
			console.log('video pauseeee')
			this.model.video.pop.pause();
		},
		
		onUnrender : function()
		{
			this.model.video.pop.pause();
			Popcorn.destroy(this.model.video.pop);	

		}
		
	});
*/
})(zeega.module("layer"));
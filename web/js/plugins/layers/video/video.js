(function(Layer){



	Layer.Video = Layer.Model.extend({
			
		layerType : 'Video',

		defaultAttributes : 
		{
			'title' : 'Video Layer',
			'url' : 'none',
			'left' : 0,
			'top' : 0,
			'height' : 100,
			'width' : 100,
			'volume' : 0.5,
			'cue_in'  : 0,
			'cue_out' : 0,
			'opacity':1,
			'dimension':1.5,
			'citation':true,
		},

		init : function()
		{
			console.log(this.get('attr'));
			console.log(this);
			if( _.isUndefined(this.get('attr').attribution_uri)) this.set({attribution_uri:this.get('attribution_url')});
			this.video = new Plyr2({
				url : this.get('attr').attribution_uri,
				uri : this.get('attr').uri,
				id : this.id,
				cue_in  : this.get('attr').cue_in,
				cue_out : this.get('attr').cue_out,
				volume : this.get('attr').volume,
			})
		}

	});
	
	Layer.Views.Controls.Video = Layer.Views.Controls.extend({
				
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
			
			var widthSlider = new Layer.Views.Lib.Slider({
				property : 'width',
				model: this.model,
				label : 'Width',
				suffix : '%',
				min : 1,
				max : 200,
			});
			
			var heightSlider = new Layer.Views.Lib.Slider({
				property : 'height',
				model: this.model,
				label : 'Height',
				suffix : '%',
				min : 1,
				max : 200,
			});
			
			var opacitySlider = new Layer.Views.Lib.Slider({
				property : 'opacity',
				model: this.model,
				label : 'Opacity',
				step : 0.01,
				min : .05,
				max : 1,
			});
			
			this.controls
				.append( playbackControls.getControl() )
				.append( volumeSlider.getControl() )
				.append( widthSlider.getControl() )
				.append( heightSlider.getControl() )
				.append( opacitySlider.getControl() );
			
			return this;
		
		}
	
	});

	Layer.Views.Visual.Video = Layer.Views.Visual.extend({
		
		draggable : true,
		linkable : true,
		
		render : function()
		{
			var img = $('<img>')
				.attr('id', 'video-player-'+ this.model.id)
				.attr('src', this.attr.thumbnail_url)
				.css({'width':'100%'});

			$(this.el).html( img ).css('height', this.attr.height+'%');
			
			//this.model.trigger('ready',this.model.id)
			
			return this;
		},
		
		
		onLayerEnter : function()
		{
			//if coming from another frame and the controls are open but the video isn't loaded
			if( this.model.controls.visible == true )
			{
				this.$el.find('img').remove();
				this.model.video.placeVideo( this.$el );
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
			this.model.video.on('timeupdate', function(){ 
				if(Math.abs(_this.model.video.pop.volume()-_this.model.get('attr').volume)>.01)_this.model.video.pop.volume(_this.model.get('attr').volume);
				
				if( _this.model.get('attr').cue_out != 0 && _this.model.video.pop.currentTime() > _this.model.get('attr').cue_out )
				{
					
					_this.model.video.pop.currentTime( _this.model.get('attr').cue_in );
					_this.model.video.pop.pause();
					_this.model.trigger('playback_ended');
					console.log('playback ended');
				}
				
			}, this )
			
			
			var _this = this;
			if( !this.model.loaded )
			{
				this.model.video.placeVideo( this.$el );
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
			this.model.video.play();
		},
		
		onExit : function()
		{
			this.model.video.pause();
		},
		
		onUnrender : function()
		{
			this.model.video.pause();
			//Popcorn.destroy(this.model.video.pop);	

		}
		
	});
	
	Layer.Youtube = Layer.Video.extend();
	Layer.Views.Controls.Youtube = Layer.Views.Controls.Video.extend();
	Layer.Views.Visual.Youtube = Layer.Views.Visual.Video.extend();
	
	Layer.Vimeo = Layer.Video.extend();
	Layer.Views.Controls.Vimeo = Layer.Views.Controls.Video.extend();
	Layer.Views.Visual.Vimeo = Layer.Views.Visual.Video.extend();

})(zeega.module("layer"));
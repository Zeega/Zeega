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
			'fade_in' : 0,
			'fade_out' : 0,
			'dissolve': false,
			'opacity':1,
			'dimension':1.5,
			'citation':true,
		},

		init : function()
		{
			console.log(this.get('attr'));
			console.log(this);
			
			this.video = new Plyr2({
				url : this.get('attr').attribution_uri,
				uri : this.get('attr').uri,
				id : this.id,
				cue_in  : this.get('attr').cue_in,
				cue_out : this.get('attr').cue_out,
				fade_in  : this.get('attr').fade_in,
				fade_out : this.get('attr').fade_out,
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
			
			
			var fadeInSlider = new Layer.Views.Lib.Slider({
				property : 'fade_in',
				model: this.model,
				label : 'Fade In',
				min : 0,
				max :5,
				step : 0.1,
				css : false
			});
			
			
			var fadeOutSlider = new Layer.Views.Lib.Slider({
				property : 'fade_out',
				model: this.model,
				label : 'Fade Out',
				min : 0,
				max : 5,
				step : 0.1,
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
				.append( fadeInSlider.getControl() )
				.append( fadeOutSlider.getControl() )
				.append( opacitySlider.getControl() );
			
			return this;
		
		}
	
	});

	Layer.Views.Visual.Video = Layer.Views.Visual.extend({
		
		draggable : true,
		linkable : true,
		
		render : function()
		{
			if(this.model.get('attr').dissolve ||true) $(this.el).css({opacity:0});
			var img = $('<img>')
				.attr('id', 'video-player-'+ this.model.id)
				.attr('src', this.attr.thumbnail_url)
				.css({'width':'100%'});

			$(this.el).html( img ).css('height', this.attr.height+'%');
			
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
				this.model.video.pause();
			}
			
		
			//replace with the actual video object
		},
		
		onControlsClosed : function()
		{
			this.model.video.pause();
		},
		
		onPreload : function()
		{
			var _this=this;
			this.model.video.on('timeupdate', function(){_this.onTimeUpdate()}, this )

			if( !this.model.loaded ){
				this.model.video.placeVideo( this.$el );
				this.model.video.on('video_canPlay', function(){console.log('video ready player'); _this.model.trigger('ready', _this.model.id ) }, this )
				this.model.loaded = true;
			}
			else{
				this.model.video.pause();
			}
		},
		
		onTimeUpdate : function(){
			
			
			
			//Cue Out
			if( this.model.get('attr').cue_out != 0 && this.model.video.currentTime() > this.model.get('attr').cue_out )
			{
				this.model.video.currentTime( this.model.get('attr').cue_in );
				this.model.video.pause();
				this.model.trigger('playback_ended');
				console.log('playback ended');
			}
			
			
			
			//Fades
			
			if(this.model.get('attr').cue_out==0) var out = this.model.video.duration();
			else var out = this.model.get('attr').cue_out;
			var t = this.model.video.currentTime();
			var f = parseFloat(this.model.get('attr').cue_in)+parseFloat(this.model.get('attr').fade_in);
			var g = out-parseFloat(this.model.get('attr').fade_out);
			
			if(this.model.get('attr').fade_in>0 && t<f){
				
				//console.log("fading in");
				var vol =this.model.get('attr').volume*(1.0-((f-t)/this.model.get('attr').fade_in)*((f-t)/this.model.get('attr').fade_in));
				this.model.video.volume(vol);
			}
			else if(this.model.get('attr').fade_out>0 && t>g){
			
				//console.log("fading out");
				var vol =this.model.get('attr').volume*(1.0-((t-g)/this.model.get('attr').fade_out))*(1.0-((t-g)/this.model.get('attr').fade_out));
				this.model.video.volume(vol);
			}
			else if(Math.abs(this.model.get('attr').volume-this.model.video.volume())>.01){
				this.model.video.volume(this.model.get('attr').volume);
				
			}
			else console.log('all is good',this.model.video.volume())
			
			//Dissolve
			
			/*
			
			if(this.model.get('attr').dissolve||true){
			
				if(this.model.video.currentTime()-this.model.get('attr').cue_in<1.0){
					var op = parseFloat(this.model.video.currentTime()-this.model.get('attr').cue_in);
					this.$el.css({opacity:op});
				}
				
				else if(out-this.model.video.currentTime()<1.0){
					var op = Math.max(0,parseFloat(out-this.model.video.currentTime()));
					this.$el.css({opacity:op});
				}
			
			}
			
			*/
			
			
			
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
			Popcorn.destroy(this.model.video);	

		}
		
	});
	
	Layer.Youtube = Layer.Video.extend();
	Layer.Views.Controls.Youtube = Layer.Views.Controls.Video.extend();
	Layer.Views.Visual.Youtube = Layer.Views.Visual.Video.extend();
	
	Layer.Vimeo = Layer.Video.extend();
	Layer.Views.Controls.Vimeo = Layer.Views.Controls.Video.extend();
	Layer.Views.Visual.Vimeo = Layer.Views.Visual.Video.extend();

})(zeega.module("layer"));
(function(Layer){

	Layer.Video = Layer.Model.extend({
			
		layerType : 'Video',
		draggable : true,
		player_loaded : false,
		scalable : true,
		visual : true,

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
			'cue_out' : null,
			'fade_in' : 0,
			'fade_out' : 0,
			'dissolve': false,
			'opacity':1,
			'dimension':1.5,
			'citation':true,
		},

		init : function()
		{
			this.initPlayer()
		},
		
		initPlayer : function()
		{
			var ct = '#media-controls-'+this.id;
			var Player = zeega.module('player');
			this.player = new Player.Views.Player({
				model:this,
				control_mode : 'editor',
				media_target : '#layer-visual-'+this.id,
				controls_target : ct
			});
		},
		
		initPlayerPlayer : function()
		{
			console.log('init player player')
			var Player = zeega.module('player');
			this.player = new Player.Views.Player({
				model:this,
				control_mode : 'none',
				media_target : '#layer-visual-'+ this.id
			});
		}

	});
	
	Layer.Views.Controls.Video = Layer.Views.Controls.extend({
				
		render : function()
		{
			var _this = this;
			var playbackControls = new Layer.Views.Lib.Target({
				model : this.model
			});
			
			var volumeSlider = new Layer.Views.Lib.Slider({
				property : 'volume',
				model: this.model,
				label : 'Volume',
				min : 0,
				max : 1,
				step : 0.01,
				css : false,
				onSlide : function()
				{
					this.model.player.popcorn.volume( volumeSlider.getValue() )
				}
			});
			
			var fadeInSlider = new Layer.Views.Lib.Slider({
				property : 'fade_in',
				model: this.model,
				label : 'Fade In (sec)',
				min : 0,
				max :5,
				step : 0.1,
				css : false
			});
			
			var fadeOutSlider = new Layer.Views.Lib.Slider({
				property : 'fade_out',
				model: this.model,
				label : 'Fade Out (sec)',
				min : 0,
				max : 5,
				step : 0.1,
				css : false
			});
			
			var loopCheck = new Layer.Views.Lib.Checkbox({
					property : 'loop',
					model: this.model,
					label : 'Loop'
				});
			
			
			var audioLabel = new Layer.Views.Lib.SectionLabel({label:'Audio'})
			
			this.controls
				.append( loopCheck.getControl() )
				.append( playbackControls.getControl() )
				.append( audioLabel.getControl() )
				.append( volumeSlider.getControl() )
				.append( fadeInSlider.getControl() )
				.append( fadeOutSlider.getControl() );
				
			
			return this;
		
		}
	
	});

	Layer.Views.Visual.Video = Layer.Views.Visual.extend({
		
		draggable : true,
		linkable : true,
		
		render : function()
		{
			/*
			var img = $('<img>')
				.attr('id', 'video-player-'+ this.model.id)
				.attr('src', this.attr.thumbnail_url)
				.css({'width':'100%'});

			$(this.el).html( img ).css('height', this.attr.height+'%');
			*/
			$(this.el).html("").css({
				'background':'url("'+this.attr.thumbnail_url+'") no-repeat center center fixed',
				'-webkit-background-size': 'cover',
				'-moz-background-size': 'cover',
				'background-size': 'cover',
				'height':this.model.get('attr').height+'%',
				'background-attachment': 'scroll'
			});
			
	
			return this;
		},
		
		onLayerEnter : function(){},
		
		onLayerExit : function()
		{
			console.log('@@@		on layer exit')
			if( this.model.player_loaded ) this.model.player.destroy();
			this.model.player_loaded = false;
			
			//must call this if you extend onLayerExit
			this.model.trigger('editor_readyToRemove')
		},
		
		onControlsOpen : function()
		{
			console.log('video controls open : visual')
			var _this = this;
			if( !this.model.player_loaded )
			{
				this.model.initPlayer();
				this.$el.html(this.model.player.render().el);
				this.model.player.placePlayer();
				console.log('on controls open',this, this.model.player)
				
				this.model.player_loaded = true;
			}
			else
			{
				this.model.player.pause();
			}
			
		
			//replace with the actual video object
		},
		
		onControlsClosed : function()
		{
			this.model.player.pause();
		},
		
		onPreload : function()
		{
			var _this = this;
			
			if( !this.model.player_loaded )
			{
				this.model.initPlayerPlayer();

				this.$el.html( this.model.player.render().el );
				this.model.player.placePlayer();
				
				var _this = this;
				this.model.player.popcorn.listen('timeupdate',function(){ _this.onTimeUpdate() })
				
				this.model.player_loaded = true;
			}
			else
			{
				this.model.player.pause();
			}
			
		},
		onEnded : function()
		{
			this.onPause();
		},
		
		onTimeUpdate : function()
		{
			//Fades
			
			if(this.model.get('attr').cue_out==0) var out = this.model.player.getDuration();
			else var out = this.model.get('attr').cue_out;
			var t = this.model.player.getCurrentTime();
			var f = parseFloat(this.model.get('attr').cue_in)+parseFloat(this.model.get('attr').fade_in);
			var g = out-parseFloat(this.model.get('attr').fade_out);
			
			
			if(this.model.get('attr').fade_in>0 && t<f)
			{
				var vol =this.model.get('attr').volume*(1.0-((f-t)/this.model.get('attr').fade_in)*((f-t)/this.model.get('attr').fade_in));
				this.model.player.setVolume(vol);
			}
			
			else if(this.model.get('attr').fade_out>0 && t>g)
			{
				var vol =this.model.get('attr').volume*(1.0-((t-g)/this.model.get('attr').fade_out))*(1.0-((t-g)/this.model.get('attr').fade_out));
				this.model.player.setVolume(vol);
			}
			else if(Math.abs(this.model.get('attr').volume-this.model.player.getVolume())>.01)
			{
				this.model.player.setVolume(this.model.get('attr').volume);
			}
			
			
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
			var _this=this;
			var playSuccessCounter = 0;

			this.playing=true;
			this.model.player.play();

			if(this.selfCheck) this.destroySelfCheck();
			this.selfCheck=setInterval(function(){
				if(_this.playing&&_this.model.player.paused()){
					_this.model.player.play();
					_this.destroySelfCheck();
				}
				else
				{
					playSuccessCounter++;
					if(playSuccessCounter>25) _this.destroySelfCheck();
				}
			},100);
		},

		destroySelfCheck: function()
		{
			clearInterval(this.selfCheck);
		},

		onPause : function()
		{
			this.playing=false;
			this.model.player.pause();
		},
		
		onExit : function()
		{
			clearInterval(this.selfCheck);
			this.playing=false;
			this.model.player.pause();
		},
		
		onUnrender : function()
		{
			
			this.model.player.pause();
			this.model.destroy();	
		}
		
	});
	
	Layer.Youtube = Layer.Video.extend();
	Layer.Views.Controls.Youtube = Layer.Views.Controls.Video.extend();
	Layer.Views.Visual.Youtube = Layer.Views.Visual.Video.extend();
	
	Layer.Vimeo = Layer.Video.extend();
	Layer.Views.Controls.Vimeo = Layer.Views.Controls.Video.extend();
	Layer.Views.Visual.Vimeo = Layer.Views.Visual.Video.extend();

})(zeega.module("layer"));
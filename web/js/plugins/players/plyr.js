(function(Player) {

	Player.Views = Player.Views || {};

	Player.Views.Player = Backbone.View.extend({
		
		className : 'media-player-container',
		
		defaults : {
			control_mode : 'none', // none / simple / standard / editor
			control_fade : true,
			
			media_target : null,
			controls_target : null,
			
			autoplay : false,
			cue_in : 0,
			cue_out : null,
			volume : .5,
			fade_in :0,
			fade_out : 0,
		},
		
		initialize : function(options)
		{
						
			if(!_.isUndefined(this.model))
			{
				//_.extend( this.defaults, this.options );
				//if there is a model then figure out what kind it is
				if( !_.isUndefined(this.model.get('uri')) )
				{
					// it must be from an item
					this.format = this.getFormat(this.model.get('attribution_uri'));
					this.settings = _.defaults( _.extend(this.model.attributes, this.options) , this.defaults);
				}
				else if( this.model.get('attr') && this.model.get('attr').uri )
				{
					//it must be from a layer
					this.format = this.getFormat(this.model.get('attr').attribution_uri);
					this.settings = _.defaults( _.extend(this.model.attributes.attr, this.options), this.defaults );
					this.settings.id = this.model.id;
				}
				else
				{
					console.log('I dont know what kind of media this is :(');
				}
			}
			
			this.model.on('pause_play', this.playPause, this);
			
		},
		
		render : function()
		{
			this.$el.css({ 'width':'100%', 'height':'100%'}); // move this to the CSS !!!  .media-player-container{ height, width}
			// choose which template to use
			var format = this.templates[this.format] ? this.format : 'default';
			console.log('template', _.template( this.templates[format](), this.settings ))
			this.$el.html( _.template( this.templates[format](), this.settings ));
			
			
			
			
			//attach controls. is this the right place?
			this.controls = new Player.Views.Player.Controls[this.settings.control_mode]({
				model:this.model,
				detached_controls : !_.isNull(this.settings.controls_target)
			});
			//draw the controls
			if( _.isNull(this.settings.controls_target) ) this.$el.append( this.controls.render().el );
			else $( this.settings.controls_target ).html( this.controls.render().el )
			console.log('## controls', this.settings.controls_target, this, this.controls, this.controls.el)
			return this;
		},
		
		placePlayer : function()
		{
			if( !this.isVideoLoaded)
			{
				var _this = this;
				console.log('format',this.format)
				switch( this.format )
				{
					case 'html5':
						if (BrowserDetect.browser == 'Firefox') this.useFlash();
						else this.useHTML5();
						break;
					case 'flashvideo':
						this.useFlash();
						break;
					case 'youtube':
						this.useYoutube();
						break;
					case 'vimeo':
						this.useVimeo();
						break;
					default:
						console.log('none set');
				}

				this.initPopcornEvents();

				this.isVideoLoaded = true;
				this.$el.spin('tiny');
			}
		},
		
		initPopcornEvents : function()
		{
			if(this.popcorn)
			{
				var _this = this;
				this.popcorn.listen('canplay',function(){
					_this.private_onCanPlay();
					_this.onCanplay();
				})
				
				this.popcorn.listen('timeupdate',function(){ _this.private_onTimeUpdate() })
			}
		},
		
		addPopcornToControls : function()
		{
			if(this.controls && this.popcorn && this.settings.control_mode != 'none' )
			{
				this.controls.addPopcorn( this.popcorn );
			}
		},
		
		useHTML5 : function()
		{
			console.log('add html5 popcorn, target', this, '#media-player-html5-'+ this.model.id, $('#media-player-html5-'+ this.model.id) )
			var _this = this;
			var target = '#media-player-html5-'+ this.model.id;
			
			this.popcorn = Popcorn( target );
			this.addPopcornToControls();
			this.setVolume(0);
		
			this.popcorn.listen( 'canplay', function(){
			
				_this.$el.spin(false);
				if( _this.settings.fade_in == 0 ) _this.setVolume( _this.settings.volume );
				if( _this.settings.cue_in != 0 )
				{
					this.listen('seeked',function(){
						_this.model.can_play = true;
						_this.model.trigger('ready', _this.model.id ) ;
					});
					_this.setCurrentTime( _this.settings.cue_in );
				}
				else
				{
					_this.model.can_play = true;
					_this.model.trigger('ready', _this.model.id ) ;
				}
			});
		},
		useYoutube : function()
		{
			console.log('add YOUTUBE to this shizzzz', this.model)
			
			var _this = this;
			var target = '#media-player-'+ this.model.id;
			var src = this.model.get('attr').attribution_uri;
			
			//this.pop = Popcorn.youtube('#zvideo-'+ this.id, this.get('url'),{volume:this.get('volume'), cue_in:this.get('cue_in')} );
			
			this.popcorn = Popcorn.youtube( target, src, {volume:_this.settings.volume * 100, cue_in:_this.settings.cue_in} );
			this.addPopcornToControls();
			this.setVolume(0);

			this.popcorn.listen('canplaythrough',function(){
				_this.$el.spin(false);
				
				_this.model.can_play = true;
				_this.model.trigger('ready', _this.model.id ) ;
				
				_this.popcorn.play();
				_this.popcorn.pause();
				
				if(_this.model.get('attr').fade_in==0) _this.volume(_this.model.get('attr').volume);
			});
			
		},
		useFlash : function()
		{
			var _this = this;
			var target = '#media-player-'+ this.model.id;
			var src = this.model.get('attr').uri;
			
			this.popcorn = Popcorn.flashvideo( target, src, {volume:_this.settings.volume, cue_in:_this.settings.cue_in} );
			
			this.popcorn.listen('loadeddata',function(){
				_this.$el.spin(false);
				
				_this.model.can_play = true;
				_this.model.trigger('ready', _this.model.id ) ;
				
				if(_this.model.get('attr').fade_in==0) _this.volume(_this.model.get('attr').volume);
			});
		},

		useVimeo : function()
		{
			this.popcorn = Popcorn.vimeo('#media-player-'+ this.model.id, this.get('url') );
			this.popcorn.listen('loadeddata',function(){
				_this.trigger('video_canPlay');
				_this.popcorn.currentTime(_this.get('cue_in'));
			});
		},
		private_onCanPlay : function()
		{
			this.model.set('duration', this.popcorn.duration() );
			if( _.isNull(this.model.get('cue_out')) ) this.model.set('cue_out', this.popcorn.duration() );
			
		},
		onCanplay : function()
		{
			if(this.settings.autoplay && this.popcorn) this.popcorn.play();
		},
		
		// getters && setters //
		
		setVolume : function(vol)
		{
			// constrain volume to 0 < v < 1
			var volume = vol < 0 ? 0 : vol;
			var volume = vol > 1 ? 1 : vol;
			if( _.isNumber(vol) ) this.popcorn.volume( volume );
		},
		getVolume : function(){ return this.popcorn.volume() },

		setCurrentTime : function(t){ if( _.isNumber(t) )  this.popcorn.currentTime(t) },
		getCurrentTime : function(){ return this.popcorn.currentTime() },

		private_onTimeUpdate : function()
		{
			// pause if player gets to the cue out point
			if( !_.isNull(this.settings.cue_out) && this.popcorn.currentTime() >= this.settings.cue_out )
			{
				this.pause();
				this.popcorn.currentTime( this.settings.cue_in )
			}
		},

		getDuration: function(){ return this.popcorn.duration() },

		play : function(){ console.log('##		play'); if( this.popcorn && this.popcorn.paused() ) this.popcorn.play() },
		pause : function(){ if( this.popcorn && !this.popcorn.paused() ) this.popcorn.pause() },
		playPause : function()
		{
			console.log('##		playpause')
			if(this.popcorn)
			{
				if(this.popcorn.paused()) this.popcorn.play();
				else this.popcorn.pause();
			}
		},
		
		destroy : function()
		{
			if(this.popcorn)
			{
				console.log('##		destroy',this.popcorn, this.el)
				this.popcorn.pause();
				
				Popcorn.destroy( this.popcorn );
				//this.popcorn.destroy();
			}
		},
		
		getFormat : function(url)
		{
			console.log('get format',url)
			//separated to make it easier to isolate and update this list
			var format = '';
			if( url.match(/^http:\/\/(?:www\.)?youtube.com\/watch\?(?=.*v=\w+)(?:\S+)?$/) ) format = 'youtube'
			else if ( url.match(/^http:\/\/(?:www\.)?vimeo.com\/(.*)/) ) format = 'vimeo'
			else format = 'html5';
			//Force flash for html5 in Firefox browser
			if( navigator.userAgent.split(' ')[navigator.userAgent.split(' ').length-1].split('/')[0] == 'Firefox' && format=='html5' ) format='flashvideo';
			return format;
		},
		
		
		templates : {
			
			html5 : function()
			{
				html =
				"<div id='media-player-<%= id %>' class='media-container'><video id='media-player-html5-<%= id %>' class='media-element media-type-<%= media_type %>' src='<%= uri %>'></video></div>";
				return html;
			},
			
			flashvideo : function()
			{
				html =
				"<div id='media-player-<%= id %>' class='media-container' style='width:100%;height:100%;'></div>";
				return html;
			},

			default : function()
			{
				html =
				"<div id='media-player-<%= id %>' class='media-container'></div>";
				return html;
			}
			
		}
		
	})
	
	
	/*****************************
	
		CONTROLS
		
	*****************************/
	
	Player.Views.Player.Controls = Player.Views.Player.Controls || {};
	
	Player.Views.Player.Controls.none = Backbone.View.extend({
		className : 'controls playback-controls controls-none',
		item_mode : false,
		
		initialize : function()
		{
			console.log('controls init',this)
			if(this.options.detached_controls) this.$el.addClass('playback-layer-controls')
			if(this.model.get('uri')) this.item_mode = true;
			this.init();
		},
		
		init : function(){}
	})
	
	Player.Views.Player.Controls.simple = Player.Views.Player.Controls.none.extend({
		
		className : 'controls playback-controls controls-simple',
		
		addPopcorn : function(pop)
		{
			this.popcorn = pop;
			this.initPopcornEvents();
		},
		
		initPopcornEvents : function()
		{
			var _this = this;
			this.popcorn.listen('canplay',function(){ _this.onCanPlay() });
			this.popcorn.listen('canplaythrough',function(){ _this.onCanPlay() });
			this.popcorn.listen('ended',function(){ _this.onEnded() });
			this.popcorn.listen('playing',function(){ _this.onPlaying() });
			this.popcorn.listen('pause',function(){ _this.onPause() });
		},
		
		render : function()
		{
			this.$el.html( this.getTemplate() );
			return this;
		},
		
		events : {
			'click' : 'playPause',
			'mouseover' : 'onMouseover',
			'mouseout' : 'onMouseout',
		},
		
		onCanPlay : function()
		{
			this.updatePlayPauseIcon();
			this.updateCues();
		},
		
		updateCues : function()
		{
			console.log('update cues',this, this.item_mode, this.model.get('cue_in') )
			this.cueIn = this.item_mode == true ? this.model.get('cue_in') : this.model.get('attr').cue_in;
			this.cueOut = (this.item_mode == true ? this.model.get('cue_out') : this.model.get('attr').cue_out) || this.duration;
		},
		
		playPause : function()
		{
			
			if(this.popcorn)
			{
				if(this.popcorn.paused()) this.popcorn.play();
				else this.popcorn.pause();
				this.updatePlayPauseIcon();
			}
			return false;
		},
		
		updatePlayPauseIcon : function()
		{
			if(this.popcorn)
			{
				if( !this.popcorn.paused() ) this.$el.find('.pause-play i').addClass('icon-pause').removeClass('icon-play');
				else this.$el.find('.pause-play i').removeClass('icon-pause').addClass('icon-play');
			}
		},
		
		onPlaying : function()
		{
			// fade out after play
			if( this.model.get('control_fade') ){ this.setFadeTimeout() };
			this.updatePlayPauseIcon();
			this.updatePlayPauseIcon();
		},
		
		setFadeTimeout : function()
		{
			var _this = this;
			if(this.timer) clearTimeout(_this.timer);
			this.timer = setTimeout( function(){
				_this.fadeOutControls();
				clearTimeout(_this.timer);
			}, 3500);
		},
		
		onMouseover : function()
		{
			if(this.model.get('control_fade') && !this.popcorn.paused() )
			{
				if(this.timer) clearTimeout( this.timer );
				this.fadeInControls();
			}
		},
		onMouseout : function()
		{
			if(this.model.get('control_fade') && !this.popcorn.paused() )
				this.setFadeTimeout();
		},
		
		fadeOutControls : function()
		{
			if(this.$el.find('.player-control-inner').is(':visible') && !this.popcorn.paused()) this.$el.find('.player-control-inner').fadeOut('slow')
		},
		fadeInControls : function()
		{
			if(this.$el.find('.player-control-inner').is(':hidden')) this.$el.find('.player-control-inner').fadeIn('fast')
		},
		
		onPause : function()
		{
			if(this.timer) clearTimeout( this.timer );
			// make sure  controls are visible
			this.fadeInControls();
			this.updatePlayPauseIcon();
		},
		
		onEnded : function()
		{
			this.$el.find('.pause-play i').addClass('icon-play').removeClass('icon-pause');
		},
		
		getTemplate : function()
		{
			var html =
			
			"<div class='player-control-inner'><a href='#' class='pause-play pull-left'><i class='icon-pause icon-white'></i></a></div>";
			
			return html;
		}
	})
	
	Player.Views.Player.Controls.standard = Player.Views.Player.Controls.simple.extend({
		
		isSeeking : false,
		
		className : 'controls playback-controls controls-standard',
		
		addPopcorn : function(pop)
		{
			this.popcorn = pop;
			this.initPopcornEvents();
		},
		
		initPopcornEvents : function()
		{
			var _this = this;
			this.popcorn.listen('canplay',function(){ _this.onCanPlay() });
			this.popcorn.listen('ended',function(){ _this.onEnded() });
			this.popcorn.listen('timeupdate',function(){ _this.updateElapsed() });
			this.popcorn.listen('playing',function(){ _this.onPlaying() });
			this.popcorn.listen('pause',function(){ _this.onPause() });
			//this.popcorn.listen('progress',function(){ console.log( 'buffered',_this.popcorn.buffered(), _this.popcorn.buffered().end(0) ) })
		},
		
		events : {
			'click .pause-play' : 'playPause',
			'mouseover' : 'onMouseover',
			'mouseout' : 'onMouseout',
		},
		
		onCanPlay : function()
		{
			this.updateDuration();
			this.updateCues();
			this.updatePlayPauseIcon();
			
			this.initScrubber();
		},
		
		initScrubber : function()
		{
			var _this = this;
			this.$el.find('.media-scrubber').slider({
				range: 'min',
				min: 0,
				max : this.duration,
				
				slide : function(e,ui){ _this.scrub( ui.value ) },
				stop : function(e,ui){ _this.seek(ui.value) }
			})
		},
		
		updateDuration : function()
		{
			this.duration = this.popcorn.duration();
			this.$el.find('.media-time-duration').html( convertTime(this.duration) );
		},
		updateElapsed : function()
		{
			console.log('update elapsed', this.popcorn.currentTime())
			var elapsed = this.popcorn.currentTime();
			this.$el.find('.media-time-elapsed').html( convertTime( elapsed ) );
			this.$el.find('.media-scrubber').slider('value', elapsed);
		},
		
		scrub : function( time )
		{
			var _this = this;
			this.isSeeking = true;

		},
		seek : function( time )
		{
			console.log('## seek to: ',time, this.cueIn,this.cueOut)
			var wasPlaying = !this.popcorn.paused();
			if(wasPlaying) this.popcorn.pause();

			if( time < this.cueIn )
			{
				this.$el.find('.media-scrubber').slider('value',this.cueIn);
				time = this.cueIn;
			}
			else if( time > this.cueOut )
			{
				this.$el.find('.media-scrubber').slider('value',this.cueOut);
				time = this.cueOut;
			}
			else
			{
				this.$el.find('.media-scrubber').slider('value',time);
			}
			
			console.log('## seek to: ',time, 'was playing?',!this.popcorn.paused())

			this.popcorn.currentTime(time);
			if(wasPlaying) this.popcorn.play();
		},
		
		getTemplate : function()
		{
			var html =
			"<div class='player-control-inner'>"+
				"<div class='media-scrubber'></div>"+
				"<div class='control-panel-inner'>"+
					"<a href='#' class='pause-play pull-left'><i class='icon-pause icon-white'></i></a>"+
					"<div class='pull-right'><span class='media-time-elapsed'>0:00</span> / <span class='media-time-duration'>0:00</span></div>"+
				"</div>"+
			"</div>";
			
			return html;
		}
	})
	
	Player.Views.Player.Controls.editor = Player.Views.Player.Controls.standard.extend({
		
		className : 'controls playback-controls controls-editor',
		
		initPopcornEvents : function()
		{
			var _this = this;
			this.popcorn.listen('canplay',function(){ _this.onCanPlay() });
			this.popcorn.listen('canplaythrough',function(){ _this.onCanPlay() });
			this.popcorn.listen('ended',function(){ _this.onEnded() });
			this.popcorn.listen('timeupdate',function(){ _this.updateElapsed() });
			this.popcorn.listen('playing',function(){ _this.onPlaying() });
			this.popcorn.listen('pause',function(){ _this.onPause() });
			//this.popcorn.listen('progress',function(){ console.log( 'buffered',_this.popcorn.buffered(), _this.popcorn.buffered().end(0) ) })
		},
		
		events : {
			'click .pause-play' : 'playPause',
			'mouseover' : 'onMouseover',
			'mouseout' : 'onMouseout',
			'mousedown .progress-outer' : 'scrub',
		},
		
		onCanPlay : function()
		{
			this.updateDuration();
			this.updateCues();
			this.updatePlayPauseIcon();
			
			this.initScrubber();
			this.initCropTool();
		},
		
		updateDuration : function()
		{
			this.duration = this.popcorn.duration();
			this.$el.find('.media-time-duration').html( convertTime(this.duration) );
		},
		updateElapsed : function()
		{
			var elapsed = this.popcorn.currentTime();
			this.$el.find('.media-time-elapsed').html( convertTime( elapsed ) );
			this.$el.find('.media-scrubber').slider('value', elapsed);
			if(elapsed >= this.cueOut) this.popcorn.pause();
		},
		
		initCropTool : function()
		{
			var _this = this;
			
			//this.cueIn = this.item_mode ? this.model.get('cue_in') : this.model.get('attr').cue_in;
			//this.cueOut = (this.item_mode ? this.model.get('cue_out') : this.model.get('attr').cue_out) || this.duration;
			
			this.$el.find('.crop-time-left .time').text( convertTime( this.cueIn ) );
			this.$el.find('.crop-time-right .time').text( convertTime( this.cueOut ) );
			
			this.$el.find('.crop-slider').slider({
				range:true,
				min:0,
				max:_this.duration,
				values : [ _this.cueIn , _this.cueOut ],
				slide : function(e,ui){ _this.onCropSlide(e,ui) },
				stop : function(e,ui){ _this.onCropStop(e,ui) }
			})
			
			this.$el.find('.crop-time-left .time').unbind('keypress').keypress(function(e){
				if((e.which >= 48 && e.which <= 58) || e.which == 13)
				{
					switch(e.which)
					{
						case 13:
							var sec = _this.convertToSeconds($(this).text());
							console.log('seconds', sec)
							if(sec === false)
							{
								$(this).text( convertTime(_this.model.get('cue_in')) )
							
							}
							else
							{

								sec = sec < 0 ? 0 : sec;
								sec = sec > _this.model.get('cue_out') ? _this.model.get('cue_out') : sec;
								$(this).text( convertTime(sec) )
								_this.$el.find('.crop-slider').slider('values',0, sec );
								_this.cueIn =sec;
								_this.model.update({ 'cue_in' : sec })
								_this.seek( sec );
							}
							this.blur();
							return false;
							break;
					}
				}
				else return false;
			})
			this.$el.find('.crop-time-right .time').unbind('keypress').keypress(function(e){
				if((e.which >= 48 && e.which <= 58) || e.which == 13)
				{
					switch(e.which)
					{
						case 13:
							var sec = _this.convertToSeconds( $(this).text() );
						
							if(sec === false)
							{
								$(this).text( convertTime(_this.model.get('cue_out')) )
							}
							else
							{
								sec = sec > _this.duration ? _this.duration : sec;
								sec = sec < _this.model.get('cue_in') ? _this.model.get('cue_in') : sec;
								$(this).text( convertTime(sec) )
								_this.$el.find('.crop-slider').slider('values',1, sec );
								_this.cueOut = sec;
								_this.seek( Math.max(sec-5,_this.cueIn) );
								_this.model.update({ 'cue_out' : sec });
							}
							this.blur();
							return false;
							break;
					}
				}
				else return false;
			})
		},
		
		convertToSeconds : function( string )
		{
			var st = string.split(/:/);
			var flag = false;
			var sec = 0;
			
			_.each( st.reverse(), function(number,i){
				if(number.length > 2)
				{
					flag = true;
					return false;
				}
				else
				{
					var num = parseInt(number);
					if( !_.isNumber(num) )
					{
						flag = true;
						return false;
					}
					else
					{
						if(i) sec += num * i * 60;
						else sec += num;
					}
				}
			})
			if( flag ) return false;
			else return sec;
		},
		
		onCropSlide : function(e,ui)
		{
			this.$el.find('.crop-time-left .time').html( convertTime(ui.values[0]) );
			this.$el.find('.crop-time-right .time').html( convertTime(ui.values[1]) );
		},
		
		onCropStop : function(e,ui)
		{
			this.cueIn = ui.values[0];
			this.cueOut = ui.values[1];
			
			if( !this.item_mode)
			{
				this.model.update({
					'cue_in' : ui.values[0],
					'cue_out' : ui.values[1]
				})
			}

			this.popcorn.pause();
			this.seek( ui.values[0] );
		},
		
		getTemplate : function()
		{
			var html =
			"<div class='player-control-inner'>"+
			
				"<div class='crop-wrapper'>"+
					"<div class='crop-time-values clearfix'><span class='crop-time-left'>in [<span class='time' contenteditable='true'>0:00</span>]</span><span class='crop-time-right'>out [<span class='time' contenteditable='true'>0:00</span>]</span></div>"+
					"<div class='crop-slider'></div>"+
				"</div>"+
				
				"<div class='media-scrubber'></div>"+
			
				"<div class='control-panel-inner'>"+
					"<a href='#' class='pause-play pull-left'><i class='icon-play icon-white'></i></a>"+
					"<div class='pull-right'><span class='media-time-elapsed'>0:00</span> / <span class='media-time-duration'>0:00</span></div>"+
				"</div>"+
			
			"</div>";
			
			return html;
		}
	})

})(zeega.module("player"));

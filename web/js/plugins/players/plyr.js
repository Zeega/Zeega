(function(Player) {

	Player.Views = Player.Views || {};

	Player.Views.Player = Backbone.View.extend({
		
		className : 'media-player-container',
		
		defaults : {
			control_mode : 'editor', // none / simple / standard / editor
			control_fade : true,
			
			autoplay : false,
			cue_in : 0,
			cue_out : 150,
			volume : .5,
			fade_in :0,
			fade_out : 0,
		},
		
		initialize : function(options)
		{
			console.log('new player init', this)
			if(!_.isUndefined(this.model))
			{
				//if there is a model then figure out what kind it is
				if( !_.isUndefined(this.model.get('uri')) )
				{
					// it must be from an item
					this.format = this.getFormat(this.model.get('uri'));
					this.settings = _.defaults( this.model.attributes, this.defaults );
				}
				else if( this.model.get('attr') && this.model.get('attr').uri )
				{
					//it must be from a layer
					console.log('this media is from a layer')
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
			// choose which template to use
			var format = this.templates[this.format] ? this.format : 'default';
			this.$el.html( _.template( this.templates[format](), this.model.toJSON() ));

			console.log('controls type', this.settings.control_mode)

			this.controls = new Player.Views.Player.Controls[this.settings.control_mode]({model:this.model});
			this.$el.append( this.controls.render().el );
			
			return this;
		},
		
		placePlayer : function()
		{
			if( !this.isVideoLoaded)
			{
				var _this = this;

				switch( this.format )
				{
					case 'html5':
						this.useHTML5();
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
				
				this.popcorn.listen('timeupdate', function(){
					_this.trigger('timeupdate');
					_this.trigger('timeupdate_controls');
				});

				this.isVideoLoaded = true;
				this.$el.spin('tiny');
			}
		},
		
		initPopcornEvents : function()
		{
			if(this.popcorn)
			{
				var _this = this;
				this.popcorn.listen('canplay',function(){ _this.onCanplay() })
			}
		},
		
		addPopcornToControls : function()
		{
			if(this.controls && this.popcorn && this.settings.control_mode != 'none' ) this.controls.addPopcorn( this.popcorn )
		},
		
		useHTML5 : function()
		{
			var _this = this;
			this.popcorn = Popcorn('#media-player-html5-'+ this.model.id);
			this.addPopcornToControls();
			this.setVolume(0);
			this.popcorn.listen( 'canplay', function(){
				_this.$el.spin(false);

				//if( _this.settings.fade_in == 0 ) _this.setVolume( _this.settings.volume ); // commented out temporarily
				if( _this.settings.cue_in != 0 )
				{
					this.listen('seeked',function(){ _this.model.trigger('video_canPlay', this.model.id) });
					_this.setCurrentTime( _this.settings.cue_in );
					console.log( 'seeking to: ' +_this.settings.cue_in );
				}
				else _this.trigger('video_canPlay');
			});
		},
		useFlash : function()
		{
			this.popcorn = Popcorn.flashvideo('#media-player-'+ this.model.id, this.get('uri'),{volume:this.get('volume'), cue_in:this.get('cue_in')}  );
			this.popcorn.listen('loadeddata',function(){
				_this.popcorn.volume(_this.get('volume'));
				_this.trigger('video_canPlay');
				_this.popcorn.currentTime(_this.get('cue_in'));
			});
		},
		useYoutube : function()
		{
			console.log(_this.get('volume'));
			this.popcorn = Popcorn.youtube('#media-player-'+ this.model.id, this.get('url'),{volume:this.get('volume'), cue_in:this.get('cue_in')} );
			this.popcorn.listen('canplaythrough',function(){
				console.log(_this.get('volume'));
				_this.popcorn.play();
				_this.popcorn.pause();
				if(_this.get('fade_in')==0) _this.popcorn.volume(_this.get('volume'));
				console.log( _this.get('control_mode'));
				_this.trigger('video_canPlay');
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

		getDuration: function(){ return this.popcorn.duration() },

		play : function(){ if( this.popcorn && this.popcorn.paused() ) this.popcorn.play() },
		pause : function(){ if( this.popcorn && !this.popcorn.paused() ) this.popcorn.pause() },
		playPause : function()
		{
			if(this.popcorn)
			{
				if(this.popcorn.paused()) this.popcorn.play();
				else this.popcorn.pause();
			}
		},
		
		removePlayer : function()
		{
			if(this.popcorn) this.popcorn.destroy();
		},
		
		getFormat : function(url)
		{
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

			default : function()
			{
				html =
				"<div id='media-player-<%= id %>' class='media-container'></div>";
				return html;
			}
			
		}
		
	})
	
	Player.Views.Player.Controls = Player.Views.Player.Controls || {};
	
	Player.Views.Player.Controls.none = Backbone.View.extend({
		className : 'controls controls-none',
	})
	
	Player.Views.Player.Controls.simple = Player.Views.Player.Controls.none.extend({
		
		className : 'controls controls-simple',
		
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
		
		className : 'controls controls-standard',
		
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
			'mousedown .progress-outer' : 'scrub',
		},
		
		onCanPlay : function()
		{
			this.updateDuration();
			this.updatePlayPauseIcon();
		},
		
		updateDuration : function()
		{
			this.$el.find('.media-time-duration').html( convertTime(this.popcorn.duration()) );
		},
		updateElapsed : function()
		{
			var elapsed = this.popcorn.currentTime();
			this.$el.find('.media-time-elapsed').html( convertTime( elapsed ) );
			if( !this.isSeeking) this.$el.find('.progress-elapsed').css({'width': (100 * elapsed/this.popcorn.duration()) +'%'})
		},
		
		scrub : function(e)
		{
			var _this = this;
			this.isSeeking = true;
			_this.$el.find('.progress-elapsed').css({
				width : ((e.pageX - this.$el.find('.progress-outer').offset().left) / this.$el.find('.progress-outer').width() * 100) +"%"
			})
			$(window).mousemove(function(evt){
				_this.$el.find('.progress-elapsed').css({
					width : ((evt.pageX-_this.$el.find('.progress-outer').offset().left) / _this.$el.find('.progress-outer').width() * 100) +"%"
				})
			})
			
			$(window).mouseup(function(e){ _this.seek(e) })
		},
		seek : function(e)
		{
			var duration = this.popcorn.duration();
			var wasPlaying = !this.popcorn.paused();
			this.isSeeking = false;

			$(window).unbind('mouseup');
			$(window).unbind('mousemove');
			
			var newPos = this.$el.find('.progress-elapsed').width() / this.$el.find('.progress-outer').width() * duration;
			newPos = newPos < 0 ? 0 : newPos;
			newPos = newPos > duration ? duration : newPos;
			
			if(wasPlaying) this.popcorn.pause();
			this.popcorn.currentTime(newPos);
			if(wasPlaying) this.popcorn.play();
		},
		
		
		getTemplate : function()
		{
			var html =
			"<div class='player-control-inner'>"+
				"<div class='progress-outer'><div class='progress-elapsed'></div></div>"+
				"<div class='control-panel-inner'>"+
					"<a href='#' class='pause-play pull-left'><i class='icon-pause icon-white'></i></a>"+
					"<div class='pull-right'><span class='media-time-elapsed'>0:00</span> / <span class='media-time-duration'>0:00</span></div>"+
				"</div>"+
			"</div>";
			
			return html;
		}
	})
	
	Player.Views.Player.Controls.editor = Player.Views.Player.Controls.standard.extend({
		
		className : 'controls controls-editor',
		
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
			'mousedown .progress-outer' : 'scrub',
		},
		
		onCanPlay : function()
		{
			this.updateDuration();
			this.updatePlayPauseIcon();
			
			this.initCropTool();
		},
		
		updateDuration : function()
		{
			this.$el.find('.media-time-duration').html( convertTime(this.popcorn.duration()) );
		},
		updateElapsed : function()
		{
			var elapsed = this.popcorn.currentTime();
			this.$el.find('.media-time-elapsed').html( convertTime( elapsed ) );
			if( !this.isSeeking) this.$el.find('.progress-elapsed').css({'width': (100 * elapsed/this.popcorn.duration()) +'%'})
		},
		
		initCropTool : function()
		{
			var _this = this;
			this.$el.find('.crop-marker-left, .crop-marker-right').draggable({
				axis : 'x',
				containment : 'parent',
				
				drag : function(e,ui)
				{
					console.log('drag')
					_this.onCropDrag(e,ui);
				},
				
				stop : function(e,ui)
				{
					console.log('stopped dragging')
					_this.onCropStop(e,ui);
				}
			})
		},
		
		onCropDrag : function(e,ui)
		{
			
		},
		
		onCropStop : function(e,ui)
		{
			
		},
		
		scrub : function(e)
		{
			var _this = this;
			this.isSeeking = true;
			_this.$el.find('.progress-elapsed').css({
				width : ((e.pageX - this.$el.find('.progress-outer').offset().left) / this.$el.find('.progress-outer').width() * 100) +"%"
			})
			$(window).mousemove(function(evt){
				_this.$el.find('.progress-elapsed').css({
					width : ((evt.pageX-_this.$el.find('.progress-outer').offset().left) / _this.$el.find('.progress-outer').width() * 100) +"%"
				})
			})
			
			$(window).mouseup(function(e){ _this.seek(e) })
		},
		seek : function(e)
		{
			var duration = this.popcorn.duration();
			var wasPlaying = !this.popcorn.paused();
			this.isSeeking = false;

			$(window).unbind('mouseup');
			$(window).unbind('mousemove');
			
			var newPos = this.$el.find('.progress-elapsed').width() / this.$el.find('.progress-outer').width() * duration;
			newPos = newPos < 0 ? 0 : newPos;
			newPos = newPos > duration ? duration : newPos;
			
			if(wasPlaying) this.popcorn.pause();
			this.popcorn.currentTime(newPos);
			if(wasPlaying) this.popcorn.play();
		},
		
		
		getTemplate : function()
		{
			var html =
			"<div class='player-control-inner'>"+
			
				"<div class='crop-outer'>"+
					"<div class='crop-marker crop-marker-left'><span class='crop-hash'></span><span class='crop-arrow'></span><span class='crop-time'>0:00</span></div>"+
					"<div class='crop-marker crop-marker-right'><span class='crop-hash'></span><span class='crop-arrow'></span><span class='crop-time'>0:00</span></div>"+
				"</div>"+
				
				"<div class='progress-outer'><div class='progress-elapsed'></div></div>"+
			
				"<div class='control-panel-inner'>"+
					"<a href='#' class='pause-play pull-left'><i class='icon-pause icon-white'></i></a>"+
					"<div class='pull-right'><span class='media-time-elapsed'>0:00</span> / <span class='media-time-duration'>0:00</span></div>"+
				"</div>"+
			
			"</div>";
			
			return html;
		}
	})

})(zeega.module("player"));



/*************************************************************************************************************************************

*
**
**
**
**
**
**
**
**
**
**
**
**
**
*


*************************************************************************************************************************************/




var Plyr2 = Backbone.Model.extend({
	
	defaults : {
		id : 0,
		uri : 'http://www.youtube.com/watch?v=dQw4w9WgXcQ&ob=av3e',
		control_mode : 'standard', // standard / editor / none
		autoplay : true,
		cue_in : 0,
		cue_out : 150,
		volume : .5,
		fade_in :0,
		fade_out : 0,
		video_target : null, // element id
		controls_target : null, // element id
	},
	
	initialize : function( options )
	{
		//set video format type
		this.set(options);
		console.log(this);
		this.set( 'format', this.getFormat(this.get('url')) );
	},
	
	getFormat : function(url)
	{
		//separated to make it easier to isolate and update this list
		var format = '';
		if( url.match(/^http:\/\/(?:www\.)?youtube.com\/watch\?(?=.*v=\w+)(?:\S+)?$/) ) format = 'youtube'
		else if ( url.match(/^http:\/\/(?:www\.)?vimeo.com\/(.*)/) ) format = 'vimeo'
		else format = 'html5';
		//Force flash for html5 in Firefox browser
		if( navigator.userAgent.split(' ')[navigator.userAgent.split(' ').length-1].split('/')[0] == 'Firefox' && format=='html5' ) format='flashvideo';
		return format;
	},
	
	placeVideo : function( el ){
		if( !this.isVideoLoaded)
		{
			var _this = this;
			
			el.empty().prepend( this.getVideoView().el )
		
			switch( this.get('format') )
			{
				case 'html5':
					this.pop = Popcorn('#zvideo-'+ this.id);
					this.volume(0);
					
					
						
					this.pop.listen( 'canplay', function(){
						if(_this.get('fade_in')==0) _this.pop.volume(_this.get('volume'));
						if(_this.get('cue_in')!=0) {
							_this.pop.listen('seeked',function(){
							
								_this.trigger('video_canPlay');
							});
						
							_this.pop.currentTime(_this.get('cue_in'));
							console.log('seeking to: ' +_this.get('cue_in'));
						
						}
						else _this.trigger('video_canPlay');
						
						
						
						
						
					});
					break;
				case 'flashvideo':
					this.pop = Popcorn.flashvideo('#zvideo-'+ this.id, this.get('uri'),{volume:this.get('volume'), cue_in:this.get('cue_in')}  );
					this.pop.listen('loadeddata',function(){
						_this.pop.volume(_this.get('volume'));
						_this.trigger('video_canPlay');
						_this.pop.currentTime(_this.get('cue_in'));
					});
					break;
				case 'youtube':
					console.log(_this.get('volume'));
					this.pop = Popcorn.youtube('#zvideo-'+ this.id, this.get('url'),{volume:this.get('volume'), cue_in:this.get('cue_in')} );
					this.pop.listen('canplaythrough',function(){
						console.log(_this.get('volume'));
						_this.pop.play();
						_this.pop.pause();
						if(_this.get('fade_in')==0) _this.pop.volume(_this.get('volume'));
						console.log( _this.get('control_mode'));
						_this.trigger('video_canPlay');
					});
					break;
				case 'vimeo':
					this.pop = Popcorn.vimeo('#zvideo-'+ this.id, this.get('url') );
					this.pop.listen('loadeddata',function(){
						
						_this.trigger('video_canPlay');
						_this.pop.currentTime(_this.get('cue_in'));
					});
					break;
				default:
					console.log('none set');
				
			}
			
			this.pop.listen('timeupdate', function(){
				_this.trigger('timeupdate');
				_this.trigger('timeupdate_controls');
			});
			
			
			this.isVideoLoaded = true;
			
		}
	},
	

	
	getVideoView : function(){
		
		var Video = Backbone.View.extend({
			
			className : 'plyr-video',
			
			initialize : function()
			{
				this.render();
			},
			
			render : function()
			{
				if( this.model.get('format') == 'html5') this.el = $('<video class="'+ this.className +'">');
				if( this.model.get('format') == 'html5') $(this.el).attr({ 'id' : 'zvideo-'+ this.model.id, 'src' : this.model.get('uri') });
				else $(this.el).attr( 'id' , 'zvideo-'+ this.model.id);
				
				$(this.el).css('position', 'absolute');
				return this;
			}
			
		});
		
		return new Video({model:this});
	},
	
	destroy : function(){
		this.isVideoLoaded=false;
		this.pop.pause();
		Popcorn.destroy(this.pop);
		
	},
	
	
	volume : function(vol){
	
		if(_.isNumber(vol)&&vol<=1) this.pop.volume(Math.max(0,vol));
		else return this.pop.volume();
	},
	
	currentTime : function(t){
		if(_.isNumber(t))  this.pop.currentTime(t);
		else return this.pop.currentTime();
	},
	
	play : function(){
		if(this.pop&&this.pop.paused()){
			this.pop.play();
		}
	},
	
	pause : function(){
	
		if(this.pop&&!this.pop.paused()){
			this.pop.pause();

		}
	},
	
	duration: function(){
	
		return this.pop.duration();
	}
	
	
})



var Plyr = Class.extend({
	init : function(id,args)
	{
		this.id = id;
		this.url = args['url'];
		this.format = args['format'];
		this.wrapper = $('#'+this.id);
		this.seeking = false;
		if("controls" in args) this.controls = args['controls'];
		else this.controls = 1;
		
		if("controlsType" in args) this.controlsType = args['controlsType'];
		else this.controlsType = 'standard';
		
		if("controlsId" in args) this.controlsWrapper  = $('#'+args['controlsId']);
		else this.controlsWrapper = this.wrapper;
		
		if("cueIn" in args) this.cueIn  = args['cueIn'];
		else this.cueIn  = 50;
		
		if("cueOut" in args) this.cueOut  = args['cueOut'];
		else this.cueOut  = 150;
		
		if("volume" in args) this.volume  = args['volume'];
		else this.volume  = 1;
	
	
		if(this.controls==1){
			if(this.controlsType =='standard'){		
				this.controlsWrapper.append($('<div>').attr('id','plyr-standard')
				.append($('<div>').addClass('plyr-controls-wrapper').addClass('plyr-controls-wrapper')
					.append($('<div>').addClass('plyr-controls')
					.append($('<div>').addClass('plyr-button-wrapper').append($('<div>').addClass('plyr-button').addClass('plyr-play')))
					.append($('<div>').addClass('plyr-time'))
					.append($('<div>').addClass('plyr-timeline').append($('<div>').addClass('plyr-scrubber'))))
			));
			}else if(this.controlsType == 'editor'){
				
				this.controlsWrapper.append($('<div>').attr({id:'plyr-editor'})
					.append($('<div>').addClass('plyr-controls-wrapper')
					.append($('<div>').addClass('plyr-time-wrapper')
						.append($('<div>').addClass('plyr-cuein-time'))
						.append($('<div>').addClass('plyr-cueout-time'))
					
					)
					.append($('<div>').addClass('plyr-timeline-wrapper')
					.append($('<div>').addClass('plyr-button-wrapper').append($('<div>').addClass('plyr-button').addClass('plyr-play')))
					.append($('<div>').addClass('plyr-timeline')
						.append($('<div>').addClass('plyr-cuein-bar').addClass('plyr-bar'))
						.append($('<div>').addClass('plyr-time-bar').addClass('plyr-bar'))
						.append($('<div>').addClass('plyr-cueout-bar').addClass('plyr-bar'))
						.append($('<div>').addClass('plyr-cuein-scrubber').addClass('plyr-edit-scrubber')
							.append($('<div>').addClass('plyr-scrubber-select'))
							.append($('<div>').addClass('plyr-arrow-down-green'))
						)
						.append($('<div>').addClass('plyr-scrubber').addClass('plyr-edit-scrubber')
							.append($('<div>').addClass('plyr-hanging-box'))
							
						)
						
					
						.append($('<div>').addClass('plyr-cueout-scrubber').addClass('plyr-edit-scrubber')
							.append($('<div>').addClass('plyr-scrubber-select'))
							.append($('<div>').addClass('plyr-arrow-down'))
						)
						
						)
					
					)
					.append($('<div>').addClass('plyr-time-wrapper')
						.append($('<span>').addClass('plyr-time'))
					)
				
				.append($('<div>').attr({id:'plyr-volume'}))
				)
			);
				
	
	
	
			}
		}
		
		var _this=this;

		if(this.url.match(/^http:\/\/(?:www\.)?youtube.com\/watch\?(?=.*v=\w+)(?:\S+)?$/)) this.format = 'youtube'
		else if (this.url.match(/^http:\/\/(?:www\.)?vimeo.com\/(.*)/)) this.format = 'vimeo'
		else this.format ='html5';
		
		//Force flash for html5 in Firefox browser
		
		if(navigator.userAgent.split(' ')[navigator.userAgent.split(' ').length-1].split('/')[0]=='Firefox'&&this.format=='html5') this.format='flashvideo';
		
		
		var _this=this;
		
		
		this.displayControls=function(){
			if(this.cueOut==0) _this.cueOut=_this.pop.duration();
			
			//	_this.pop.currentTime(Math.floor(parseFloat(ui.position.left)*_this.pop.duration()/parseFloat(_this.controlsWrapper.find('.plyr-timeline').width())));
				
			
			_this.controlsWrapper.find('.plyr-cuein-scrubber').css({'left':parseFloat(this.cueIn)*_this.controlsWrapper.find('.plyr-timeline').width()/_this.pop.duration()});
			_this.controlsWrapper.find('.plyr-cuein-bar').css({'width':_this.controlsWrapper.find('.plyr-cuein-scrubber').css('left')});
				
			
			_this.controlsWrapper.find('.plyr-cueout-scrubber').css({'left':parseFloat(this.cueOut)*_this.controlsWrapper.find('.plyr-timeline').width()/_this.pop.duration()});
			
			_this.controlsWrapper.find('.plyr-cueout-bar').css({'width':parseInt(_this.controlsWrapper.find('.plyr-timeline').width())-parseInt(_this.controlsWrapper.find('.plyr-cueout-scrubber').css('left'))});
				
			_this.controlsWrapper.find('.plyr-cuein-time').html(convertTime(_this.cueIn,true));
			_this.controlsWrapper.find('.plyr-cueout-time').html(convertTime(_this.cueOut,true));
			_this.controlsWrapper.find('.plyr-controls-wrapper').fadeIn();
			
		}
		
		//Create Popcorn instance
		switch(this.format)
		{
			case 'html5':
			  this.wrapper.prepend($('<video>').addClass('plyr-video').attr({'src':this.url,'id':'z-'+this.id}));
			  this.pop = Popcorn('#z-'+this.id);
			  this.pop.listen('canplay',function(){ if(_this.controls==1)_this.displayControls();});
			  break;
			case 'flashvideo':
			  this.wrapper.prepend($('<div>').addClass('plyr-video').attr({'id':'z-'+this.id}));
			  this.pop = Popcorn.flashvideo('#z-'+this.id,this.url);
			  this.pop.listen('loadeddata',function(){ if(_this.controls==1)_this.displayControls();});
			  break;
			case 'youtube':
			  this.wrapper.prepend($('<div>').addClass('plyr-video').attr({'id':'z-'+this.id}));
			  this.pop = Popcorn.youtube('#z-'+this.id,this.url);
			  this.pop.listen('canplaythrough',function(){ _this.pop.play(); _this.pop.pause(); if(_this.controls==1) _this.displayControls();});
			 break;
			case 'vimeo':
			  this.wrapper.prepend($('<div>').addClass('plyr-video').attr({'id':'z-'+this.id}));
			  this.pop = Popcorn.vimeo('#z-'+this.id,this.url);
			  this.pop.listen('loadeddata',function(){ if(_this.controls==1)_this.displayControls();});
			 break;
			default:
			  console.log('none set');
		}
		
		//UX
		
		
		
		this.controlsWrapper.find('.plyr-button').click(function(){ _this.pop.volume(parseInt(_this.volume));if (_this.pop.paused()) _this.pop.play(); else _this.pop.pause();});
		
		if(this.controlsType=='standard'){
			this.controlsWrapper.find('.plyr-scrubber').draggable({axis:'x',containment: 'parent',stop: function(event, ui) {
				var newTime = Math.floor(parseFloat(_this.controlsWrapper.find('.plyr-scrubber').css('left'))*_this.pop.duration()/parseFloat(_this.controlsWrapper.find('.plyr-timeline').width()));
				_this.pop.trigger('timeupdate');
				_this.pop.currentTime(newTime);
				//_this.pop.play();
				
			},
			start:function(){
				_this.pop.pause();
			},
			drag:function(event, ui){
				var newTime = Math.floor(parseFloat(ui.position.left)*_this.pop.duration()/parseFloat(_this.controlsWrapper.find('.plyr-timeline').width()));	
				_this.controlsWrapper.find('.plyr-time').html(convertTime(newTime)+' / '+convertTime(_this.pop.duration()));
			}
		});
		
		}
		else if(this.controlsType=='editor')
		{
		// for editor controls
		// move to  playback controls
		
		

			this.controlsWrapper.find('.plyr-scrubber').draggable({
				axis:'x',
				containment: 'parent',
				stop: function(event, ui)
				{
				var newTime = Math.floor(parseFloat(_this.controlsWrapper.find('.plyr-scrubber').css('left'))*_this.pop.duration()/parseFloat(_this.controlsWrapper.find('.plyr-timeline').width()));
				if(newTime<_this.cueIn) newTime = _this.cueIn;
				else if(newTime>_this.cueOut) newTime = Math.max(parseFloat(_this.cueIn), parseFloat(_this.cueOut)-5.0);
				
				_this.pop.trigger('timeupdate');
				_this.pop.currentTime(newTime);
				//_this.pop.play();
				},
				start:function()
				{
					_this.pop.pause();
				},
				drag:function(event, ui)
				{
					var newTime = Math.floor(parseFloat(ui.position.left)*_this.pop.duration()/parseFloat(_this.controlsWrapper.find('.plyr-timeline').width()));	
					_this.controlsWrapper.find('.plyr-time').html(convertTime(newTime)+' / '+convertTime(_this.pop.duration()));
				}
		});
		this.controlsWrapper.find('.plyr-cuein-scrubber').draggable({axis:'x',containment: 'parent',stop: function(event, ui) {
				_this.controlsWrapper.find('.plyr-cuein-bar').css({'width':_this.controlsWrapper.find('.plyr-cuein-scrubber').css('left')});
				
				
				_this.pop.currentTime(Math.floor(parseFloat(ui.position.left)*_this.pop.duration()/parseFloat(_this.controlsWrapper.find('.plyr-timeline').width())));
				
				var left = parseFloat(_this.pop.currentTime())/parseFloat(_this.pop.duration())*100;
			_this.controlsWrapper.find('.plyr-scrubber').css({'left':left+'%'});
			_this.controlsWrapper.find('.plyr-time').html(convertTime(_this.pop.currentTime())+' / '+convertTime(_this.pop.duration()));
			_this.controlsWrapper.find('.plyr-time-bar').css({'width':left+'%'});
			},
			drag:function(event, ui){
				_this.cueIn = Math.floor(parseFloat(ui.position.left)*_this.pop.duration()/parseFloat(_this.controlsWrapper.find('.plyr-timeline').width()));	
				_this.controlsWrapper.find('.plyr-cuein-time').html(convertTime(_this.cueIn,true));
			}
		});
		this.controlsWrapper.find('.plyr-cueout-scrubber').draggable({axis:'x',containment: 'parent',stop: function(event, ui) {
			
				_this.controlsWrapper.find('.plyr-cueout-bar').css({'width':parseInt(_this.controlsWrapper.find('.plyr-timeline').width())-parseInt(_this.controlsWrapper.find('.plyr-cueout-scrubber').css('left'))});
				_this.pop.currentTime(Math.max(parseFloat(_this.cueIn), parseFloat(_this.cueOut)-5.0));
			},
			start:function(){
				_this.pop.pause();
			},
			drag:function(event, ui){
				_this.cueOut = Math.floor(parseFloat(ui.position.left)*_this.pop.duration()/parseFloat(_this.controlsWrapper.find('.plyr-timeline').width()));	
				_this.controlsWrapper.find('.plyr-cueout-time').html(convertTime(_this.cueOut,true));
			
			}
		});
	
		}
	
		this.controlsWrapper.find('#plyr-volume').slider({
				min : 0,
				max : 1,
				value :_this.volume,
				step : .1,
				slide: function(e,ui){
					_this.volume=ui.value
					_this.pop.volume(_this.volume);
				},
				stop : function(e, ui){
					
					//$('#player-'+_this._id).trigger('updated');
				}
		});
	
		
		
		//Add popcorn listeners
		
		
		
		this.pop.listen('loadedmetadata',function(){
		
			_this.controlsWrapper.find('.plyr-time').html(convertTime(_this.pop.currentTime())+' / '+convertTime(_this.pop.duration()));
			
		});
		this.pop.listen('timeupdate',function(){


			
			if(_this.pop.currentTime()>_this.cueOut) {
				_this.pop.pause();
				_this.pop.currentTime(_this.cueIn);
			}
		
			
			var left = parseFloat(_this.pop.currentTime())/parseFloat(_this.pop.duration())*100;
			_this.controlsWrapper.find('.plyr-scrubber').css({'left':left+'%'});
			_this.controlsWrapper.find('.plyr-time').html(convertTime(_this.pop.currentTime())+' / '+convertTime(_this.pop.duration()));
			_this.controlsWrapper.find('.plyr-time-bar').css({'width':left+'%'});
			
			
		});
		this.pop.listen('pause',function(){
			_this.controlsWrapper.find('.plyr-button').removeClass('plyr-pause').addClass('plyr-play');
		
		});
		this.pop.listen('play',function(){
			_this.controlsWrapper.find('.plyr-button').removeClass('plyr-play').addClass('plyr-pause');
		});
		this.pop.listen('seeking',function(){
		
			
		
		});
		this.pop.listen('seeked',function(){
			
			
			
			
		});
		this.pop.listen('ended',function(){
			
			this.currentTime(0);
		
		});
		this.pop.listen('loadeddata',function(){
		
		
		});
	},
	destroy: function(){
	
		Popcorn.destroy(this.pop);
	
	}
});

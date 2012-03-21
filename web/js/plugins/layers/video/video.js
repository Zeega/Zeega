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
			'in'  : 0,
			'out' : 0,
			'opacity':1,
			'dimension':1.5,
			'citation':true,
		},

		init : function(){},

		onControlsOpen : function()
		{
			//load popcorn object
			this.video = new Plyr2({
				url : this.get('attr').attribution_url,
				id : this.id
			})
			
			this.visual.$el.prepend( this.video.videoView );
			this.video.placeVideo();
		}


	});
	
	Layer.Views.Controls.Video = Layer.Views.Controls.extend({
				
		render : function()
		{
			var targetDiv = new Layer.Views.Lib.Target({
				idName : 'plyr-editor',
				className : 'plyr-controls-wrapper'
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
				.append( targetDiv.getControl() )
				.append( volumeSlider.getControl() )
				.append( widthSlider.getControl() )
				.append( heightSlider.getControl() )
				.append( opacitySlider.getControl() );
			
			return this;
		
		},
		
		onControlsOpen : function()
		{
			console.log('init video controls')
			var _this = this;
			this.$el.find('.plyr-controls-wrapper').html( this.getTemplate() );
			
			// attach control events after here -------
			
			this.$el.find('.plyr-button').click(function(){
				console.log( 'volume: '+ _this.model.get('attr').volume )
				_this.model.video.pop.volume( _this.model.get('attr').volume );
				if (_this.model.video.pop.paused()) _this.model.video.pop.play();
				else _this.model.video.pop.pause();
			});
			
			this.$el.find('.plyr-scrubber').draggable({
				
				axis:'x',
				containment: 'parent',
				
				start:function()
				{
					console.log('scrub start -- pause video')
					_this.model.video.pop.pause();
				},
				
				drag:function(event, ui)
				{
					console.log('scrub drag')
					var newTime = Math.floor(parseFloat(ui.position.left)*_this.model.video.pop.duration()/parseFloat(_this.$el.find('.plyr-timeline').width()));	
					_this.$el.find('.plyr-time').html( convertTime(newTime)+' / '+convertTime(_this.model.video.pop.duration()));
				},
				
				stop: function(event, ui)
				{
					console.log('scrub stop')
					
					var newTime = Math.floor(parseFloat(_this.$el.find('.plyr-scrubber').css('left'))*_this.model.video.pop.duration()/parseFloat(_this.$el.find('.plyr-timeline').width()));
					if( newTime < _this.attr.cue_in ) newTime = _this.attr.cue_in;
					else if( newTime > _this.attr.cue_out) newTime = Math.max(parseFloat(_this.attr.cue_in), parseFloat(_this.attr.cue_out)-5.0);
				
					_this.model.video.pop.trigger('timeupdate');
					_this.model.video.pop.currentTime( newTime );
					
					//_this.pop.play();
				}
			});
			
			this.$el.find('.plyr-cuein-scrubber').draggable({
				axis:'x',
				containment: 'parent',
				
				drag:function(event, ui)
				{
					_this.attr.cue_in = Math.floor( parseFloat(ui.position.left)*_this.model.video.pop.duration()/parseFloat(_this.$el.find('.plyr-timeline').width()));	
					_this.$el.find('.plyr-cuein-time').html( convertTime(_this.attr.cue_in,true) );
				},
				
				stop: function(event, ui)
				{
					
					_this.$el.find('.plyr-cuein-bar').css({'width':_this.$el.find('.plyr-cuein-scrubber').css('left')});
					_this.model.video.pop.currentTime( Math.floor(parseFloat(ui.position.left)*_this.model.video.pop.duration()/parseFloat(_this.$el.find('.plyr-timeline').width())));

					var left = parseFloat(_this.model.video.pop.currentTime()) / parseFloat( _this.model.video.pop.duration() ) * 100;
					_this.$el.find('.plyr-scrubber').css({'left':left+'%'});
					_this.$el.find('.plyr-time').html(convertTime(_this.model.video.pop.currentTime())+' / '+convertTime(_this.model.video.pop.duration()));
					_this.$el.find('.plyr-time-bar').css({'width':left+'%'});
				}
			});
			
			this.$el.find('.plyr-cueout-scrubber').draggable({
				axis:'x',
				containment: 'parent',
				
				start:function()
				{
					_this.model.video.pop.pause();
				},
				
				drag:function(event, ui)
				{
					_this.attr.cue_out = Math.floor(parseFloat(ui.position.left)*_this.model.video.pop.duration() / parseFloat( _this.$el.find('.plyr-timeline').width()));	
					_this.$el.find('.plyr-cueout-time').html(convertTime( _this.attr.cue_out,true));
				},
				
				stop: function(event, ui)
				{
					_this.$el.find('.plyr-cueout-bar').css({'width':parseInt(_this.$el.find('.plyr-timeline').width())-parseInt(_this.$el.find('.plyr-cueout-scrubber').css('left'))});
					_this.model.video.pop.currentTime(Math.max(parseFloat(_this.attr.cue_in), parseFloat(_this.attr.cue_out)-5.0));
				}
			});
			
			this.initListeners();
			
			
		},
		
		initListeners : function()
		{
			var _this = this;
			this.model.video.pop.listen('timeupdate', function(){

				if(_this.model.video.pop.currentTime() > _this.attr.cue_out )
				{
					_this.model.video.pop.pause();
					_this.model.video.pop.currentTime( _this.attr.cue_in );
				}
				
				var left = parseFloat( _this.model.video.pop.currentTime()) / parseFloat( _this.model.video.pop.duration() ) * 100;
				_this.$el.find('.plyr-scrubber').css({ 'left' : left+'%' });
				_this.$el.find('.plyr-time').html( convertTime( _this.model.video.pop.currentTime() )+' / '+convertTime( _this.model.video.pop.duration() ) );
				_this.$el.find('.plyr-time-bar').css({ 'width' : left+'%' });

			});
			this.model.video.pop.listen('pause',function(){
				_this.$el.find('.plyr-button').removeClass('plyr-pause').addClass('plyr-play');
			});
			
			this.model.video.pop.listen('play',function(){
				_this.$el.find('.plyr-button').removeClass('plyr-play').addClass('plyr-pause');
			});
			
			this.model.video.pop.listen('seeking',function(){});
			this.model.video.pop.listen('seeked',function(){});
			this.model.video.pop.listen('ended',function(){
				//this.currentTime(0);
			});
			this.model.video.pop.listen('loadeddata',function(){});
		},
		
		onControlsClosed : function()
		{
			console.log('video controls closed : controls')
		},
		
		getTemplate : function()
		{
			var html = 
			
			'<div class="plyr-time-wrapper">'+
				'<div class="plyr-cuein-time"></div>'+
				'<div class="plyr-cueout-time"></div>'+
			'</div>'+
			'<div class="plyr-timeline-wrapper">'+
				'<div class="plyr-button-wrapper">'+
					'<div class="plyr-button plyr-play"></div>'+
				'</div>'+
				'<div class="plyr-timeline">'+
					'<div class="plyr-cuein-bar plyr-bar"></div>'+
					'<div class="plyr-time-bar plyr-bar"></div>'+
					'<div class="plyr-cueout-bar plyr-bar"></div>'+
					'<div class="plyr-cuein-scrubber plyr-edit-scrubber">'+
						'<div class="plyr-scrubber-select"></div>'+
						'<div class="plyr-arrow-down-green"></div>'+
					'</div>'+
					'<div class="plyr-scrubber plyr-edit-scrubber">'+
						'<div class="plyr-hanging-box"></div>'+
					'</div>'+
					'<div class="plyr-cueout-scrubber plyr-edit-scrubber">'+
						'<div class="plyr-scrubber-select"></div>'+
						'<div class="plyr-arrow-down"></div>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="plyr-time-wrapper">'+
				'<span class="plyr-time"></span>'+
			'</div>';
			
			return html;
		}
		
	});

	Layer.Views.Visual.Video = Layer.Views.Visual.extend({
		
		draggable : true,
		linkable : true,
		
		render : function()
		{
			console.log(this.attr)
			var img = $('<img>')
				.attr('id', 'video-player-'+ this.model.id)
				.attr('src', this.attr.thumbnail_url)
				.css({'width':'100%'});

			$(this.el).html( img ).css('height', this.attr.height+'%');
			
			this.model.trigger('ready',this.model.id)
			
			return this;
		},
		
		onControlsOpen : function()
		{
			console.log('video controls open : visual')
			this.$el.find('img').remove();
			
			//replace with the actual video object
		},
		
		onControlsClosed : function()
		{
			console.log('video controls closed : visual')
		},
		
		unrender : function()
		{
			console.log('video unrender!')
			if(this.model.video) Popcorn.destroy(this.model.video.pop);
		},
		
	});
	
	Layer.Youtube = Layer.Video.extend();
	Layer.Views.Controls.Youtube = Layer.Views.Controls.Video.extend();
	Layer.Views.Visual.Youtube = Layer.Views.Visual.Video.extend();

})(zeega.module("layer"));
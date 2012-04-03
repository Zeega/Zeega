(function(Layer){

	Layer.Views.Lib = Backbone.View.extend({
		defaults : {},
		initialize : function( args )
		{
			this.settings = _.defaults( args, this.defaults );
			this.init();
			
			this.model.on('editor_controlsOpen', this.onControlsOpen, this);
			this.model.on('editor_controlsClosed', this.onControlsClosed, this);
			this.model.on('editor_layerEnter', this.onLayerEnter, this);
			this.model.on('editor_layerExit', this.onLayerExit, this);
		},
		
		init : function(){},
		getControl : function()
		{
			this.render();
			return this.el;
		},
		
		onControlsOpen : function(){},
		onControlsClosed : function(){},
		onLayerEnter : function(){},
		onLayerExit : function(){}
	});



/****************************

	DEFAULT CONTROLS
	
****************************/

	Layer.Views.Lib.ContinueToNextFrame = Layer.Views.Lib.extend({

		className : 'continue-to-next',

		render : function()
		{
			var button = '<button class="btn" style="width:100%">Continue on next frame</button>'
			$(this.el).append( button );
		},
		
		events : {
			'click' : 'continueLayerToNextFrame'
		},
		
		continueLayerToNextFrame : function()
		{
			this.$el.find('button').effect('highlight',{},2000);
			
			zeega.app.continueLayerToNextFrame( this.model.id )
		}
		
	});
	
	Layer.Views.Lib.ContinueOnAllFrames = Layer.Views.Lib.extend({

		className : 'continue-to-next',

		render : function()
		{
			var button = '<button class="btn" style="width:100%">Continue on all frames</button>'
			$(this.el).append( button );
		},
		
		events : {
			'click' : 'continueOnAllFrames'
		},
		
		continueOnAllFrames : function()
		{
			if( this.$el.find('button').hasClass('active') )
				this.$el.find('button').removeClass('active btn-warning');
			else
				this.$el.find('button').addClass('active btn-warning');
			
			this.$el.find('button').effect('highlight',{},2000);
			
			console.log( 'continue layer on all frames!: '+ this.model.id );
			zeega.app.continueOnAllFrames( this.model );
		}
		
	});
	
	Layer.Views.Lib.Link = Layer.Views.Lib.extend({

		className : 'link-controls',

		render : function()
		{
			var link = this.model.get('attr').link || '';
			$(this.el).append( _.template( this.getTemplate(), {link:link} ) );
		},
		
		events : {
			'click .remove-link' : 'clearLink',
			'focus input' : 'focusInput',
			'blur input'	: 'updateLink', 
		},
		
		clearLink : function()
		{
			this.$el.find('input').val('');
			this.updateLink();
			return false;
		},
		
		focusInput : function()
		{
			var _this = this;
			this.$el.find('input').keypress(function(e){
				if( e.which == 13 )
				{
					_this.updateLink();
					this.blur();
					return false;
				}
			})
		},
		
		updateLink : function()
		{
			this.$el.find('input').unbind('keypress');
			var fieldValue = this.$el.find('input').val();
			if( fieldValue != this.model.get('attr').link )
			{
				this.$el.find('input, .add-on').effect('highlight',{},2000);
				this.model.update({ link : fieldValue })
			}
		},

		getTemplate : function()
		{
			html =
			
				'<div class="input-prepend">'+
					'<span class="add-on">http://</span>'+
					'<input class="span2" type="text" placeholder="www.example.com" value="<%= link %>">'+
					'<a href="#" class="remove-link">&times;</span>'
				'</div>';
				
			return html;
		}
		
	});
	
	
/***********************************

	OPTIONAL CONTROLS
	
************************************/

	Layer.Views.Lib.Target = Layer.Views.Lib.extend({
		
		defaults : {
			className : '',
			idName : ''
		},
		
		init : function( args )
		{
			this.className = this.settings.className;
		},
		
		render : function()
		{
			$(this.el).attr('id', this.settings.idName);
		}
		
	});

	Layer.Views.Lib.Slider = Layer.Views.Lib.extend({
		
		className : 'control control-slider',
		
		defaults : {
			label : 'control',
			min : 0,
			max : 100,
			step : 1,
			value : 100,
			silent : false,
			suffix : '',
			css : true,
			scaleWith : false,
			scaleValue : false,
			callback : false,
			save : true
		},
		
		render : function()
		{
			var _this = this;
			
			this.$el.append( _.template( this.getTemplate(), this.settings ));
			
			//slider stuff here
			this.$el.find('.control-slider').slider({
				min : this.settings.min,
				max : this.settings.max,
				value : this.model.get('attr')[this.settings.property] || this.settings.value,
				step : this.settings.step,
				slide : function(e, ui)
				{
					if( _this.settings.css )
						_this.model.visual.$el.css( _this.settings.property, ui.value + _this.settings.suffix );
				},
				stop : function(e,ui)
				{
					if(_this.settings.save)
					{
						var attr = {};
						attr[_this.settings.property] = ui.value;
						_this.model.update( attr )
					}
				}
			});
			
			return this;
		},
		
		getTemplate : function()
		{
			var html = ''+
			
					"<div class='control-name'><%= label %></div>"+
					"<div class='control-slider'></div>";
			
			return html;
		}
	});
	
	
	Layer.Views.Lib.ColorPicker = Layer.Views.Lib.extend({
		
		className : 'control control-colorpicker',
		
		defaults : {
			property : 'backgroundColor',
			color : '#ffffff',
			save : 'true'
		},
		
		
		save : function()
		{
			console.log('save rect')
			var attr = {};
			console.log(this)
			attr[ this.settings.property ] = this.settings.color;
			this.model.update( attr )
		},
		
		render : function()
		{
			var _this = this;
			
			
			
			this.$el.append( _.template( this.getTemplate(), this.settings ));
			
			$.farbtastic(this.$el.find('.control-colorpicker'))
				.setColor( _this.settings.color )
				.linkTo(function(color){
					console.log(color)
					_this.model.visual.$el.css( _this.settings.property, color );
					_this.settings.color = color;
					if(_this.settings.save) _this.lazySave();
				});
			
			return this;
		},
		
		lazySave : _.debounce( function(){
			var attr = {};
			attr[ this.settings.property ] = this.settings.color;
			this.model.update( attr );
		}, 3000),
		
		getTemplate : function()
		{
			var html = ''+
			
					"<div class='control-name'><%= label %></div>"+
					"<div class='control-colorpicker'></div>";
			
			return html;
		}
	});


	// depends on popcorn.js
	Layer.Views.Lib.Playback = Layer.Views.Lib.extend({
		
		className : 'control control-playback plyr-controls-wrapper',
		
		defaults : {},
		
		init : function()
		{
			this.model.on('video_ready', this.onVideoReady, this);
		},
		
		render : function()
		{
			var _this = this;
			
			this.$el.append( this.getTemplate() ).attr('id','plyr-editor');
			
			return this;
		},
		
		onVideoReady : function()
		{
			this.delegateEvents();
			this.initPopcornEvents();
			this.initScrubbers();
		},
		
		initPopcornEvents : function()
		{
			var _this = this;
			
			console.log(this.model.video)
			
			this.model.video.pop.listen('pause',function(){
				_this.$el.find('.plyr-button').removeClass('plyr-pause').addClass('plyr-play');
			});
			
			this.model.video.pop.listen('play',function(){
				_this.$el.find('.plyr-button').removeClass('plyr-play').addClass('plyr-pause');
			});
			
			this.model.video.pop.listen('timeupdate', function(){

				if(_this.model.video.pop.currentTime() > _this.model.get('attr').cue_out )
				{
					_this.model.video.pop.pause();
					_this.model.video.pop.currentTime( _this.model.get('attr').cue_in );
				}
				
				var left = parseFloat( _this.model.video.pop.currentTime()) / parseFloat( _this.model.video.pop.duration() ) * 100;
				_this.$el.find('.plyr-scrubber').css({ 'left' : left+'%' });
				_this.$el.find('.plyr-time').html( convertTime( _this.model.video.pop.currentTime() )+' / '+convertTime( _this.model.video.pop.duration() ) );
				_this.$el.find('.plyr-time-bar').css({ 'width' : left+'%' });

			});
			
			this.model.video.pop.listen('seeking',function(){});
			this.model.video.pop.listen('seeked',function(){});
			this.model.video.pop.listen('ended',function(){
				//this.currentTime(0);
			});
			this.model.video.pop.listen('loadeddata',function(){});
		},
		
		initScrubbers : function()
		{
			var _this = this;
			this.$el.find('.plyr-scrubber').draggable({
				
				axis:'x',
				containment: 'parent',
				
				start:function()
				{
					_this.model.video.pop.pause();
				},
				
				drag:function(event, ui)
				{
					var newTime = Math.floor(parseFloat(ui.position.left)*_this.model.video.pop.duration()/parseFloat(_this.$el.find('.plyr-timeline').width()));	
					_this.$el.find('.plyr-time').html( convertTime(newTime)+' / '+convertTime(_this.model.video.pop.duration()));
				},
				
				stop: function(event, ui)
				{
					var newTime = Math.floor(parseFloat(_this.$el.find('.plyr-scrubber').css('left'))*_this.model.video.pop.duration()/parseFloat(_this.$el.find('.plyr-timeline').width()));
					if( newTime < _this.model.get('attr').cue_in ) newTime = _this.model.get('attr').cue_in;
					else if( newTime > _this.model.get('attr').cue_out) newTime = Math.max(parseFloat(_this.model.get('attr').cue_in), parseFloat(_this.model.get('attr').cue_out)-5.0);
				
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
					_this.model.get('attr').cue_in = Math.floor( parseFloat(ui.position.left)*_this.model.video.pop.duration()/parseFloat(_this.$el.find('.plyr-timeline').width()));	
					_this.$el.find('.plyr-cuein-time').html( convertTime(_this.model.get('attr').cue_in,true) );
				},
				
				stop: function(event, ui)
				{
					
					_this.$el.find('.plyr-cuein-bar').css({'width':_this.$el.find('.plyr-cuein-scrubber').css('left')});
					_this.model.video.pop.currentTime( Math.floor(parseFloat(ui.position.left) * _this.model.video.pop.duration() / parseFloat(_this.$el.find('.plyr-timeline').width())));

					var left = parseFloat( _this.model.video.pop.currentTime() ) / parseFloat( _this.model.video.pop.duration() ) * 100;
					_this.$el.find('.plyr-scrubber').css({'left':left+'%'});
					_this.$el.find('.plyr-time').html(convertTime(_this.model.video.pop.currentTime())+' / '+convertTime(_this.model.video.pop.duration()));
					_this.$el.find('.plyr-time-bar').css({'width':left+'%'});
					
					_this.model.update({'cue_in' : _this.model.video.pop.currentTime() })
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
					_this.model.get('attr').cue_out = Math.floor(parseFloat(ui.position.left)*_this.model.video.pop.duration() / parseFloat( _this.$el.find('.plyr-timeline').width()));	
					_this.$el.find('.plyr-cueout-time').html(convertTime( _this.model.get('attr').cue_out,true));
				},
				
				stop: function(event, ui)
				{
					_this.$el.find('.plyr-cueout-bar').css({'width':parseInt(_this.$el.find('.plyr-timeline').width())-parseInt(_this.$el.find('.plyr-cueout-scrubber').css('left'))});
					_this.model.video.pop.currentTime(Math.max(parseFloat(_this.model.get('attr').cue_in), parseFloat(_this.model.get('attr').cue_out)-5.0));
				
					_this.model.update({'cue_out' : _this.model.video.pop.currentTime() })
				}
			});
		},
		
		events : {
			
			'click .plyr-button' : 'playPause'
			
		},
		
		playPause : function()
		{
			console.log( 'volume: '+ this.model.get('attr').volume )
			this.model.video.pop.volume( this.model.get('attr').volume );
			if ( this.model.video.pop.paused() ) this.model.video.pop.play();
			else this.model.video.pop.pause();
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
	
	
	Layer.Views.Lib.GoogleMaps = Layer.Views.Lib.extend({
		
		className : 'control control-google-map',
		
		defaults : {
			
			mapWidth : 268,
			mapHeight : 268,
			
			type : 'map',
			streetView : true,
			searchBar : true,
			disableDoubleClickZoom : true,

			panControl: false,
			zoomControl: true,
			mapTypeControl: true,
			scaleControl: false,
			streetViewControl: true,
			overviewMapControl: false
		},
		
		init : function()
		{
			
			//console.log(this.model)
			/*
			this.model.on("all", function(eventName) {
				console.log('event: '+ eventName);
			});
			*/
		},
		
		onControlsOpen : function()
		{
			this.initMap();
		},
		
		initMap : function()
		{
			console.log('geo layer open')
			console.log(this)
			if( this.loaded != true )
			{
				//make center lat lng
				var center = new google.maps.LatLng( this.model.get('attr').lat, this.model.get('attr').lng);

				var gMapType = google.maps.MapTypeId[ this.model.get('attr').mapType.toUpperCase() ];

				var mapOptions = {
					zoom : this.model.get('attr').zoom,
					center : center,
					mapTypeId : gMapType,
					
					disableDoubleClickZoom : this.settings.disableDoubleClickZoom,
					panControl: this.settings.panControl,
					zoomControl: this.settings.zoomControl,
					mapTypeControl: this.settings.mapTypeControl,
					scaleControl: this.settings.scaleControl,
					streetViewControl: this.settings.streetView,
					overviewMapControl: this.settings.overviewMapControl
				};
				this.map = new google.maps.Map( $(this.el).find( '.google-map' )[0], mapOptions);
			
				if( this.model.get('attr').type == "streetview" )
				{
					var pov = {
							'heading' : this.model.get('attr').heading,
							'pitch' : this.model.get('attr').pitch,
							'zoom' : this.model.get('attr').streetZoom,
							}
					this.map.getStreetView().setPosition( center );
					this.map.getStreetView().setPov( pov );
					this.map.getStreetView().setVisible( true );
				}
			
				this.initMapListeners();
				this.initGeoCoder();
				
				this.loaded = true
			}
		},
		
		initGeoCoder : function()
		{
			var _this = this;
			this.geocoder = new google.maps.Geocoder();
			
			$(this.el).find('.geocoder').keypress(function(e){
				if(e.which == 13)
				{
					_this.lookup( $(this).val() );
					$(this).blur();
					return false;
				}
			}).blur(function(){
				_this.lookup( $(this).val() )
			})
		},
		
		lookup : function( location )
		{
			console.log('lookup: '+location)
			var _this = this;
			this.geocoder.geocode( { 'address': location}, function(results, status) {
				if ( status == google.maps.GeocoderStatus.OK )
				{
					if( _this.map.getStreetView().getVisible() ) _this.map.getStreetView().setVisible( false );
					var center = results[0].geometry.location;
					_this.map.setCenter( center );
					_this.model.update({ title : location });
				}
				else alert("Geocoder failed at address look for "+ input.val()+": " + status);
			});
			
			
		},
		
		initMapListeners : function()
		{
			var _this = this;
			google.maps.event.addListener( this.map, 'idle', function(){
				var newCenter = _this.map.getCenter();
				console.log('map is idle now')
				_this.model.update({
					lat : newCenter.lat(),
					lng : newCenter.lng()
				})
			});

			google.maps.event.addListener(this.map, 'maptypeid_changed', function(){
				console.log('the maps type has changed')
				_this.model.update({ mapType : _this.map.getMapTypeId() })
			});
			
			google.maps.event.addListener( this.map , 'zoom_changed', function(){
				console.log('map zoom level changed')
				_this.model.update({ zoom : _this.map.getZoom() })
			});
			
			google.maps.event.addListener( this.map.getStreetView(), 'visible_changed', function(){
				
				console.log('streetview changed')
				if( _this.map.getStreetView().getVisible() )
				{
					var center = _this.map.getStreetView().getPosition();

					//when streetview is visible
					_this.model.update({
						type : 'streetview',
						lat : center.lat(),
						lng : center.lng()
					});
				}
				else
				{
					//when streetview is hidden
					_this.model.update({ type: 'map' })
				}
			});
			
			//called when the streetview is panned
			google.maps.event.addListener( _this.map.getStreetView(), 'pov_changed', function(){
				
				delayedUpdate();
			});

			// need this so we don't spam the servers
			var delayedUpdate = _.debounce( function(){
				var center = _this.map.getStreetView().getPosition();
				var pov = _this.map.getStreetView().getPov();
				
				console.log('streetview moved')
				
				_this.model.update({
					heading : pov.heading,
					lat : center.lat(),
					lng : center.lng(),
					pitch : pov.pitch,
					streetZoom : Math.floor( pov.zoom )
				})
				
			} , 1000);
		},
		
		
		onControlsClosed : function()
		{
			console.log('geo layer closed')
		},
		
		save : function()
		{
			console.log('save rect')
			var attr = {};
			console.log(this)
			//attr[ this.settings.property ] = this.settings.color;
			//this.model.update( attr )
		},
		
		onLayerEnter : function()
		{
			this.initMap();
		},
		
		onLayerExit : function()
		{
			this.map = {};
			$(this.el).find( '.google-map' ).empty();
			this.loaded = false;
		},
		
		render : function()
		{
			var _this = this;

			this.$el.append( _.template( this.getTemplate(), this.settings ));
			
			
			return this;
		},
		
		lazySave : _.debounce( function(){
			var attr = {};
			attr[ this.settings.property ] = this.settings.color;
			this.model.update( attr );
		}, 3000),
		
		getTemplate : function()
		{
			var html = ''+
			
					"<div class='google-map' style='width:<%= mapWidth %>px; height:<%= mapHeight %>px'></div>"+
					"<input class='geocoder' type='text' placeholder='type a place name'>"
			
			return html;
		}
	});
	
	
})(zeega.module("layer"));


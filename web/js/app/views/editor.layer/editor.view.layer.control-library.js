(function(Layer){

	Layer.Views.Lib = Backbone.View.extend({
		defaults : {},
		initialize : function( args )
		{
			this.settings = _.defaults( args, this.defaults );
			$(this.el).addClass('control');
			this.init();
			
			this.model.on('editor_controlsOpen', this.private_onControlsOpen, this);
			this.model.on('editor_controlsClosed', this.private_onControlsClosed, this);
			this.model.on('editor_layerEnter', this.private_onLayerEnter, this);
			this.model.on('editor_layerExit', this.private_onLayerExit, this);
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
		onLayerExit : function(){},
		
		private_onControlsOpen : function()
		{
			this.onControlsOpen();
			this.delegateEvents();
		},
		private_onControlsClosed : function()
		{
			this.onControlsClosed();
			this.undelegateEvents();
		},
		private_onLayerEnter : function()
		{
			this.onLayerEnter();
			this.delegateEvents();
		},
		private_onLayerExit : function()
		{
			this.onLayerExit();
			this.undelegateEvents();
		}
		
	});



/****************************

	DEFAULT CONTROLS
	
****************************/

	Layer.Views.Lib.ContinueToNextFrame = Layer.Views.Lib.extend({

		className : 'control continue-to-next',

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

		className : 'control continue-to-all',
		
		defaults : {active:false},
		
		render : function()
		{
			var button = '<button class="btn" style="width:100%">Continue on all frames</button>';
			$(this.el).append( button );
			if(this.settings.active) $(this.el).find('button').addClass('active btn-warning');
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

		className : 'control link-controls',

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
			save : true,
			
			slide : null
		},
		
		render : function()
		{
			var _this = this;
			
			this.$el.append( _.template( this.getTemplate(), this.settings ));
			
			//slider stuff here
			this.$el.find('.control-slider').slider({
				min : this.settings.min,
				max : this.settings.max,
				value : ( !_.isUndefined(this.model.get('attr')[this.settings.property]) ) ? this.model.get('attr')[this.settings.property] : this.settings.value,
				step : this.settings.step,
				slide : function(e, ui)
				{
					if( _this.settings.css )
						_this.model.visual.$el.css( _this.settings.property, ui.value + _this.settings.suffix );
						
					if( !_.isNull( _this.settings.slide ) ) _this.settings.slide();
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
		
		getValue : function()
		{
			return this.$el.find('.control-slider').slider('option','value');
		},
		
		getTemplate : function()
		{
			var html = ''+
			
					"<div class='control-name'><%= label %></div>"+
					"<div class='control-slider'></div>";
			
			return html;
		}
	});
	
	//for text layer
	// ** deprecated ** //
	Layer.Views.Lib.ClearStyles = Layer.Views.Lib.extend({
		
		className : 'clear-styles',

		render : function()
		{
			var button = '<button class="btn" style="width:100%">Clear Styles</button>'
			$(this.el).append( button );
		},

		events : {
			'click' : 'clearStyles'
		},

		clearStyles : function()
		{
			var clean = this.model.get('attr').content.replace(/(<([^>]+)>)/ig, "");

			this.model.update({ content : clean });
			console.log( 'clear styles!: '+ clean );
			this.model.updateContentInPlace();
		}
		
	});
	
	Layer.Views.Lib.TextStyles = Layer.Views.Lib.extend({

		className : 'text-styles',

		render : function()
		{
			var buttonSet = this.getTemplate();
			$(this.el).append( buttonSet );
		},
		
		events : {
			'click .bold' : 'addBold',
			'click .italic' : 'addItalic',
			'click .underline' : 'addUnderline',
			'click .clear-styles' : 'clearStyles'
		},
		
		addBold : function()
		{
			if( this.model.visual.$el.find('.style-bold').length  )
				this.model.visual.$el.find('.style-bold').contents().unwrap();
			else
				this.model.visual.$el.find('.inner').wrapInner('<span class="style-bold" style="font-weight:bold"/>');
			this.$el.find('.bold').effect('highlight',{},2000);
			this.saveContent();
		},
		
		addItalic: function()
		{
			if( this.model.visual.$el.find('.style-italic').length  )
				this.model.visual.$el.find('.style-italic').contents().unwrap();
			else
				this.model.visual.$el.find('.inner').wrapInner('<span class="style-italic" style="font-style:italic"/>');
			this.$el.find('.italic').effect('highlight',{},2000);
			this.saveContent();
		},
		addUnderline : function()
		{
			if( this.model.visual.$el.find('.style-underline').length  )
				this.model.visual.$el.find('.style-underline').contents().unwrap();
			else
				this.model.visual.$el.find('.inner').wrapInner('<span class="style-underline" style="text-decoration:underline"/>');
			this.$el.find('.underline').effect('highlight',{},2000);
			
			this.saveContent();
		},
		
		saveContent : function()
		{
			var str = this.model.visual.$el.find('#zedit-target').html();
			this.model.update({ content : str });
		},
		
		clearStyles : function()
		{
			var clean = this.model.get('attr').content.replace(/(<([^>]+)>)/ig, "");
			this.model.update({ content : clean });
			this.model.updateContentInPlace();
		},
		
		getTemplate : function()
		{
			var html =
			
				'<div class="btn-group">'+
					'<button class="btn bold"><i class="zicon-bold"></i></button>'+
					'<button class="btn italic"><i class="zicon-italic"></i></button>'+
					'<button class="btn underline"><i class="zicon-underline"></i></button>'+
					'<button class="btn clear-styles"><i class="zicon-cancel"></i></button>'+
				'</div>';
					
			return html;
		}
		
	});
	
	Layer.Views.Lib.FontChooser = Layer.Views.Lib.extend({
		
		className : 'font-chooser',

		render : function()
		{
			var buttonSet = this.getTemplate();
			$(this.el).append( buttonSet );
		},
		
		events : {
			'click .font-list a' : 'changeFont'
		},
		
		changeFont : function( ui )
		{
			this.$el.find('.open').removeClass('open');
			this.model.visual.$el.find('.style-font-family').contents().unwrap();
			this.model.visual.$el.find('.inner').wrapInner('<span class="style-font-family" style="font-family:'+ $(ui.target).data('font-family') +'"/>');
			this.saveContent();
			return false;
		},
		
		saveContent : function()
		{
			var str = this.model.visual.$el.find('#zedit-target').html();
			this.model.update({ content : str });
		},
		
		getTemplate : function()
		{
			var html =
			
			'<div class="btn-group">'+
				'<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">Fonts'+
					'<span class="caret"></span>'+
				'</a>'+
				'<ul class="dropdown-menu font-list">'+
					'<li style="font-family:\'Arial\'"><a href="#" data-font-family="Arial">Arial</a></li>'+
					'<li style="font-family:\'Georgia\'"><a href="#" data-font-family="Georgia">Georgia</a></li>'+
					'<li style="font-family:\'Verdana\'"><a href="#" data-font-family="Verdana">Verdana</a></li>'+
					'<li style="font-family:\'Sorts Mill Goudy\'"><a href="#" data-font-family="Sorts Mill Goudy">Sorts Mill Goudy</a></li>'+
					'<li style="font-family:\'Poiret One\'"><a href="#" data-font-family="Poiret One">Poiret One</a></li>'+
					'<li style="font-family:\'Trocchi\'"><a href="#" data-font-family="Trocchi">Trocchi</a></li>'+
					'<li style="font-family:\'Pontano Sans\'"><a href="#" data-font-family="Pontano Sans">Pontano Sans</a></li>'+
				'</ul>'+
			'</div>';
					
			return html;
		}
		
	});
	
	Layer.Views.Lib.ColorPicker = Layer.Views.Lib.extend({
		
		className : 'control-colorpicker',
		
		defaults : {
			property : 'backgroundColor',
			color : '#ffffff',
			save : true,
			opacity: false,
			opacityValue : 1,
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
			
			if(this.settings.opacity )
			{
				this.opacitySlider = new Layer.Views.Lib.Slider({
					css : false,
					property : this.settings.property +'Opacity',
					value : this.settings[this.settings.property+'Opacity'] || this.settings.opacityValue,
					model: this.model,
					label : this.settings.label+' Opacity',
					step : 0.01,
					min : .05,
					max : 1,
					slide : function()
					{
						_this.refreshColor(_this.settings.color, _this.opacitySlider.getValue() )
					}
				});
			}
			
			this.$el.append( _.template( this.getTemplate(), this.settings ));
			
			if( this.settings.opacity ) this.$el.append( this.opacitySlider.getControl() );
			
			this.initHexField();
			
			return this;
		},
		
		events : {
			'click .color-box, input' : 'initWheel',
			'click .close' : 'closeWheel'
		},
		
		initHexField : function()
		{
			var _this = this;
			this.$el.find('input').keypress(function(e){
				if(e.which == 13)
				{
					console.log($(this).val())
					var validHex  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test( $(this).val() );
					if( validHex )
					{
						$(this).effect('highlight',{},2000);
					}
					else
					{
						$(this).val('#FF00FF'); //set to a default
						$(this).effect('highlight',{'color':'#ff0000'},2000); //blink red
					}
					$.farbtastic( _this.$el.find('.control-colorpicker')).setColor( $(this).val() );
					this.lazySave();
				}
			})
		},
		
		initWheel : function()
		{
			var _this = this;
			console.log('pull up color wheel!')
			this.$el.find('.close').show();
			
			if( this.wheelLoaded != true )
			{
				$.farbtastic(this.$el.find('.control-colorpicker'))
					.setColor( _this.settings.color )
					.linkTo(function(color){
						_this.refreshColor( color, (( _this.opacitySlider)? _this.opacitySlider.getValue() : 1 ) );
						_this.settings.color = color;
					});
				this.wheelLoaded = true;
			}
			else
			{
				this.$el.find('.control-colorpicker').show();
				
			}
		},
		
		closeWheel : function()
		{
			this.$el.find('.close').hide();
			this.$el.find('.control-colorpicker').hide();
		},
		
		refreshColor : function( hex, a )
		{
			this.model.visual.$el.css( this.settings.property, 'rgba('+ hex.toRGB() +','+ a +')' );
			this.$el.find('.color-box').css( 'background-color', hex );
			this.$el.find('input').val( hex );
			if(this.settings.save) this.lazySave();
		},
		
		lazySave : _.debounce( function(){
			var attr = {};
			attr[ this.settings.property ] = this.settings.color;
			this.model.update( attr );
		}, 1000),
		
		getTemplate : function()
		{
			var html =
			
					"<div class='input-prepend input-append'>"+
						"<span class='add-on'><%= label %></span>"+
						"<input id='prependedInput' class='span1' type='text' size='16' value='<%= color %>'/>"+
						"<span class='add-on color-box' style='background-color:<%= color %>'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>"+
					"</div>"+
					'<a class="close" style="display:none">&times;</a>'+
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
			
			
			
			
			this.model.video.on('timeupdate_controls', function(){

				if(Math.abs(_this.model.video.pop.volume()-_this.model.get('attr').volume)>.01)_this.model.video.pop.volume(_this.model.get('attr').volume);

				if( _this.model.get('attr').cue_out != 0 && _this.model.video.pop.currentTime() > _this.model.get('attr').cue_out )
				{
					
					_this.model.video.pop.currentTime( _this.model.get('attr').cue_in );
					_this.model.video.pop.pause();
				}
				else if(_this.model.video.pop.currentTime() < _this.model.get('attr').cue_in )
				{
					
					_this.model.video.pop.currentTime( _this.model.get('attr').cue_in );
					_this.model.video.pop.pause();
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
					else if( newTime > _this.model.get('attr').cue_out && parseFloat(_this.model.get('attr').cue_out)>0) newTime = Math.max(parseFloat(_this.model.get('attr').cue_in), parseFloat(_this.model.get('attr').cue_out)-5.0);
				
					_this.model.video.pop.trigger('timeupdate');
					_this.model.video.pop.currentTime( newTime );
					
					//_this.pop.play();
				}
			});
			
			console.log(this.model);
			
		
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
					console.log(Math.floor(parseFloat(ui.position.left) * _this.model.video.pop.duration() / parseFloat(_this.$el.find('.plyr-timeline').width())));
					_this.model.video.pop.currentTime( Math.floor(parseFloat(ui.position.left) * _this.model.video.pop.duration() / parseFloat(_this.$el.find('.plyr-timeline').width())));

					var left = parseFloat( _this.model.video.pop.currentTime() ) / parseFloat( _this.model.video.pop.duration() ) * 100;
					_this.$el.find('.plyr-scrubber').css({'left':left+'%'});
					_this.$el.find('.plyr-time').html(convertTime(_this.model.video.pop.currentTime())+' / '+convertTime(_this.model.video.pop.duration()));
					_this.$el.find('.plyr-time-bar').css({'width':left+'%'});
					
					_this.model.update({'cue_in' : _this.model.get('attr').cue_in });
				}
			});
			   this.$el.find('.plyr-scrubber').css({'left': Math.floor(parseFloat(this.model.get('attr').cue_in)* parseFloat( this.$el.find('.plyr-timeline').width())/parseFloat(this.model.video.pop.duration() ))});
			
				this.$el.find('.plyr-cuein-scrubber').css({'left': Math.floor(parseFloat(this.model.get('attr').cue_in)* parseFloat( this.$el.find('.plyr-timeline').width())/parseFloat(this.model.video.pop.duration() ))});
			if(parseFloat(this.model.get('attr').cue_out)>0)this.$el.find('.plyr-cueout-scrubber').css({'left': Math.floor(parseFloat(this.model.get('attr').cue_out )* parseFloat( this.$el.find('.plyr-timeline').width())/parseFloat(this.model.video.pop.duration() ))});
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
				
					_this.model.update({'cue_out' : _this.model.get('attr').cue_out });
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
			streetViewControl: false,
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
					streetViewControl: false,
					overviewMapControl: this.settings.overviewMapControl
				};
				this.map = new google.maps.Map( $(this.el).find( '.google-map' )[0], mapOptions);
				this.marker = new google.maps.Marker({
					  position: center,
					  map: this.map,
					  

				  });
				this.marker.setDraggable(true);
				/*
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
				*/
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
					_this.marker.setPosition(center);
					_this.model.update({ title : location });
				}
				else alert("Geocoder failed at address look for "+ input.val()+": " + status);
			});
			
			
		},
		
		initMapListeners : function()
		{
			var _this = this;
			google.maps.event.addListener( this.map, 'idle', function(){
				/*
				var newCenter = _this.map.getCenter();
				console.log('map is idle now')
				
				_this.model.update({
					lat : newCenter.lat(),
					lng : newCenter.lng()
				})
				_this.model.trigger('update');
				*/
			});
			
			 google.maps.event.addListener(this.marker, 'dragend', function(){
			 
			 	var newCenter = _this.marker.getPosition();
				console.log('map is idle now')
				
				_this.model.update({
					lat : newCenter.lat(),
					lng : newCenter.lng()
				})
				_this.model.trigger('update');
			 
			 
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
console.log(center.lat() +':'+ center.lng() )

					//when streetview is visible
					_this.model.update({
						type : 'streetview',
						lat : center.lat(),
						lng : center.lng(),
						heading : _this.map.getStreetView().getPov().heading,
						pitch : _this.map.getStreetView().getPov().pitch,
						streetZoom : Math.floor( _this.map.getStreetView().getPov().zoom )
					});
				}
				else
				{
					//when streetview is hidden
					_this.model.update({ type: 'map' })
				}
				
				//_this.model.trigger('update');
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
			if( $(this.el).find( '.google-map' ).is(':visible') ) this.onControlsOpen();
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
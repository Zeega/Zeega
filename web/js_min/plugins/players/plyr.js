



/*******************************************

	OOP SUGAR FUNCTIONS
	helping to simplify extending classes


	Simple JavaScript Inheritance
	By John Resig http://ejohn.org/
	MIT Licensed.
	
	http://ejohn.org/blog/simple-javascript-inheritance/

********************************************/


(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  this.Class = function(){};
  
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
    
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" && 
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
            
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
            
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
            
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
    
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
    
    // Populate our constructed prototype object
    Class.prototype = prototype;
    
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
    
    return Class;
  };
})();


var Plyr2 = Backbone.Model.extend({
	
	defaults : {
		id : 0,
		uri : 'http://www.youtube.com/watch?v=dQw4w9WgXcQ&ob=av3e',
		control_mode : 'standard', // standard / editor / none
		autoplay : true,
		cue_in : 0,
		cue_out : 150,
		volume : .5,
		
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
					this.pop.listen( 'canplay', function(){
					
						if(_this.get('cue_in')!=0) {
							_this.pop.listen('seeked',function(){
							
								_this.trigger('video_canPlay');
							});
						
							_this.pop.currentTime(_this.get('cue_in'));
							console.log('seeking to: ' +_this.get('cue_in'));
						
						}
						else _this.trigger('video_canPlay');
						_this.pop.volume(_this.get('volume'));
						
						
					});
					break;
				case 'flashvideo':
					this.pop = Popcorn.flashvideo('#zvideo-'+ this.id, this.get('uri') );
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
						_this.pop.volume(_this.get('volume'));
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
	
	currentTime :function(){
	
	return this.pop.currentTime();
	
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

function convertTime(seconds,tenths){
	
	var m=Math.floor(seconds/60);
	if(tenths&&1==0)var s=Math.floor(seconds%600)/10.0;
	else var s=Math.floor(seconds%60)
	if(s<10) s="0"+s;
	return m+":"+s;
}

/*

/*
$(document).ready(function(){

	// new Plyr({
		url:'string',
		mode:'string - ['standalone(default)',editor]
		,})
	
	//var p = new Plyr('video',{url:'http://ia700202.us.archive.org/23/items/youth_media_clip2/youth_media_clip2_512kb.mp4',format:'flash'});
	
	var p = new Plyr('video',{url:'http://ia600404.us.archive.org/2/items/052706Muddybrook/052706muddybrookartmusic.mp3',controlsId:'controls',controlsType:'editor', cueIn:10,cueOut:200});

	//var p = new Plyr('video',{url:'http://vimeo.com/6059734'});
});
*/

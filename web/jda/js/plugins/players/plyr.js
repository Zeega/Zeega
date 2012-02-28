



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



var Plyr = Class.extend({
	init: function(id,args){
		this.id = id;
		this.url = args['url'];
		this.format = args['format'];
		this.wrapper = $('#'+this.id);
		
		
		this.wrapper.append($('<div>').addClass('plyr-controls-wrapper')
			.append($('<div>').addClass('plyr-controls')
			.append($('<div>').addClass('plyr-button-wrapper').append($('<div>').addClass('plyr-button').addClass('plyr-play')))
			.append($('<div>').addClass('plyr-time'))
			.append($('<div>').addClass('plyr-timeline').append($('<div>').addClass('plyr-scrubber')))
			));
		
		var _this=this;
		this.wrapper.resize(function(){
			console.log('resizing');
		
			$(this).find('.plyr-controls-wrapper').css({width:parseInt(_this.wrapper.width()),'height':parseInt(_this.wrapper.height())});
		
		});
		
		
		
		if(this.url.match(/^http:\/\/(?:www\.)?youtube.com\/watch\?(?=.*v=\w+)(?:\S+)?$/)) this.format = 'youtube'
		else if (this.url.match(/^http:\/\/(?:www\.)?vimeo.com\/(.*)/)) this.format = 'vimeo'
		else this.format ='html5';
		
		//Force flash for html5 in Firefox browser
		
		if(navigator.userAgent.split(' ')[navigator.userAgent.split(' ').length-1].split('/')[0]=='Firefox'&&this.format=='html5') this.format='flashvideo';
		
		
		var _this=this;
		
		//Create appropriate popcorn instance
		
		switch(this.format)
		{
			case 'html5':
			  this.wrapper.prepend($('<video>').addClass('plyr-video').attr({'src':this.url,'id':'z-'+this.id}));
			  this.pop = Popcorn('#z-'+this.id);
			  this.pop.listen('canplay',function(){ _this.wrapper.find('.plyr-controls').fadeIn();});
			  break;
			case 'flashvideo':
			  this.wrapper.prepend($('<div>').addClass('plyr-video').attr({'id':'z-'+this.id}));
			  this.pop = Popcorn.flashvideo('#z-'+this.id,this.url);
			  this.pop.listen('loadeddata',function(){ _this.wrapper.find('.plyr-controls').fadeIn();});
			  break;
			case 'youtube':
			  this.wrapper.prepend($('<div>').addClass('plyr-video').attr({'id':'z-'+this.id}));
			  this.pop = Popcorn.youtube('#z-'+this.id,this.url);
			  this.pop.listen('loadeddata',function(){ _this.pop.play();_this.pop.pause(); _this.wrapper.find('.plyr-controls').fadeIn();}); 
			 break;
			case 'vimeo':
			  this.wrapper.prepend($('<div>').addClass('plyr-video').attr({'id':'z-'+this.id}));
			  this.pop = Popcorn.vimeo('#z-'+this.id,this.url);
			  this.pop.listen('loadeddata',function(){  _this.wrapper.find('.plyr-controls').fadeIn();}); 
			 break;
			default:
			  console.log('none set');
		}
		
		//UX
		
		this.wrapper.find('.plyr-button').click(function(){ if (_this.pop.paused()) _this.pop.play(); else _this.pop.pause();});
		this.wrapper.find('.plyr-scrubber').draggable({axis:'x',containment: 'parent',stop: function(event, ui) {
				var newTime = Math.floor(parseFloat(_this.wrapper.find('.plyr-scrubber').css('left'))*_this.pop.duration()/parseFloat(_this.wrapper.find('.plyr-timeline').width()));
				_this.pop.currentTime(newTime);
				_this.pop.play();
			},
			start:function(){
				_this.pop.pause();
			},
			drag:function(event, ui){
				var newTime = Math.floor(parseFloat(ui.position.left)*_this.pop.duration()/parseFloat(_this.wrapper.find('.plyr-timeline').width()));
				_this.pop.currentTime(newTime);
			
			}
		});
		
		//Add popcorn listeners
		
		this.pop.listen('loadedmetadata',function(){
		
			_this.wrapper.find('.plyr-time').html(convertTime(_this.pop.currentTime())+' / '+convertTime(_this.pop.duration()));
			
		});
		this.pop.listen('timeupdate',function(){
		
			var left = parseFloat(_this.pop.currentTime())/parseFloat(_this.pop.duration())*100;
			_this.wrapper.find('.plyr-scrubber').css({'left':left+'%'});
			_this.wrapper.find('.plyr-time').html(convertTime(_this.pop.currentTime())+' / '+convertTime(_this.pop.duration()));
			
			
			
			
		});
		this.pop.listen('pause',function(){
			_this.wrapper.find('.plyr-button').removeClass('plyr-pause').addClass('plyr-play');
		
		});
		this.pop.listen('play',function(){
			_this.wrapper.find('.plyr-button').removeClass('plyr-play').addClass('plyr-pause');
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
});

function convertTime(seconds){
	
	var m=Math.floor(seconds/60);
	var s=Math.floor(seconds%60);
	if(s<10) s="0"+s;
	return m+":"+s;
}

/*
$(document).ready(function(){
	//var p = new Plyr('div_id',{url:'http://ia700202.us.archive.org/23/items/youth_media_clip2/youth_media_clip2_512kb.mp4',format:'video',load:'true'});
	var p = new Plyr('div_id',{url:'http://www.youtube.com/watch?v=Wvx5JMZzUUA&controls=0'});
	//var p = new Plyr('div_id',{url:'http://vimeo.com/6059734'});
});

*/
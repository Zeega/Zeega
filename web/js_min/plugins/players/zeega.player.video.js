/************************************

	ZEEGA HTML5 MEDIA PLAYER CLASS
	
	TODO:
		Separate out control names
		Rename Classes

************************************/



var ZeegaVideoPlayer = Class.extend({
	debug : {
		fun:false,
		event:true,
		time:false,
	},
	
	init: function(id,src,inPoint,outPoint,volume,wrapperId,playerId){
	
		if(this.debug.fun)console.log("html5 player ["+id+"] : function : init");
	
		this._id=id;
		this._inPoint=parseFloat(inPoint);
		this._outPoint=parseFloat(outPoint);
		this._volume=parseFloat(volume)/100.0;
		this._canPlay=false;
		this._duration;
		this._wrapperId=wrapperId;
		this._playerId=playerId;
		
		//What is this for?
		this._selectedArrow='none';
		
		// Create video element
		this._asset=document.createElement('video');
		this._asset.setAttribute('id','media_'+id);
		this._asset.setAttribute('src',src);
		this._asset.setAttribute('width',"100%");
		
		//Set event listeners
		var _this=this;
		this._asset.addEventListener("ended", function() {_this.onEnded();},false);
		this._asset.addEventListener("timeupdate", function() {_this.onTimeUpdate();},false);
		this._asset.addEventListener("play", function() {_this.onPlay();},false);
		this._asset.addEventListener("pause", function() {_this.onPause();},false);
		this._asset.addEventListener('durationchange', function () {_this.onDurationChange();},false);
		if(this._inPoint==0)this._asset.addEventListener('canplay',function(){_this.onCanPlay();},false);
		else this._asset.addEventListener('progress',function(){_this.onProgress();},false);
		
		// Add video element to page
		$('#'+this._wrapperId).html(this._asset);
		
		//Check to see if video already cached
		if(this._asset.duration>0&&this._asset.buffered.end(0)>this._inPoint) this.onCanPlay();

	},
	
	onDurationChange:function(){
		if(this.debug.event) console.log("html5 player ["+this._id+"] : event : durationChange : "+this._asset.duration);
		this._duration=Math.round(this._asset.duration*1000)/1000.0;
		if(this._outPoint==0) this._outPoint=this._duration;
		this.onProgress();
	},
	
	onCanPlay:function(){
		if(this.debug.event) console.log("html5 player ["+this._id+"] : event : canPlay : "+this._asset.buffered.end(0));
		this._canPlay=true;
		this._asset.currentTime=this._inPoint;
		this._asset.volume=this._volume;
		$('#'+this._playerId).trigger('ready',{'id':this._id});
	},
	
	onProgress:function(){
		if(this.debug.event) console.log("html5 player ["+this._id+"] : event : progress : "+this._asset.buffered.end(0));
		if(!this._canPlay&&this._asset.duration>0) {
			this._asset.currentTime=this._inPoint;
			if(this._asset.buffered.end(0)>0) this.onCanPlay();
		}
		$('#'+this._playerId).trigger('progress',{'id':this._id});
	},
	
	onTimeUpdate:function(){
		if(this.debug.time) console.log("html5 player ["+this._id+"] : event : timeUpdate : "+this._asset.currentTime);
		
		//	Include a slight margin of error (+/- 0.1) due to the imprecision of video seek points
		if(this._asset.currentTime > this._outPoint + .1){
			$('#'+this._playerId).trigger('ended',{'id':this._id});
			this.pause();
			this._asset.currentTime=this._inPoint;		
		}
		else if(this._asset.currentTime < this._inPoint - .5) this._asset.currentTime=this._inPoint;
		$('#'+this._playerId).trigger('timeUpdate',{'id':this._id});
	},
	
	onEnded: function(){
		if(this.debug.event) console.log("html5 player ["+this._id+"] : event : ended");
		this.pause();
		this._asset.currentTime=this._inPoint;
		$('#'+this._playerId).trigger('ended',{'id':this._id});
	},
	
	onPlay: function(){
		if(this.debug.event) console.log("html5 player ["+this._id+"] : event : play");
	
	},
	
	onPause: function(){
		if(this.debug.event) console.log("html5 player ["+this._id+"] : event : pause");
	
	},
	
	pause: function(){
		if(this.debug.fun) console.log("html5 player ["+this._id+"] : fun : pause");
		if(!this._asset.paused){
			this._asset.pause();
			$('#'+this._playerId).trigger('paused',{'id':this._id});
		}
		this._asset.setAttribute('src','');
	},
	
	play: function(){
		if(this.debug.fun) console.log("html5 player ["+this._id+"] : fun : play : "+this._asset.currentTime+" : "+this._asset.buffered.end(0));
		if(this._asset.paused) {
			this._asset.play();
			$('#'+this._playerId).trigger('play',{'id':this._id});
		}
	},
	
	exit:function(){
		if(this.debug.fun) console.log("html5 player ["+this._id+"] : fun : play");
		this.pause();
	},
	
	setCurrentTime:function(time){
			if(this.debug.fun) console.log("html5 player ["+this._id+"] : fun : setCurrentTime");
			this.pause();
			this._asset.currentTime = time;
			this.onTimeUpdate();
	},
	
	setVolume:function(volume){
		if(this.debug.fun) console.log("html5 player ["+this._id+"] : fun : setVolume : "+volume);

		if(this._asset&&volume<=1&&volume>=0) this._asset.volume=this._volume;
	},
	
	getVolume: function(){
		if(this.debug.event) console.log("html5 player ["+this._id+"] : fun : getVolume");

		if(this._asset) return Math.floor(this._asset.volume*100.0);
	},
});

var ZeegaVideoEditor = ZeegaVideoPlayer.extend({
	

	
	onCanPlay:function(){
		if(this.debug.event) console.log("html5 player ["+this._id+"] : event : canPlay : "+this._asset.buffered.end(0));
		if( !this._canPlay)
		{
		this._canPlay=true;
		this._asset.currentTime=this._inPoint;
		this.loadControls();
		}
	},
	
	onTimeUpdate:function(){
		if(this.debug.fun) console.log("html5 player ["+this._id+"] : fun : onTimeUpdate");
		
		if(this._asset.currentTime>this._outPoint+0.1||this._asset.currentTime<this._inPoint-0.1){
			this._asset.currentTime=this._inPoint;
			this.pause();
			$('#'+this._playerId).find('#playMP').addClass('playButtonMP').removeClass('pauseButtonMP');
		}
		var displayTime=convertTime(this._asset.currentTime);
		$('#'+this._playerId).find('#currentTime').html(displayTime);
		
		var currentLoc=parseFloat(this._asset.currentTime)*parseFloat($('#'+this._playerId).find('#loadingOutsideMP').css('width'))/parseFloat(this._duration);
		
		if(!this._dragging){
			$('#'+this._playerId).find('#currentMP').css('left',currentLoc+"px");
			$('#'+this._playerId).find('#loadingInsideMP').css('width',currentLoc+"px");
		}
		
		
	},
	
	onPlay: function(){
		if(this.debug.fun) console.log("html5 player ["+this._id+"] : event : play");
		$('#'+this._playerId).find('#playMP').addClass('pauseButtonMP').removeClass('playButtonMP');
		
	},
	
	onPause: function(){
		if(this.debug.fun) console.log("html5 player ["+this._id+"] : event : pause");
		
		$('#'+this._playerId).find('#playMP').addClass('playButtonMP').removeClass('pauseButtonMP');	
	},
	
	loadControls:function(){
		if(this.debug.fun) console.log("html5 player ["+this._id+"] : fun : loadControls");
		
		this._dragging=false;
		
		this.setVolume(this._volume);
		this.setInPoint(this._inPoint);
		m=getMinutes(this._outPoint);
		s=getSeconds(this._outPoint);
		
		$('#'+this._playerId).find('#avStopMinutes').html(m);
		$('#'+this._playerId).find('#avStopSeconds').html(s);
		var left=parseFloat(this._outPoint)*parseFloat($('#'+this._playerId).find('#loadingOutsideMP').css('width'))/parseFloat(this._duration);
		$('#'+this._playerId).find('#stopMP').css('left',left+"px");
		var width=parseInt($('#'+this._playerId).find('#loadingOutsideMP').css('width'))-parseInt($('#'+this._playerId).find('#stopMP').css('left'));
		$('#'+this._playerId).find('#stopBar').css('width',width+"px");
	
		var _this=this;
		
		$('#'+this._playerId).find('#playMP').click(function(){_this.playPause();});
		
		$('#'+this._playerId).find('#currentMP').draggable({
			axis: 'x',containment: 'parent',
			start:function(){_this._dragging=true;}, 
			stop:function(){			
				var t=parseFloat($(this).css('left'))*parseFloat(_this._duration)/parseFloat($('#player-'+_this._id).find('#loadingOutsideMP').css('width')); 
				if(t>parseFloat(_this._outPoint)) t=Math.max(_this._inPoint,parseFloat(_this._outPoint)-5.0);
				_this.setCurrentTime(t);
				_this._dragging=false;
			}
		});
		
		$('#'+this._playerId).find('#startMP').draggable({
			axis: 'x',
			containment: 'parent',
			stop:function(){
				_this.pause();
				var t=parseFloat($(this).css('left'))*parseFloat(_this._duration)/parseFloat($('#player-'+_this._id).find('#loadingOutsideMP').css('width')); 
				if(t>parseFloat(_this._outPoint)) t=Math.max(0,parseFloat(_this._outPoint)-10.0);
				_this.setInPoint(t);
				$('#'+_this._playerId).trigger('updated',{'id':this._id});
			}
		});
		
		$('#'+this._playerId).find('#stopMP').draggable({
			axis: 'x',
			containment: 'parent',
			stop:function(){
				_this.pause();
				var t=parseFloat($(this).css('left'))*parseFloat(_this._duration)/parseFloat($('#player-'+_this._id).find('#loadingOutsideMP').css('width')); 
				if(t<parseFloat(_this._inPoint)) t=Math.min(parseFloat(_this._duration),parseFloat(_this._inPoint)+10.0);
				
				_this.setOutPoint(t);
				
				$('#'+_this._playerId).trigger('updated',{'id':this._id});
			}
		});
		
		$('#'+this._playerId).find('#volume-slider').css({'margin':'10px'}).slider({
				min : 0,
				max : 100,
				value : Math.floor(this._volume*100),
				step : 1,
				slide: function(e,ui){
					_this._asset.volume=parseFloat(ui.value)/100.0;
				},
				stop : function(e, ui){
					_this._volume=parseFloat(ui.value)/100.0;
					$('#player-'+_this._id).trigger('updated');
				}
		});
		
		$('#'+this._playerId).find('#stopMP').draggable('option','disabled',false);
		$('#'+this._playerId).find('#startMP').draggable('option','disabled',false);
		$('#'+this._playerId).find('#currentMP').draggable('option','disabled',false);
		
		
		$('body').keydown(function(event) {
			if(_this.selectedArrow=='startMP'){
				if(event.keyCode==37&&_this._inPoint>0.1) _this._inPoint=_this._inPoint-0.1;
				else if(event.keyCode==39&&_this._outPoint-_this._inPoint>0.1)	_this._inPoint=_this._inPoint+0.1;
				_this.setInPoint(_this._inPoint);
			}
			else if(_this.selectedArrow=='stopMP'){
				if(event.keyCode==37&&_this._outPoint-_this._inPoint>0.1) _this._outPoint=_this._outPoint-0.1;
				else if(event.keyCode==39&&_this._dur-_this._outPoint>0.1) _this._outPoint=_this._outPoint+0.1;
				_this.setOutPoint(_this._outPoint);
			}
			if(event.keyCode==27){
				$('.arrow-down').parent().find('.bar').hide();
				_this.selectedArrow=='none';
			}
		});
		
		
		$('.arrow-down').dblclick(function(){
			$('.arrow-down').parent().find('.bar').hide();
			_this.selectedArrow=$(this).parent().attr('id');
			$(this).parent().find('.bar').show();
		});
		
		$('#'+this._playerId).find('#loadingMP').fadeOut('fast');
		
	},
	
	setInPoint: function(inPoint){
		if(this.debug.fun) console.log("html5 player ["+this._id+"] : fun : setInPoint");
		
		this._inPoint=inPoint;
		var m=getMinutes(inPoint);
		var s=getSeconds(inPoint);
		
		$('#'+this._playerId).find('#avStartMinutes').html(m);
		$('#'+this._playerId).find('#avStartSeconds').html(s);
		
		var left=parseFloat(inPoint)*parseFloat($('#'+this._playerId).find('#loadingOutsideMP').css('width'))/parseFloat(this._duration);
		$('#'+this._playerId).find('#startMP').css('left',left+"px");
		$('#'+this._playerId).find('#startBar').css('width',left+"px");
		
		this.setCurrentTime(this._inPoint);
	},
	
	setOutPoint:function(outPoint){
		if(this.debug.fun) console.log("html5 player ["+this._id+"] : fun : setOutPoint : "+outPoint);

		this._outPoint=outPoint;
		m=getMinutes(outPoint);
		s=getSeconds(outPoint);
		
		$('#'+this._playerId).find('#avStopMinutes').html(m);
		$('#'+this._playerId).find('#avStopSeconds').html(s);
		var left=parseFloat(outPoint)*parseFloat($('#'+this._playerId).find('#loadingOutsideMP').css('width'))/parseFloat(this._duration);
		$('#'+this._playerId).find('#stopMP').css('left',left+"px");
		var width=parseInt($('#'+this._playerId).find('#loadingOutsideMP').css('width'))-parseInt($('#'+this._playerId).find('#stopMP').css('left'));
		$('#'+this._playerId).find('#stopBar').css('width',width+"px");
		this.setCurrentTime(Math.max(this._inPoint,this._outPoint-3));
	},
	
	getInPoint: function(){
		if(this.debug.event) console.log("html5 player ["+this._id+"] : fun : getInPointning");

		return this._inPoint;
	},
	
	getOutPoint: function(){
		if(this.debug.event) console.log("html5 player ["+this._id+"] : fun : getOutPoint");

		return this._outPoint;
	},
	
	exit:function(){
		if(this.debug.fun) console.log("html5 player ["+this._id+"] : fun : exit");
		
		this.pause();
		$('#'+this._playerId).find('.mediaInput').unbind();
		$('#'+this._playerId).find('#loadingMP').show();
	},
		
	playPause:function(){
			if(this.debug.fun) console.log("html5 player ["+this._id+"] : fun : playPause");
		
			if(this._canPlay){
				if(this._asset.paused) this._asset.play();
				else this._asset.pause();
			}
			
	}
});


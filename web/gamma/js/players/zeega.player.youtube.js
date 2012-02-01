/************************************

	ZEEGA Youtube PLAYER CLASS
	
	TODO:
		

************************************/


var ZeegaYoutubePlayer = Class.extend({

	debug : {
			fun:true,
			event:true,
			time:false,
		},
	
	
	
	init: function(id,youtubeId,inPoint,outPoint,volume,wrapperId,playerId){
		if(this.debug.fun)console.log("youtube player ["+id+"] : function : init");
	
		var _this = this;
			
		this._id=id;
		this._youtubeId=youtubeId;
		this._source="http://www.youtube.com/v/"+this._youtubeId;
		this._inPoint=parseFloat(inPoint);
		this._outPoint=parseFloat(outPoint);
		this._volume=parseInt(volume);
		this._canPlay=0;
		this._duration;
		this._dragging;
		this._wrapperId=wrapperId;
		this._youtubePlayer;
		this._playerId=playerId;	
		this._interval;
		
		console.log(this)
		
		//Create wrapper
		
		var youtubeWrapper=document.createElement('div');
		youtubeWrapper.setAttribute('id','youtube-player-'+id);
		$('#'+this._wrapperId).append(youtubeWrapper);
		$('#layer-publish-'+id).bind('container-ready',function(){ _this.cueVideo(); });
		

		//Initialize swfobject
		var params = { allowScriptAccess: "always", wmode: "opaque", disablekb: "1" };
		var atts = { id: "youtube-player-"+id};
		swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&version=3&key=AI39si7oX_eCGjrxs2lil28MMQdXn-ZWhzku8fGsRVhju-pziYgmI3EOt0o4GmEl00vGXsA_OGGEKwX-xAM0a5Gbsr8zgrGpyg&playerapiid="+id, 
				   "youtube-player-"+id, '100%', '100%', "8", null, null, params, atts);
						
	
		//Add global listeners
		
		addGlobal(id,'stateChangePublish','layer-publish-'+id);
		$('#layer-publish-'+id).bind('stateChangePublish',function(event,data){_this.onEvent(data);});
		addGlobal(id,'timeUpdatePublish','layer-publish-'+id);
		$('#layer-publish-'+id).bind('timeUpdatePublish',function(event,data){_this.onTimeUpdate(data);});
		
	},
	cueVideo: function(){
		if(this.debug.event) console.log("youtube player ["+this._id+"] : fun: cueVideo");
		
		this._youtubePlayer = document.getElementById("youtube-player-"+this._id);
		this._youtubePlayer.mute();
		this._youtubePlayer.addEventListener("onStateChange", "LayerGlobals["+this._id+"].stateChangePublish",false);
		this._youtubePlayer.loadVideoById(this._youtubeId,parseFloat(this._inPoint));
		
	},
	
	onEvent: function(state){
		if(this.debug.event||1==1) console.log("youtube player ["+this._id+"] : event : "+state);
		if(state==1&&this._canPlay==0){
			this._canPlay=true;
			this._youtubePlayer.pauseVideo();
			this._youtubePlayer.setVolume(this._volume);
			this._duration=this._youtubePlayer.getDuration();
			if(this._outPoint==0) this._outPoint= this._duration;
			$('#'+this._playerId).trigger('ready',{'id':this._id});
		}
	},
	

	onTimeUpdate:function(){
		if(this.debug.time) console.log("youtube player ["+this._id+"] : event : onTimeUpdate");
		
		if(this._youtubePlayer.getCurrentTime()>this._outPoint+1||this._youtubePlayer.getCurrentTime()<this._inPoint-2){
			if(this._youtubePlayer.getCurrentTime()>this._outPoint+1)$('#'+this._playerId).trigger('ended',{'id':this._id});
			if(this._interval) clearInterval(this._interval);
			this._youtubePlayer.seekTo(this._inPoint);
			this.pause();	
		}
	},
	
	onEnded: function(){
		if(this.debug.event) console.log("youtube player ["+this._id+"] : event : onEnded");
		
		$('#'+this._playerId).trigger('ended',{'id':this._id});
		this._youtubePlayer.seekTo(this._inPoint);
		this.pause();
	},
	
	onPlay: function(){},
	
	onPause: function(){},
	
	pause:function(){
		if(this.debug.fun) console.log("youtube player ["+this._id+"] : fun : pause");
		
	
		if(this._interval){clearInterval(this._interval);}
		if(this._canPlay) this._youtubePlayer.pauseVideo();
	},
	
	play:function(){		
		if(this.debug.fun) console.log("youtube player ["+this._id+"] : fun : pause");
		
		if(this._interval) clearInterval(this._interval);
		if(this._canPlay){
			this._interval=setInterval("LayerGlobals['"+this._id+"'].timeUpdatePublish();",250);
			this._youtubePlayer.playVideo();
		}
	},
	
	setVolume:function(volume){
	if(this.debug.fun) console.log("youtube player ["+this._id+"] : fun : setVolume");
		
		if(isInt(volume)){
			if(volume<=100&&volume>=0){
				this._volume=volume;
				this._youtubePlayer.setVolume(this._volume);
			}
		}
	
	},
	
	getVolume:function(volume){
		if(this.debug.fun) console.log("youtube player ["+this._id+"] : fun : getVolume");
		return this._volume;
	},
	

	exit:function(){
		if(this.debug.fun) console.log("youtube player ["+this._id+"] : fun : exit");
		
		this.pause();
	}
});


var ZeegaYoutubeEditor = ZeegaYoutubePlayer.extend({


	
	
	
	init: function(id,youtubeId,inPoint,outPoint,volume,wrapperId,playerId){
		if(this.debug.fun)console.log("youtube player ["+id+"] : function : init");
	
		this._id=id;
		this._youtubeId=youtubeId;
		this._source="http://www.youtube.com/v/"+this._youtubeId;
		this._inPoint=parseFloat(inPoint);
		this._outPoint=parseFloat(outPoint);
		this._volume=parseInt(volume);
		this._canPlay=0;
		this._duration;
		this._dragging;
		this._wrapperId=wrapperId;
		var _this=this;
		this._youtubePlayer;
		this._playerId=playerId;	
		this._interval;
		
		//Create wrapper
		
		var youtubeWrapper=document.createElement('div');
		youtubeWrapper.setAttribute('id','youtube-player-'+id);
		$('#'+this._wrapperId).append(youtubeWrapper);
		$('#layer-preview-'+id).bind('container-ready',function(){ _this.cueVideo(); });
		

		//Initialize swfobject
		var params = { allowScriptAccess: "always", wmode: "opaque", disablekb: "1" };
		var atts = { id: "youtube-player-"+id};
		swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&version=3&key=AI39si7oX_eCGjrxs2lil28MMQdXn-ZWhzku8fGsRVhju-pziYgmI3EOt0o4GmEl00vGXsA_OGGEKwX-xAM0a5Gbsr8zgrGpyg&playerapiid="+id, 
				   "youtube-player-"+id, '100%', '100%', "8", null, null, params, atts);
						
	
		//Add global listeners
		
		addGlobal(id,'stateChangePublish','layer-preview-'+id);
		$('#layer-preview-'+id).bind('stateChangePublish',function(event,data){_this.onEvent(data);});
		addGlobal(id,'timeUpdatePublish','layer-preview-'+id);
		$('#layer-preview-'+id).bind('timeUpdatePublish',function(event,data){_this.onTimeUpdate(data);});
		
	},

	onEvent: function(state){
		if(this.debug.event) console.log("youtube player ["+this._id+"] : event : "+state);
		
		if(state==1&&this._canPlay==0){
			this._canPlay=true;
			this._youtubePlayer.pauseVideo();
			this._duration=this._youtubePlayer.getDuration();
			if(this._outPoint==0) this._outPoint= this._duration;
			this.loadControls();
		}
		else if(state==1) 	this.onPlay();
		if(state==2) this.onPause();
	
		
	},
	

	onTimeUpdate:function(){
		//if(this.debug.event) console.log("youtube player ["+this._id+"] : event : onTimeUpdate");
		
		if(this._youtubePlayer.getCurrentTime()>this._outPoint+1||this._youtubePlayer.getCurrentTime()<this._inPoint-2){
			if(this._youtubePlayer.getCurrentTime()>this._outPoint+1)$('#'+this._playerId).trigger('ended',{'id':this._id});
			if(this._interval) clearInterval(this._interval);
			this._youtubePlayer.seekTo(this._inPoint);
			this.pause();	
		}
		
		var currentTime=this._youtubePlayer.getCurrentTime();
		var displayTime=convertTime(currentTime);
		$('#'+this._playerId).find('#currentTime').html(displayTime);
		
		var currentLoc=parseFloat(currentTime)*parseFloat($('#'+this._playerId).find('#loadingOutsideMP').css('width'))/parseFloat(this._duration);
		if(!this._dragging){
			$('#'+this._playerId).find('#currentMP').css('left',currentLoc+"px");
			$('#'+this._playerId).find('#loadingInsideMP').css('width',currentLoc+"px");
		}
		
		
	},
	
	loadControls:function(){
		if(this.debug.fun) console.log("youtube player ["+this._id+"] : fun : loadControls");
		
		this._dragging=false;
		
		this.setVolume(this._volume);
		
		
		//Don't need to call set in point as loaded player at in point
		var m=getMinutes(this._inPoint);
		var s=getSeconds(this._inPoint);
		
		$('#'+this._playerId).find('#avStartMinutes').html(m);
		$('#'+this._playerId).find('#avStartSeconds').html(s);
		
		var left=parseFloat(this._inPoint)*parseFloat($('#'+this._playerId).find('#loadingOutsideMP').css('width'))/parseFloat(this._duration);
		$('#'+this._playerId).find('#startMP').css('left',left+"px");
		$('#'+this._playerId).find('#startBar').css('width',left+"px");
		
			var currentTime=this._youtubePlayer.getCurrentTime();
		var displayTime=convertTime(currentTime);
		$('#'+this._playerId).find('#currentTime').html(displayTime);
		
		var currentLoc=parseFloat(currentTime)*parseFloat($('#'+this._playerId).find('#loadingOutsideMP').css('width'))/parseFloat(this._duration);
		if(!this._dragging){
			$('#'+this._playerId).find('#currentMP').css('left',currentLoc+"px");
			$('#'+this._playerId).find('#loadingInsideMP').css('width',currentLoc+"px");
		}
		
		
		this.setOutPoint(this._outPoint);
		
		var _this=this;
		
		$('#'+this._playerId).find('#playMP').click(function(){_this.playPause();});
		
		$('#'+this._playerId).find('#currentMP').draggable({
			axis: 'x',containment: 'parent',
			start:function(){_this._dragging=true;}, 
			stop:function(){			
				var t=parseFloat($(this).css('left'))*parseFloat(_this._duration)/parseFloat($('#player-'+_this._id).find('#loadingOutsideMP').css('width')); 
				if(t>parseFloat(_this._outPoint)) t=Math.max(parseFloat(_this._inPoint),parseFloat(_this._outPoint)-5.0);
				_this._dragging=false;
				_this.setCurrentTime(t);
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
				_this.setCurrentTime(_this._inPoint);
				_this.setOutPoint(t);
				$('#'+_this._playerId).trigger('updated',{'id':this._id});
			}
		});
		
		$('#'+this._playerId).find('#volume-slider').css({'margin':'10px'}).slider({
				min : 0,
				max : 100,
				value :this._volume,
				step : 1,
				slide: function(e,ui){
					_this._youtubePlayer.setVolume(ui.value);
				},
				stop : function(e, ui){
					_this._volume=ui.value;
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
	
	onPlay: function(){
		if(this.debug.fun) console.log("youtube player ["+this._id+"] : event : onPlay");
		$('#'+this._playerId).find('#playMP').addClass('pauseButtonMP').removeClass('playButtonMP');
		
	},
	
	onPause: function(){
		if(this.debug.fun) console.log("youtube player ["+this._id+"] : event : onPause");
		
		$('#'+this._playerId).find('#playMP').addClass('playButtonMP').removeClass('pauseButtonMP');	
	},
	
	pause:function(){
		if(this.debug.event) console.log("youtube player ["+this._id+"] : fun : pause");
	
		if(this._interval){clearInterval(this._interval);}
		if(this._canPlay) this._youtubePlayer.pauseVideo();
	},
	
	play:function(){		
		if(this.debug.event) console.log("youtube player ["+this._id+"] : fun : play");
		
		if(this._interval) clearInterval(this._interval);
		if(this._canPlay){
			this._interval=setInterval("LayerGlobals['"+this._id+"'].timeUpdatePublish();",250);
			this._youtubePlayer.playVideo();
		}
	},
	
	setInPoint: function(inPoint){
		if(this.debug.fun) console.log("youtube player ["+this._id+"] : fun : setInPoint");
		
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
		if(this.debug.fun) console.log("youtube player ["+this._id+"] : fun : setOutPoint : "+outPoint);

		this._outPoint=outPoint;
		m=getMinutes(outPoint);
		s=getSeconds(outPoint);
		
		$('#'+this._playerId).find('#avStopMinutes').html(m);
		$('#'+this._playerId).find('#avStopSeconds').html(s);
		var left=parseFloat(outPoint)*parseFloat($('#'+this._playerId).find('#loadingOutsideMP').css('width'))/parseFloat(this._duration);
		$('#'+this._playerId).find('#stopMP').css('left',left+"px");
		var width=parseInt($('#'+this._playerId).find('#loadingOutsideMP').css('width'))-parseInt($('#'+this._playerId).find('#stopMP').css('left'));
		$('#'+this._playerId).find('#stopBar').css('width',width+"px");
		
		//this.setCurrentTime(Math.max(this._inPoint,this._outPoint-3));
		
	},
	
	setCurrentTime:function(currentTime){
			if(this.debug.fun) console.log("youtube player ["+this._id+"] : fun : setCurrentTime");

			if(this._interval) clearInterval(this._interval);
			this._youtubePlayer.pauseVideo();
			
			if(currentTime<this._inPoint) currentTime=this._inPoint;
			else if(currentTime>this._outPoint) currentTime=Math.max(0,this._outPoint-5);
			
			var displayTime=convertTime(currentTime);
			$('#'+this._playerId).find('#currentTime').html(displayTime);
		
			var currentLoc=parseFloat(currentTime)*parseFloat($('#'+this._playerId).find('#loadingOutsideMP').css('width'))/parseFloat(this._duration);
			if(!this._dragging){
				$('#'+this._playerId).find('#currentMP').css('left',currentLoc+"px");
				$('#'+this._playerId).find('#loadingInsideMP').css('width',currentLoc+"px");
			}
			
			this._youtubePlayer.seekTo(currentTime);
		
	},
	
	getInPoint: function(){
		if(this.debug.event) console.log("youtube player ["+this._id+"] : fun : getInPointning");

		return this._inPoint;
	},
	
	getOutPoint: function(){
		if(this.debug.event) console.log("youtube player ["+this._id+"] : fun : getOutPoint");

		return this._outPoint;
	},

	exit:function(){
		if(this.debug.event) console.log("youtube player ["+this._id+"] : fun : exit");
		
		this.pause();
		$('#'+this._playerId).find('.mediaInput').unbind();
		$('#'+this._playerId).find('#loadingMP').show();
	},
	
	playPause:function(){
				if(this.debug.event) console.log("youtube player ["+this._id+"] : fun : playPause");
			
			if(this._canPlay){
				if(this._youtubePlayer.getPlayerState()==2) this.play();
				else if(this._youtubePlayer.getPlayerState()==1)	this.pause();				
			}
			
	}
});


//Global event listener

function onYouTubePlayerReady(playerId) {
	console.log( 'Youtube Container Ready:'+playerId);
	$('#layer-publish-'+playerId).trigger('container-ready');
	$('#layer-preview-'+playerId).trigger('container-ready');
}


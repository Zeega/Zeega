/************************************

	ZEEGA Youtube PLAYER CLASS
	
	TODO:
		Clean up a bit (remove numeric input?)

************************************/


var debug=true;

var interval;

var ZeegaYoutube = Class.extend({


	

	init: function(id,youtubeId,mediaIn,mediaOut,mediaVol,wrapperId,w,h){
		console.log('init youtube layer');
		if(debug)console.log("player:init");
		this._id=id;
		this._youtube_id=youtubeId;
		this._source="http://www.youtube.com/v/"+this._youtube_id;
		this._start_time=parseFloat(mediaIn);
		this._stop_time=parseFloat(mediaOut);
		this._vol=parseInt(mediaVol);
		this._loaded=false;
		this._canplay=false;
		this._dur;
		this._dragging;
		this._wrapper_id=wrapperId;
		var that=this;
		this._can_play=0;
		this.youtubePlayer;
		var youtubeWrapper=document.createElement('div');
		youtubeWrapper.setAttribute('id','youtube-player-'+id);
		$('#'+this._wrapper_id).append(youtubeWrapper);
		$('#layer-preview-'+id).bind('ready',function(){
			that.cueVideo();
		
		});

		var width=Math.floor(parseInt($('#zeega-player').css('width'))*parseInt(w)/100.0);
		var height=Math.floor(parseInt($('#zeega-player').css('height'))*parseInt(h)/100.0);
		
		width=600;
		height=400;
		
		var params = { allowScriptAccess: "always", wmode: "opaque", disablekb: "1" };
		var atts = { id: "youtube-player-"+id};
		swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&version=3&key=AI39si7oX_eCGjrxs2lil28MMQdXn-ZWhzku8fGsRVhju-pziYgmI3EOt0o4GmEl00vGXsA_OGGEKwX-xAM0a5Gbsr8zgrGpyg&playerapiid="+id, 
						   "youtube-player-"+id, width, height, "8", null, null, params, atts);
		
		this._loaded=true;
		
		
		addGlobal(id,'timeUpdate','layer-preview-'+id);
		$('#layer-preview-'+id).bind('timeUpdate',function(event,data){console.log('timeupdate');that.timeUpdate(data);});
		addGlobal(id,'stateChange','layer-preview-'+id);
		$('#layer-preview-'+id).bind('stateChange',function(event,data){that.event(data);});
	},
	
	event: function(state){
	console.log(state);
		if(state==1&&this._canplay==0){			
			this.youtubePlayer.pauseVideo();
			this.youtubePlayer.setVolume(this._vol);
			this._canplay=1;
			this._dur=this.youtubePlayer.getDuration();
			if(this._stop_time==0) this._stop_time= this._dur;
			this.setup();
		}
	
	},
	
	cueVideo: function(){
		this.youtubePlayer = document.getElementById("youtube-player-"+this._id);
		this.youtubePlayer.mute();
		this.youtubePlayer.addEventListener("onStateChange", "LayerGlobals["+this._id+"].stateChange",true);
		//$('#youtube-player-'+id).bind('stateChange',function(event,data){that.youtubeEvent(data);});
		this.youtubePlayer.loadVideoById(this._youtube_id,parseFloat(this._start_time));

	},
	
	
	timeUpdate:function(){
		
		if(debug)console.log("player:updateCurrentTime");
		
		if(this.youtubePlayer.getCurrentTime()>this._stop_time||this.youtubePlayer.getCurrentTime()<this._start_time){
			if(interval){clearInterval(interval);}
			this.setCurrentTime(this._start_time);
			
		}
		var displayTime=convertTime(this.youtubePlayer.getCurrentTime());
		$('#player-'+this._id).find('#currentTime').html(displayTime);
		
		var currentLoc=parseFloat(this.youtubePlayer.getCurrentTime())*parseFloat($('#player-'+this._id).find('#loadingOutsideMP').css('width'))/parseFloat(this._dur);
		
		if(!this._dragging){
			$('#player-'+this._id).find('#currentMP').css('left',currentLoc+"px");
			$('#player-'+this._id).find('#loadingInsideMP').css('width',currentLoc+"px");
		}
		
		
	},
	
	ended: function(){
		if(debug)console.log("player:ended");
		this.pause();
		$('#player-'+this._id).find('#playMP').addClass('pauseButtonMP').removeClass('playButtonMP');
		this.timeUpdate(this._start_time);
	},
	
	setup:function(){
		
		if(debug)console.log("player:setup");
		var that=this;
		
		//this.initiateAsset();
		
		$('#layerDuration').html(convertTime(this._dur));
		this.informGraphicInput(this._dur,this._start_time,this._stop_time,this._vol);
		this.informNumericInput(this._start_time,this._stop_time);
		$('#player-'+this._id).find('#playMP').click(function(){that.playPause();});
		
		$('#player-'+this._id).find('#currentMP').draggable({axis: 'x',containment: 'parent',start:function(){that._dragging=true;}, stop:function(){			
			var t=parseFloat($(this).css('left'))*parseFloat(that._dur)/parseFloat($('#player-'+that._id).find('#loadingOutsideMP').css('width')); 
			that.setCurrentTime(t);
			that._dragging=false;
		}});
		$('#player-'+this._id).find('#volumeMP').click(function(){
			that.timeUpdate();
		});
		
		$('#player-'+this._id).find('#startMP').draggable({axis: 'x',containment: 'parent',stop:function(){
			
			var t=parseFloat($(this).css('left'))*parseFloat(that._dur)/parseFloat($('#player-'+that._id).find('#loadingOutsideMP').css('width')); 
			if(t>parseFloat(that._stop_time)) t=Math.max(0,parseFloat(that._stop_time)-10.0);
			
			that.informGraphicInput(that._dur,t,-1,-1);
			that.informNumericInput(t,-1);
			that.updateAsset(t,-1);
			that.setCurrentTime(t);
			
		
		}});
		
		$('#player-'+this._id).find('#stopMP').draggable({axis: 'x',containment: 'parent',
			stop:function(){
				var t=parseFloat($(this).css('left'))*parseFloat(that._dur)/parseFloat($('#player-'+that._id).find('#loadingOutsideMP').css('width')); 
				if(t<parseFloat(that._start_time)){
					t=Math.min(parseFloat(that._dur),parseFloat(that._start_time)+10.0);
					console.log(t+" "+	that._start_time);
				}
				that.informGraphicInput(that._dur,-1,t,-1);
				that.informNumericInput(-1,t);
				that.updateAsset(-1,t);
				if(that.youtubePlayer.getCurrentTime()>t) that.setCurrentTime(that._start_time);
				
			}
		});
		
		
	
		
		$('#player-'+this._id).find('#stopMP').draggable('option','disabled',false);
		$('#player-'+this._id).find('#startMP').draggable('option','disabled',false);
		$('#player-'+this._id).find('#currentMP').draggable('option','disabled',false);
		
		
		this.setCurrentTime(this._start_time);
		$('#player-'+this._id).find('#loadingMP').fadeOut('fast');
		
		
		$('#player-'+this._id).find('#volume-slider').slider({
				min : 0,
				max : 100,
				value : that._vol,
				step : 1,
				slide: function(e,ui){
					that._vol=ui.value;
					that.youtubePlayer.setVolume(that._vol);
				},
				stop : function(e, ui){
				
					that._vol=ui.value;
					that.youtubePlayer.setVolume(that._vol);
					$('#player-'+that._id).trigger('updated');
				}
		});
		$('body').keydown(function(event) {
			if(that.selectedArrow=='startMP'){
				
			
				if(event.keyCode==37&&that._start_time>0.1){
				
				that._start_time=that._start_time-0.1;
				
				
				}
				else if(event.keyCode==39&&that._stop_time-that._start_time>0.1) {
				
				that._start_time=that._start_time+0.1;
				
				}
		
				
				that.informNumericInput(that._start_time,that._stop_time);
				that.setCurrentTime(that._start_time);
			}
			else if(that.selectedArrow=='stopMP'){
				
			
				if(event.keyCode==37&&that._stop_time-that._start_time>0.1){
				
				that._stop_time=that._stop_time-0.1;
				
				
				}
				else if(event.keyCode==39&&that._dur-that._stop_time>0.1) {
				
				that._stop_time=that._stop_time+0.1;
				}
				
				that.informNumericInput(that._start_time,that._stop_time);
				that.setCurrentTime(that._stop_time-.01);
			}
		});
		
		$('.arrow-down').dblclick(function(){
			$('.arrow-down').parent().find('.bar').hide();
			that.selectedArrow=$(this).parent().attr('id');
			$(this).parent().find('.bar').show();
		});
		
	},
	
	informGraphicInput:function(duration,startTime,stopTime,volume){
	
	if(debug)console.log("player:informGraphicInput");
	
	if(startTime!=-1){
		var leftStart=parseFloat(startTime)*parseFloat($('#player-'+this._id).find('#loadingOutsideMP').css('width'))/parseFloat(duration);
		$('#player-'+this._id).find('#startMP').css('left',leftStart+"px");
		$('#player-'+this._id).find('#startBar').css('width',leftStart+"px");

		
	}	
	if(stopTime!=-1){
		var leftStop=parseFloat(stopTime)*parseFloat($('#player-'+this._id).find('#loadingOutsideMP').css('width'))/parseFloat(duration);
		$('#player-'+this._id).find('#stopMP').css('left',leftStop+"px");
		var r=parseInt($('#player-'+this._id).find('#loadingOutsideMP').css('width'))-parseInt($('#player-'+this._id).find('#stopMP').css('left'));
		$('#player-'+this._id).find('#stopBar').css('width',r+"px");
	}	
	
	
	},
	
	informNumericInput:function(startTime,stopTime){
			
			
			if(debug)console.log("player:informNumericInput:"+startTime);
			if(startTime!=-1){
				var m=getMinutes(startTime);
				var s=getSeconds(startTime);
				
				$('#player-'+this._id).find('#avStartMinutes').attr('value',m);
				$('#player-'+this._id).find('#avStartSeconds').attr('value',s);
			}
			if(stopTime!=-1){
				m=getMinutes(stopTime);
				s=getSeconds(stopTime);
				
				$('#player-'+this._id).find('#avStopMinutes').attr('value',m);
				$('#player-'+this._id).find('#avStopSeconds').attr('value',s);
			}
			
			
			
	
	},
	
	setVolume:function(volume){
		if(isInt(volume)){
			if(volume<=100&&volume>=0){
				this._vol=volume;
				this.youtubePlayer.setVolume(this._vol);
			}
		}
	
	},
	
	
	updateAsset:function(startTime,stopTime){
	
		if(debug)console.log("player:updateAsset");
		
		if(startTime!=-1) this._start_time=startTime;
		if(stopTime!=-1) this._stop_time=stopTime;

		$('#player-'+this._id).trigger('updated');
			
		
	
	},
	
	
	initiateAsset:function(){
		if(debug)console.log("player:initiateAsset");
		this.youtubePlayer.seekTo(this._start_time);
		$('#player-'+this._id).find('#startMP').css('left',this._start_time*parseFloat($('#player-'+this._id).find('#loadingOutsideMP').css('width'))/this._dur);
		$('#player-'+this._id).find('#currentMP').css('left',this._start_time*parseFloat($('#player-'+this._id).find('#loadingOutsideMP').css('width'))/this._dur);
		
	},
	
	setCurrentTime:function(currentTime){
			if(this._interval){clearInterval(interval);}
			if(debug)console.log("player:setCurrentTime");
			this.youtubePlayer.pauseVideo();
			
			this.youtubePlayer.seekTo(currentTime);
			this.timeUpdate();
	},
	
	exit:function(){
			if(debug)console.log("player:exit");
			$('#player-'+this._id).find('.mediaInput').unbind();
			this.pause();
			
			//$('#player-'+this._id).find('#stopMP').draggable('option','disabled',true);
			//$('#player-'+this._id).find('#startMP').draggable('option','disabled',true);
			//$('#player-'+this._id).find('#currentMP').draggable('option','disabled',true);
			//$('#player-'+this._id).find('#avVolumeSlider').slider("option","disabled",true);
			
			$('#player-'+this._id).find('#loadingMP').show();
	},
		
	pause:function(){
			if(this._interval){clearInterval(this._interval);}
			if(debug)console.log("player:pause");
			if(this._canplay){
				this.youtubePlayer.pauseVideo();
				 $('#player-'+this._id).find('#playMP').addClass('playButtonMP').removeClass('pauseButtonMP');
			}
			
			
	},
	playPause:function(){
		if(this._interval){clearInterval(this._interval);}
		if(debug)console.log("player:playPause");
		if(this.youtubePlayer){
			if(this.youtubePlayer.getPlayerState()==1){
				this.youtubePlayer.pauseVideo();
				
				$('#player-'+this._id).find('#playMP').addClass('playButtonMP').removeClass('pauseButtonMP');
			}
			else{
				this.youtubePlayer.playVideo();
				this._interval=setInterval("LayerGlobals['"+this._id+"'].timeUpdate();",250);
				$('#player-'+this._id).find('#playMP').addClass('pauseButtonMP').removeClass('playButtonMP');
			}
		}
	}
});

var ZeegaYoutubePublish = Class.extend({


	

	init: function(id,youtubeId,mediaIn,mediaOut,mediaVol,wrapperId,playerId,w,h){
		console.log('init youtube layer');
		if(debug)console.log("player:init");
		this._id=id;
		this._youtube_id=youtubeId;
		this._source="http://www.youtube.com/v/"+this._youtube_id;
		this._start_time=parseFloat(mediaIn);
		this._stop_time=parseFloat(mediaOut);
		this._vol=parseInt(mediaVol);
		this._loaded=false;
		this._canplay=false;
		this._dur;
		this._wrapper_id=wrapperId;
		var that=this;
		this._can_play=0;
		this._player_id=playerId;
		this.youtubePlayer;
		this._interval;
		var youtubeWrapper=document.createElement('div');
		youtubeWrapper.setAttribute('id','youtube-player-'+id);
		$('#'+this._wrapper_id).append(youtubeWrapper);
		$('#layer-publish-'+id).bind('ready',function(){
			that.cueVideo();
		
		});
		this._dragging
		var width=Math.floor(parseInt($('#zeega-player').css('width'))*parseInt(w)/100.0);
		var height=Math.floor(parseInt($('#zeega-player').css('height'))*parseInt(h)/100.0);
		console.log("w:"+width+",h:"+height);
	
		var params = { allowScriptAccess: "always", wmode: "opaque", disablekb: "1" };
		var atts = { id: "youtube-player-"+id};
		swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&version=3&key=AI39si7oX_eCGjrxs2lil28MMQdXn-ZWhzku8fGsRVhju-pziYgmI3EOt0o4GmEl00vGXsA_OGGEKwX-xAM0a5Gbsr8zgrGpyg&playerapiid="+id, 
						   "youtube-player-"+id, width, height, "8", null, null, params, atts);
		
		this._loaded=true;
		
		addGlobal(id,'stateChangePublish','layer-publish-'+id);
		$('#layer-publish-'+id).bind('stateChangePublish',function(event,data){that.event(data);});
		addGlobal(id,'timeUpdatePublish','layer-publish-'+id);
		$('#layer-publish-'+id).bind('timeUpdatePublish',function(event,data){that.timeUpdate(data);});
		
	},
	
	event: function(state){
	console.log(state);
		if(state==1&&this._canplay==0){
			console.log('setting vol');
			this.youtubePlayer.pauseVideo();
			this.youtubePlayer.setVolume(this._vol);
			this._canplay=1;
			this._dur=this.youtubePlayer.getDuration();
			if(this._stop_time==0) this._stop_time= this._dur;
			$('#'+this._player_id).trigger('ready',{'id':this._id});
		}
	},
	
	cueVideo: function(){
		this.youtubePlayer = document.getElementById("youtube-player-"+this._id);
		this.youtubePlayer.mute();
		this.youtubePlayer.addEventListener("onStateChange", "LayerGlobals["+this._id+"].stateChangePublish",false);
		this.youtubePlayer.loadVideoById(this._youtube_id,parseFloat(this._start_time));
		
	},
	
	
	timeUpdate:function(){
		
	
		
		if(debug)console.log("player:updateCurrentTime");
		
		if(this.youtubePlayer.getCurrentTime()>this._stop_time+2||this.youtubePlayer.getCurrentTime()<this._start_time-2){
			if(interval){clearInterval(interval);}
			$('#'+this._player_id).trigger('ended',{'id':this._id});
			
			this.youtubePlayer.seekTo(this._start_time);
			this.pause();	
			$('#'+this._player_id).trigger('ended',{'id':this._id});
			
			console.log('youtube ended');
		}
		
		var displayTime=convertTime(this.youtubePlayer.getCurrentTime());
		$('#player-'+this._id).find('#currentTime').html(displayTime);
		
		var currentLoc=parseFloat(this.youtubePlayer.getCurrentTime())*parseFloat($('#player-'+this._id).find('#loadingOutsideMP').css('width'))/parseFloat(this._dur);
		
		if(!this._dragging){
			$('#player-'+this._id).find('#currentMP').css('left',currentLoc+"px");
			$('#player-'+this._id).find('#loadingInsideMP').css('width',currentLoc+"px");
		}
		
		
	},
	
	ended: function(){
		if(debug)console.log("player:ended");
		this.pause();
		$('#player-'+this._id).find('#playMP').addClass('pauseButtonMP').removeClass('playButtonMP');
		this.timeUpdate(this._start_time);
	},
	

	
	informGraphicInput:function(duration,startTime,stopTime,volume){
	
	if(debug)console.log("player:informGraphicInput");
	
	if(startTime!=-1){
		var leftStart=parseFloat(startTime)*parseFloat($('#player-'+this._id).find('#loadingOutsideMP').css('width'))/parseFloat(duration);
		$('#player-'+this._id).find('#startMP').css('left',leftStart+"px");
		$('#player-'+this._id).find('#startBar').css('width',leftStart+"px");

		
	}	
	if(stopTime!=-1){
		var leftStop=parseFloat(stopTime)*parseFloat($('#player-'+this._id).find('#loadingOutsideMP').css('width'))/parseFloat(duration);
		$('#player-'+this._id).find('#stopMP').css('left',leftStop+"px");
		var r=parseInt($('#player-'+this._id).find('#loadingOutsideMP').css('width'))-parseInt($('#player-'+this._id).find('#stopMP').css('left'));
		$('#player-'+this._id).find('#stopBar').css('width',r+"px");
	}	
	
	
	},
	
	informNumericInput:function(startTime,stopTime){
			
			
			if(debug)console.log("player:informNumericInput:"+startTime);
			if(startTime!=-1){
				var m=getMinutes(startTime);
				var s=getSeconds(startTime);
				
				$('#player-'+this._id).find('#avStartMinutes').attr('value',m);
				$('#player-'+this._id).find('#avStartSeconds').attr('value',s);
			}
			if(stopTime!=-1){
				m=getMinutes(stopTime);
				s=getSeconds(stopTime);
				
				$('#player-'+this._id).find('#avStopMinutes').attr('value',m);
				$('#player-'+this._id).find('#avStopSeconds').attr('value',s);
			}
			
			
			
	
	},
	
	setVolume:function(volume){
		if(isInt(volume)){
			if(volume<=100&&volume>=0){
				this._vol=volume;
				this.youtubePlayer.setVolume(this._vol);
			}
		}
	
	},
	
	
	updateAsset:function(startTime,stopTime){
	
		if(debug)console.log("player:updateAsset");
		
		if(startTime!=-1) this._start_time=startTime;
		if(stopTime!=-1) this._stop_time=stopTime;

		$('#player-'+this._id).trigger('updated');
			
		
	
	},
	
	
	initiateAsset:function(){
		if(debug)console.log("player:initiateAsset");
		this.youtubePlayer.seekTo(this._start_time);
		$('#player-'+this._id).find('#startMP').css('left',this._start_time*parseFloat($('#player-'+this._id).find('#loadingOutsideMP').css('width'))/this._dur);
		$('#player-'+this._id).find('#currentMP').css('left',this._start_time*parseFloat($('#player-'+this._id).find('#loadingOutsideMP').css('width'))/this._dur);
		
	},
	
	setCurrentTime:function(currentTime){
			if(debug)console.log("player:setCurrentTime");
			this.youtubePlayer.pauseVideo();
			this.youtubePlayer.seekTo(this._start_time);
			this.timeUpdate();
	},
	
	exit:function(){
			if(debug)console.log("player:exit");
			$('#player-'+this._id).find('.mediaInput').unbind();
			this.pause();
			
			//$('#player-'+this._id).find('#stopMP').draggable('option','disabled',true);
			//$('#player-'+this._id).find('#startMP').draggable('option','disabled',true);
			//$('#player-'+this._id).find('#currentMP').draggable('option','disabled',true);
			//$('#player-'+this._id).find('#avVolumeSlider').slider("option","disabled",true);
			
			$('#player-'+this._id).find('#loadingMP').show();
	},
		
	pause:function(){
			if(this._interval){clearInterval(this._interval);}
			if(debug)console.log("player:pause");
			if(this._canplay){
				this.youtubePlayer.pauseVideo();
				 $('#player-'+this._id).find('#playMP').addClass('playButtonMP').removeClass('pauseButtonMP');
			}
			
			
	},
	
	play:function(){
	if(this._interval){clearInterval(this._interval);}
			if(debug)console.log("youtube player:play");
			if(this._canplay){
				
				this._interval=setInterval("LayerGlobals['"+this._id+"'].timeUpdatePublish();",250);
				this.youtubePlayer.playVideo();
			}
			
			
	},
	playPause:function(){
		if(this._interval){clearInterval(this._interval);}
		if(debug)console.log("youtube player:playPause");
		if(this.youtubePlayer){
			if(this.youtubePlayer.getPlayerState()==1){
				this.youtubePlayer.pauseVideo();
				$('#player-'+this._id).find('#playMP').addClass('playButtonMP').removeClass('pauseButtonMP');
			}
			else{
				this.youtubePlayer.playVideo();
				
				 this._interval=setInterval("LayerGlobals['"+this._id+"'].timeUpdatePublish();",250);
				$('#player-'+this._id).find('#playMP').addClass('pauseButtonMP').removeClass('playButtonMP');
			}
		}
	}
});

//Utilities

function videoLoadedYoutube(data){

	console.log(data);

}
function onYouTubePlayerReady(playerId) {
	
	$('#layer-publish-'+playerId).trigger('ready');
	$('#layer-preview-'+playerId).trigger('ready');
}


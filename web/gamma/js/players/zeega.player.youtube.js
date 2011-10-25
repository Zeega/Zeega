/************************************

	ZEEGA Youtube PLAYER CLASS
	
	TODO:
		Clean up a bit (remove numeric input?)

************************************/


var debug=true;


var ZeegaYoutube = Class.extend({


	

	init: function(id,youtubeId,mediaIn,mediaOut,mediaVol,wrapperId,width,height){
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
		this._start_time=mediaIn;
		this._stop_time=mediaOut;
		var that=this;
			this.youtubePlayer;
		var youtubeWrapper=document.createElement('div');
		youtubeWrapper.setAttribute('id','youtube-player-'+id);
		$('#'+this._wrapper_id).append(youtubeWrapper);
		$('#layer-preview-'+id).bind('ready',function(){
			that.cueVideo();
		
		});
		var params = { allowScriptAccess: "always", wmode: "opaque", disablekb: "1" };
		var atts = { id: "youtube-player-"+id};
		swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&version=3&key=AI39si7oX_eCGjrxs2lil28MMQdXn-ZWhzku8fGsRVhju-pziYgmI3EOt0o4GmEl00vGXsA_OGGEKwX-xAM0a5Gbsr8zgrGpyg&playerapiid="+id, 
						   "youtube-player-"+id, width, height, "8", null, null, params, atts);
		
		this._loaded=true;
		
		addGlobal(id,'stateChange','layer-preview-'+id);
		$('#layer-preview-'+id).bind('stateChange',function(event,data){console.log(data);});
		LayerGlobals[id].stateChange('77');
	},
	
	youtubeEvent: function(state){
		console.log("youtube event"+state);
	},
	
	cueVideo: function(){
		this.youtubePlayer = document.getElementById("youtube-player-"+this._id);
		this.youtubePlayer.mute();
		this.youtubePlayer.addEventListener("onStateChange", "LayerGlobals["+this._id+"].stateChange",true);
		//$('#youtube-player-'+id).bind('stateChange',function(event,data){that.youtubeEvent(data);});
		this.youtubePlayer.loadVideoById(this._youtube_id,parseFloat(this._start_time));

	},
	
	canPlay:function(){
	
		if(debug)console.log("player:canPlay");
		this._canplay=1;
		this.setup();
	},
	
	durationChange:function(){
	
		if(debug)console.log("player:durationChange");
		this._dur=Math.round(this._asset.duration*1000)/1000.0;
		if(this._stop_time==0) this._stop_time= this._dur;
	
	
	},
	
	timeUpdate:function(){
		
		if(debug)console.log("player:updateCurrentTime");
		
		if(this._asset.currentTime>this._stop_time||this._asset.currentTime<this._start_time){
			this._asset.currentTime=this._start_time;
			this.pause();	
		}
		var displayTime=convertTime(this._asset.currentTime);
		$('#player-'+this._id).find('#currentTime').html(displayTime);
		
		var currentLoc=parseFloat(this._asset.currentTime)*parseFloat($('#player-'+this._id).find('#loadingOutsideMP').css('width'))/parseFloat(this._dur);
		
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
		
		this.initiateAsset();
		
		$('#layerDuration').html(convertTime(this._dur));
		this.informGraphicInput(this._dur,this._start_time,this._stop_time,this._vol);
		this.informNumericInput(this._start_time,this._stop_time);
		$('#player-'+this._id).find('#playMP').click(function(){that.playPause();});
		
		$('#player-'+this._id).find('#currentMP').draggable({axis: 'x',containment: 'parent',start:function(){that._dragging=true;}, stop:function(){			
			var t=parseFloat($(this).css('left'))*parseFloat(that._dur)/parseFloat($('#player-'+that._id).find('#loadingOutsideMP').css('width')); 
			that.setCurrentTime(t);
			that._dragging=false;
		}});
		
		$('#player-'+this._id).find('#startMP').draggable({axis: 'x',containment: 'parent',stop:function(){
		
			var t=parseFloat($(this).css('left'))*parseFloat(that._dur)/parseFloat($('#player-'+that._id).find('#loadingOutsideMP').css('width')); 
			if(t>parseFloat(that._stop_time)) t=Math.max(0,parseFloat(that._stop_time)-10.0);
			that.setCurrentTime(t);
			that.informGraphicInput(that._dur,t,-1,-1);
			that.informNumericInput(t,-1);
			that.updateAsset(t,-1);
			
		
		}});
		
		$('#player-'+this._id).find('#stopMP').draggable({axis: 'x',containment: 'parent',stop:function(){
			var t=parseFloat($(this).css('left'))*parseFloat(that._dur)/parseFloat($('#player-'+that._id).find('#loadingOutsideMP').css('width')); 
			if(t<parseFloat(that._start_time)){
				t=Math.min(parseFloat(that._dur),parseFloat(that._start_time)+10.0);
				console.log(t+" "+	that._start_time);
			}
			if(that._asset.currentTime>t) that.setCurrentTime(that._start_time);
			that.informGraphicInput(that._dur,-1,t,-1);
			that.informNumericInput(-1,t);
			that.updateAsset(-1,t);
			
		}});
		
		
	
		
		$('#player-'+this._id).find('#stopMP').draggable('option','disabled',false);
		$('#player-'+this._id).find('#startMP').draggable('option','disabled',false);
		$('#player-'+this._id).find('#currentMP').draggable('option','disabled',false);
		
		
		this.setCurrentTime(this._start_time);
		$('#player-'+this._id).find('#loadingMP').fadeOut('fast');
		this._asset.volume=this._vol;
		
		var vol=Math.floor(this._vol*100);
		
		$('#player-'+this._id).find('#volume-slider').slider({
				min : 0,
				max : 100,
				value : vol,
				step : 1,
				slide: function(e,ui){
					that._vol=parseFloat(ui.value)/100.0;
					that._asset.volume=that._vol;
				},
				stop : function(e, ui){
				
					that._vol=parseFloat(ui.value)/100.0;
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
		if(isInt(volume)&&this._asset.duration>0){
			if(volume<=100&&volume>=0){
				this._vol=parseFloat(volume)/100.0;
				this._asset.volume=this._vol;
				console.log("volume changed to:"+this._vol);
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
		this._asset.currentTime=this._start_time;
		$('#player-'+this._id).find('#startMP').css('left',this._start_time*parseFloat($('#player-'+this._id).find('#loadingOutsideMP').css('width'))/this._dur);
		$('#player-'+this._id).find('#currentMP').css('left',this._start_time*parseFloat($('#player-'+this._id).find('#loadingOutsideMP').css('width'))/this._dur);
		this._asset.volume=this._vol;
	},
	
	setCurrentTime:function(currentTime){
			if(debug)console.log("player:setCurrentTime");
			this.pause();
			this._asset.currentTime= currentTime;
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
			if(debug)console.log("player:pause");
			if(this._canplay){
				this._asset.pause();
				 $('#player-'+this._id).find('#playMP').addClass('playButtonMP').removeClass('pauseButtonMP');
			}
			
	},
		
	playPause:function(){
			if(debug)console.log("player:playPause");
			if(this._canplay){
				console.log("canplay");
				if(this._asset.paused){ this._asset.play(); $('#player-'+this._id).find('#playMP').addClass('pauseButtonMP').removeClass('playButtonMP');}
				else{ this._asset.pause();$('#player-'+this._id).find('#playMP').addClass('playButtonMP').removeClass('pauseButtonMP');}
			}
	}
});


//Utilities

function videoLoadedYoutube(data){

	console.log(data);

}
function onYouTubePlayerReady(playerId) {

	$('#layer-preview-'+playerId).trigger('ready');
}


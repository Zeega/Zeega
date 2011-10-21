/************************************

	ZEEGA MEDIA PLAYER CLASS
	
	TODO:
		Clean up a bit (remove numeric input?)

************************************/


var debug=true;


var ZeegaAV = Class.extend({

	init: function(id,url,mediaIn,mediaOut,mediaVol,wrapperId,playerId){
	
		if(debug)console.log("player:init");
		this._id=id;
		this._url=url;
		this._start_time=parseFloat(mediaIn);
		this._stop_time=parseFloat(mediaOut);
		this._vol=parseFloat(mediaVol)/100.0;
		this._loaded=false;
		this._canplay=false;
		this._dur;
		this._asset=document.createElement('video');
		this._asset.setAttribute('id','media_'+this._id);
		this._asset.setAttribute('src',this._url);
		this._wrapper_id=wrapperId;
		this._selectedArrow='none';
		
		
		this._playerId=playerId;
		
		this._asset.setAttribute('width',"100%");
		//this._asset.setAttribute('height',"100%");
		this._dragging=false;
				
		var that=this;
		this._loaded=true;
		this._asset.addEventListener('canplay',function(){that.canPlay();},false);
		this._asset.addEventListener("ended", function() {that.ended();},false);
		this._asset.addEventListener("timeupdate", function() {that.timeUpdate();},false);
		this._asset.addEventListener('durationchange', function () {that.durationChange();},false);
		$('#'+this._wrapper_id).html(this._asset);
		if(this._asset.duration>0) this.canPlay();
		
	},
	
	canPlay:function(){
	
		if(debug)console.log("player:canPlay");
		this._canplay=1;
		this._asset.currentTime=this._start_time;
		this._asset.volume=this._vol;
		$('#'+this._playerId).trigger('ready',{'id':this._id});
		//this._asset.play();
	},
	
	durationChange:function(){
	
		if(debug)console.log("player:durationChange");
		this._dur=Math.round(this._asset.duration*1000)/1000.0;
		if(this._stop_time==0) this._stop_time= this._dur;
	
	
	},
	
	timeUpdate:function(){
		
		if(debug)console.log("player:updateCurrentTime");
		
		if(this._asset.currentTime>this._stop_time||this._asset.currentTime<this._start_time){
			$('#'+this._playerId).trigger('ended',{'id':this._id});
			this.pause();
			this._asset.currentTime=this._start_time;
				
		}
	
		
		
	},
	
	ended: function(){
		if(debug)console.log("player:ended");
		this.pause();
		this._asset.currentTime=this._start_time;
		
	},
	
	pause: function(){
	
		if(!this._asset.paused){
		this._asset.pause();
		
		}
	},
	
	play: function(){
	
		if(this._asset.paused){
		this._asset.play();
		
		}
	},
	
	exit:function(){
			if(debug)console.log("player:exit");
			this.pause();
	},
		

});

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
		if(this._start_time==0) this._asset.addEventListener('canplay',function(){that.canPlay();},false);
		else this._asset.addEventListener('progress',function(){that.checkProgress();},false);
		this._asset.addEventListener("ended", function() {that.ended();},false);
		this._asset.addEventListener("timeupdate", function() {that.timeUpdate();},false);
		this._asset.addEventListener('durationchange', function () {that.durationChange();},false);
		$('#'+this._wrapper_id).html(this._asset);
		if(this._asset.duration>0&&this._asset.buffered.end(0)>this._start_time) {
			
			this.canPlay();
		}
	},
	
	checkProgress:function(){
		console.log(this._asset.buffered.end(0));
		if(!this._canplay&&this._asset.duration>0) {
			this._asset.currentTime=this._start_time;
			
			if(this._asset.buffered.end(0)>0){
				this._canplay=1;
				this.canPlay();
			}
			
		}

	},
	
	canPlay:function(){
	
		if(debug)console.log("player:canPlay"+ this._id);
		
		this._canplay=1;
		this._asset.currentTime=this._start_time;
		this._asset.volume=this._vol;
		console.log('The current starting time is now:'+this._asset.currentTime);
		$('#'+this._playerId).trigger('ready',{'id':this._id});
		//this._asset.play();
	},
	
	durationChange:function(){
	
		if(debug)console.log('player:durationChange');
		this._dur=Math.round(this._asset.duration*1000)/1000.0;
		if(this._stop_time==0) this._stop_time= this._dur;
		this.checkProgress();
	
	
	},
	
	timeUpdate:function(){
		
		if(debug)console.log('player:updateCurrentTime');
		
		//	must include a slight margin of error (+/- 0.1) due to the imprecision of in/out points
		if(this._asset.currentTime > this._stop_time + .1){
			$('#'+this._playerId).trigger('ended',{'id':this._id});
			this.pause();
			console.log('Total asset time: '+this._start_time);
			this._asset.currentTime=this._start_time;
			
				
		}
		
		else if(this._asset.currentTime < this._start_time - .1){
			
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

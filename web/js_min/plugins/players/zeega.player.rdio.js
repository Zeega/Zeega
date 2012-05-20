/************************************

	ZEEGA MEDIA PLAYER CLASS
	
	TODO:
		Clean up a bit (remove numeric input?)

************************************/


var debug=true;


var ZeegaRdioPlayer = Class.extend({

	init: function(id,url,mediaIn,mediaOut,mediaVol,wrapperId){
	
		console.log("rdioplayer:init " + id); 
		this._id = id;      
		this._url = url;
		this._dur = 30;
		this._start_time = parseFloat(mediaIn);
		this._start_time = this._start_time.toFixed(3);
		this._stop_time = (parseFloat(mediaOut) == 0) ? this._dur : parseInt(mediaOut);
		this._stop_time = this._stop_time.toFixed(3);
		this._vol = parseFloat(mediaVol);
		this._wrapper_id=wrapperId;
		this._selectedArrow='none';
	    this._seek_to = this._start_time;
		this._dragging = false;
        this._loaded = false;
		this._mode = 'idle';
		this._last_known_state = 0;
		this._player_id = this._wrapper_id + '-rdioplayer';
		this._ended = false;
		
		window['rdioListener'+this._id] = this;
        var div = $('<div>').attr('id',this._player_id);
        
        $('#'+this._wrapper_id).append(div);
        // load the rdio player

        var flashvars1 = {
            'playbackToken': playback_token, // from token.js
            'domain': domain,                // from token.js
            'listener': 'rdioListener'+this._id    // the global name of the object that will receive callbacks from the SWF
        };
        
        var params = { 'allowScriptAccess': 'always' };
        var attributes = {};       
	    swfobject.embedSWF('http://www.rdio.com/api/swf/', // the location of the Rdio Playback API SWF
           this._player_id, // the ID of the element that will be replaced with the SWF
            1, 1, '9.0.0', 'expressInstall.swf', flashvars1, params, attributes);
	},
	
	/**
    * 
    */ 
	ready:function ready() 
	{
	    if(debug) console.log("rdioplayer:ready " + this._id);
        this._asset = $('#'+this._player_id).get(0);       //  get the swf object
        this.setMode('loading');                                //  ready to load
    },

	/**
    * Configure visual 
    */
	setup:function(){
		if(debug) console.log("rdioplayer:setup " + this._id);

		var that = this;
		
		//this.initiateAsset();
		
		$('#layerDuration').html(convertTime(this._dur));
		this.informGraphicInput(this._dur,this._start_time,this._stop_time,this._vol);
		this.informNumericInput(this._start_time,this._stop_time);
		$('#player-'+this._id).find('#playMP').click(function()
		{
		    if(that._mode != 'seeking')
		    {
		        that.playPause();
		    }
		});
		
		// current position
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
			}
			if(that._asset.currentTime>t) that.setCurrentTime(that._start_time);
			that.informGraphicInput(that._dur,-1,t,-1);
			that.informNumericInput(-1,t);
			that.updateAsset(-1,t);
			
		}});
		
		$('#player-'+this._id).find('#stopMP').draggable('option','disabled',false);
		$('#player-'+this._id).find('#startMP').draggable('option','disabled',false);
		$('#player-'+this._id).find('#currentMP').draggable('option','disabled',false);
		
		this.timeUpdate(this._start_time);
		$('#player-'+this._id).find('#loadingMP').fadeOut('fast');
		this.setVolume(this._vol);

		$('#player-'+this._id).find('#volume-slider').slider({
				min : 0,
				max : 100,
				value : that._vol,
				step : 1,
				slide: function(e,ui){

					that._vol = parseFloat(ui.value);
					that.setVolume(that._vol);
				},
				stop : function(e, ui){
					that._vol = parseFloat(ui.value);
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
	
	initiateAsset:function(){
	    if(debug) console.log("rdioplayer:initiateAsset " + this._id);
	    /*
		if(debug)console.log("player:initiateAsset");
		this._asset.currentTime=this._start_time;
		$('#player-'+this._id).find('#startMP').css('left',this._start_time*parseFloat($('#player-'+this._id).find('#loadingOutsideMP').css('width'))/this._dur);
		$('#player-'+this._id).find('#currentMP').css('left',this._start_time*parseFloat($('#player-'+this._id).find('#loadingOutsideMP').css('width'))/this._dur);
		this._asset.volume=this._vol;
		*/
	},
    
    setMode:function(mode){
	    if(debug) console.log("rdioplayer:setMode " + this._id + " " + mode);
        this._mode = mode;
        if(this._mode == 'ready')
        {
         	this.setVolume(this._vol);
            this._asset.rdio_play(this._url);
        }
        else if(this._mode == 'loading')
        {
            this._asset.rdio_setMute(true);
            this._asset.rdio_play(this._url);
        }        
        else if(this._mode == 'readyToPlay')
        {
            this.setMode('paused'); //not sure about this recursion
            if(!this._loaded)
            {
                this.setup();                
            }

            this.pause();
            this.setVolume(this._vol);
            this._dragging = false;
            this.timeUpdate(this._seek_to);
            
            if(!this._loaded) // ugly... can't merge with the previous if
            {
                this._loaded = true;
                this.canPlay();
            }
            this._ended = false;
        }
        else if(this._mode == 'seeking')
        {
            this._asset.rdio_setVolume(0);
            //console.log("seeking to " + this._seek_to);
            if(this._last_known_state == 0 || this._last_known_state == 4)
                this._asset.rdio_play();
            
            this._seek_to = this._seek_to - 1;
            //console.log("seeking to before ternary " + this._seek_to);
            this._seek_to = (this._seek_to >= 0) ? this._seek_to : 0;
            //console.log("seeking to " + this._seek_to);
            this._asset.rdio_seek(this._seek_to);
        }        
    },
    
    playStateChanged:function(playState) 
    {
        // The playback state has changed.
        // The state can be: 0 - paused, 1 - playing, 2 - stopped, 3 - buffering or 4 - paused.
        if(debug) console.log("rdioplayer:playStateChanged " + this._id + " " + playState);
        this._last_known_state = playState;
        if(playState == 1)
        {
            if(this._mode == 'loading')
            {
                if(this._start_time == 0) 
                    this.setMode('readyToPlay');
                else
                    this.setMode('seeking');
            }
        }
        else if(playState == 2)
        {
            if(this._mode != 'loading')
            {
                this._seek_to = this._start_time;
                this.playPause();
                this.setMode('loading');
                this.ended();
            }
        }
    },
	
	canPlay:function(){
	
		if(debug) console.log("rdio:canPlay "  + this._id);
		//$('#player-'+this._id).trigger('ready');
		$('#zeega-player').trigger('ready',{'id':this._id});
	},
	
	durationChange:function(){
	
		if(debug) console.log("rdio:durationChange "  + this._id);
		this._dur=Math.round(this._asset.duration*1000)/1000.0;
		if(this._stop_time==0) this._stop_time= this._dur;
	},
	
	positionChanged:function(position) 
	{
	    if(debug) console.log("rdio:positionChanged " + this._id + " " + position);
        if(this._mode == 'seeking')
        {
            if((position >= (parseInt(this._seek_to,10) + 1)) && (position <= (parseInt(this._seek_to,10) + 5)))
            {
                this._seek_to = position;
                this.setMode('readyToPlay');
                //this.ended();
            }
		}
		else if(this._mode == 'playing')
		{
		    if(position > (parseFloat(this._stop_time) + 0.2))
    		{
    		    this.playPause();
    		    this._seek_to = this._start_time;
    		    this.setMode('seeking');
    		    this.ended();
    		}
    		else
    		{
		        this.timeUpdate(position);
		    }
		}
	},
	
	isPlaying : function()
	{
		return this._ended;
	},
	
	ended: function(){
		 if(debug) console.log("rdio:ended " + this._id);
		//this.pause();
		//$('#player-'+this._id).find('#playMP').addClass('pauseButtonMP').removeClass('playButtonMP');
		//this.timeUpdate(this._start_time);
		this._ended = true;
		$('#zeega-player').trigger('ended',{'id':this._id});
	},
	
	informGraphicInput:function(duration,startTime,stopTime,volume){
	
	    if(debug)console.log("rdio:informGraphicInput " + this._id + "(" + duration + "," + startTime + "," + stopTime + "," + volume + ")");
	
    	if(startTime!=-1)
    	{
    		var leftStart=parseFloat(startTime)*parseFloat($('#player-'+this._id).find('#loadingOutsideMP').css('width'))/parseFloat(duration);
    		$('#player-'+this._id).find('#startMP').css('left',leftStart+"px");
    		$('#player-'+this._id).find('#startBar').css('width',leftStart+"px");
    	}	
    	if(stopTime!=-1)
    	{
    		var leftStop=parseFloat(stopTime)*parseFloat($('#player-'+this._id).find('#loadingOutsideMP').css('width'))/parseFloat(duration);
    		$('#player-'+this._id).find('#stopMP').css('left',leftStop+"px");
    		var r=parseInt($('#player-'+this._id).find('#loadingOutsideMP').css('width'))-parseInt($('#player-'+this._id).find('#stopMP').css('left'));
    		$('#player-'+this._id).find('#stopBar').css('width',r+"px");
    	}
	},
	
	informNumericInput:function(startTime,stopTime){
		if(debug) console.log("rdio:informNumericInput: " + this._id + " " + startTime + "," + stopTime);
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
		if(debug)console.log("rdio:setVolume "+ this._id + " " + volume);	    
	    this._vol = parseInt(volume);
		this._asset.rdio_setVolume(this._vol / 100);
	},
	
	updateAsset:function(startTime,stopTime){
	    
		if(debug)console.log("rdio:updateAsset (" + this._id + " " + startTime + "," + stopTime + ")");
		
		if(startTime!=-1) this._start_time=startTime;
		if(stopTime!=-1) this._stop_time=stopTime;

		$('#player-'+this._id).trigger('updated');	
	},
	
	setCurrentTime:function(currentTime)
	{
	    if(this._last_known_state == 1)
	    	this.playPause();
	    	
	    this._seek_to = currentTime;
	    this._seek_to = this._seek_to.toFixed(3);
	    this.setMode('seeking');		
	},
	
	exit:function(){
		if(debug)console.log("rdio:exit");
		$('#player-'+this._id).find('.mediaInput').unbind();
		this.pause();
		
		//$('#player-'+this._id).find('#stopMP').draggable('option','disabled',true);
		//$('#player-'+this._id).find('#startMP').draggable('option','disabled',true);
		//$('#player-'+this._id).find('#currentMP').draggable('option','disabled',true);
		//$('#player-'+this._id).find('#avVolumeSlider').slider("option","disabled",true);
		
		$('#player-'+this._id).find('#loadingMP').show();
	},	
	
	timeUpdate:function(currentTime){
	    //if(debug)console.log("timeUpdate " + currentTime);
	    var displayTime=convertTime(currentTime);
		$('#player-'+this._id).find('#currentTime').html(displayTime);
	    
		var currentLoc=parseFloat(currentTime)*parseFloat($('#player-'+this._id).find('#loadingOutsideMP').css('width'))/parseFloat(this._dur);
		
		if(!this._dragging){
			$('#player-'+this._id).find('#currentMP').css('left',currentLoc+"px");
			$('#player-'+this._id).find('#loadingInsideMP').css('width',currentLoc+"px");
		}
	},	
	
	pause:function()
	{
	    if(debug) console.log("rdio:pause " + this._id );	    
	    if(typeof this._asset.rdio_pause === 'function')
		    this._asset.rdio_pause();
	},
	
	play:function()
	{
	    if(debug) console.log("rdio:play " + this._id );	    
	    if(this._last_known_state == 2) // stopped. reload the file.
	        this._asset.rdio_play(this._url);
	    else
	    {
	        this._mode = 'playing';
	        this._asset.rdio_play();
	    }
	},
	
	updatePlaybackControls:function(state)
	{
	    if(debug) console.log("updatePlaybackControls " + state);
	},
		
	playPause:function(){
		if(debug) console.log("rdio:playpause " + this._id + " " + this._mode );	    

	    if(this._mode == 'playing')
	    {
	        $('#player-'+this._id).find('#playMP').addClass('playButtonMP').removeClass('pauseButtonMP');
	        this._mode = 'paused';
	        this.pause();
	    }
	    else if(this._mode == 'seeking')
	    {
	        $('#player-'+this._id).find('#playMP').addClass('playButtonMP').removeClass('pauseButtonMP');
	    }
	    else if(this._mode == 'paused')
	    {
	        $('#player-'+this._id).find('#playMP').addClass('pauseButtonMP').removeClass('playButtonMP');
	        this._mode = 'playing';
	        this.play();
	    }
	}
});

//Utilities
function convertTime(seconds){
	
	var m=Math.floor(seconds/60);
	var s=Math.floor(seconds%60);
	if(s<10) s="0"+s;
	return m+":"+s;
}

function deconvertTime(minutes,seconds){

	return 60*minutes+parseInt(seconds);
}

function getMinutes(seconds){

	return Math.floor(parseInt(seconds)/60.0);
}

function getSeconds(seconds){

	var s=Math.floor((seconds%60)*10)/10.0;
	if(s<10) s="0"+s;
	return s;

}

function isInt(x) {
	   var y=parseInt(x);
	   if (isNaN(y)) return false;
	   return x==y && x.toString()==y.toString();
}

function isPercent(x){

	return isInt(x)&&parseInt(x)<=100;

}

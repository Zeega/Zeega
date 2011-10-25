
/************************************

	AUDIO LAYER CHILD CLASS
	

************************************/


var RdioLayer = ProtoLayer.extend({
	defaultAttributes : {
							'title' : 'Video Layer',
							'url' : 'none',
							'in'  : 0,
							'out' : 0,
							'volume' : 50,
							
						},
	getAttr : function(){return this.defaultAttributes},
	
	drawControls : function(template){
		
		var div = $('<div>').addClass('timeLEF').addClass('layerEditingFrame').attr('id','player-'+this.model.id);
		template.find('#controls').append(div);
        
		this.editorLoaded=false;
	},
	
	openControls: function(){
	    console.log('Rdio Controls Opened');

	    var that=this;
		if(!this.editorLoaded)
		{
		    currPathName = window.location.pathname.split('/',2)[1];
		    templateUrl = window.location.protocol + '//' + window.location.hostname + '/' + currPathName + '/web/gamma/js/templates/zeega.av.html';

			$('#player-'+this.model.id).load(templateUrl,function(){
			    console.log("out " + that.attr.out);
				that.player=new ZeegaRdioPlayer(that.model.id,that.attr.url,that.attr.in,that.attr.out,that.attr.volume,'layer-preview-'+that.model.id);
                window['rdioListener'+that.model.id] = that.player;
                var div = $('<div>').attr('id','apiswf-'+that.model.id);
                $('#player-'+that.model.id).append(div);
                // load the rdio player

                var flashvars1 = {
                       'playbackToken': playback_token, // from token.js
                       'domain': domain,                // from token.js
                       'listener': 'rdioListener'+that.model.id    // the global name of the object that will receive callbacks from the SWF
                       };
                var params = { 'allowScriptAccess': 'always' };
                var attributes = {};       
				swfobject.embedSWF('http://www.rdio.com/api/swf/', // the location of the Rdio Playback API SWF
                         'apiswf-'+that.model.id, // the ID of the element that will be replaced with the SWF
                         1, 1, '9.0.0', 'expressInstall.swf', flashvars1, params, attributes);
                         
				//player triggers 'update' event to persist changes
				$('#player-'+that.model.id).bind('updated',function()
				{
				    console.log("loaded edit controls")
					that.updateAttr();
				});
				that.editorLoaded=true;
			});
		}
	},
	
	preloadMedia : function(){
	    console.log("preload for " + this.model.id);
		//make dom object
		var that = this;
		var container= $('<div>');
		
		container.attr({
				'id' : 'layer-publish-'+this.model.id,
				'data-layer-id' : 'apiswf-'+this.model.id
			});
		
		//$('#layer_'+this.model.id).append(img);
		this.dom = container;
		
		//draw to the workspace
		$('#zeega-player').append(this.dom);
		
		this.player = new ZeegaRdioPlayer('player'+this.model.id,this.attr.url,this.attr.in,this.attr.out,this.attr.volume,'layer-publish-'+this.model.id);
        
        window['rdioListener-publish'+this.model.id] = this.player;
        
        globalRdio = this.player;
        var div = $('<div>').attr('id','apiswf-player'+this.model.id);
        //$('#player-'+this.model.id).append(div);
        // load the rdio player
        $(this.dom).append(div);
        var that = this;
        var flashvars1 = {
            'playbackToken': playback_token, // from token.js
            'domain': domain,                // from token.js
            'listener': 'globalRdio'    // the global name of the object that will receive callbacks from the SWF
            };
        var params = { 'allowScriptAccess': 'always' };
        var attributes = {};       
		
		swfobject.embedSWF('http://www.rdio.com/api/swf/', // the location of the Rdio Playback API SWF
            'apiswf-player'+this.model.id, // the ID of the element that will be replaced with the SWF
            1, 1, '9.0.0', 'expressInstall.swf', flashvars1, params, attributes);
    
	    console.log("rdio preload finished");
	},
	
	drawPublish : function(z){
		console.log('rdio drawPublish ');
		if(this.player) this.player.play();
	},
	
	hidePublish : function(z){
		console.log('rdio hidePublish ');
		if(this.player) this.player.pause();
	},
	
	
	closeControls: function(){
	
		if(this.player) this.player.pause();
		
	},
	
	drawPreview : function(){
		//make dom object - css should move to css file!
		var container= $('<div>').attr({
				'id' : 'layer-preview-'+this.model.id,
				'data-layer-id' : this.model.id
				}).css({
				
				'position':'absolute',
				'z-index':'1000',
				'top':'10px',
				'right':'15px',
				'width':'48px',
				'height':'40px'
				});
				
		this.dom = container;
		
		//draw to the workspace
		$('#workspace').append(this.dom);
		
	},
	
	updateAttr: function(){
	    console.log("updateAttr");
		//get a copy of the old attributes into a variable
		var newAttr = this.attr;
		
		if(this.editorLoaded){
			newAttr.in=this.player._start_time;
			newAttr.out=this.player._stop_time;
			console.log("new volume  " + this.player._vol);
			newAttr.volume = this.player._vol;
		}
		
		//set the attributes into the layer
		this.updateLayerAttr(newAttr);
		//save the layer back to the database
		this.saveLayer();
	},
	
	ready: function(){
	    console.log("Player is ready");
	    $('#zeega-player').find('#preview-media').append(this.dom).trigger('ready',{'id':this._id});
	}
	
});
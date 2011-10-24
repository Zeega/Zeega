
/************************************

	AUDIO LAYER CHILD CLASS
	

************************************/

var rdioListener;

var RdioLayer = ProtoLayer.extend({
	defaultAttributes : {
							'title' : 'Video Layer',
							'url' : 'none',
							'in'  : 0,
							'out' : 0,
							'volume' : 50,
							
						},
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
                rdioListener = that.player;
                var div = $('<div>').attr('id','apiswf-'+that.model.id);
                $('#player-'+that.model.id).append(div);
                // load the rdio player

                var flashvars1 = {
                       'playbackToken': playback_token, // from token.js
                       'domain': domain,                // from token.js
                       'listener': 'rdioListener'    // the global name of the object that will receive callbacks from the SWF
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
				'background-image':'url("http://mlhplayground.org/gamma-james/css/layers/icons/zeega.audio.icon.png")',
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
	
	
	}
	
});
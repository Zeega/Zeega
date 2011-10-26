
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

			$('#player-'+this.model.id).load(templateUrl,function()
			{
				that.player = new ZeegaRdioPlayer(that.model.id,that.attr.url,that.attr.in,that.attr.out,that.attr.volume,'player-'+that.model.id);
   
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
		
		this.player = new ZeegaRdioPlayer(this.model.id,this.attr.url,this.attr.in,this.attr.out,this.attr.volume,'layer-publish-'+this.model.id);
        
	    console.log("rdio preload finished");
	    $('#zeega-player').trigger('ready',{'id':this.model.id});
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
	}	
});
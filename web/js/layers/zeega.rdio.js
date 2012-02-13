
/************************************

	AUDIO LAYER CHILD CLASS
	

************************************/


var RdioLayer = ProtoLayer.extend({
	defaultAttributes : {
							'title' : 'Video Layer',
							'url' : 'none',
							'in'  : 10,
							'out' : 20,
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
		    templateUrl = window.location.protocol + '//' + window.location.hostname + '/' + currPathName + '/web/js/templates/zeega.av.html';

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
		}).css({
		    'top': '-100%',
		    'position' : 'absolute',
		    'left': '-100%'
		});

		//$('#layer_'+this.model.id).append(img);
		this.dom = container;

		//draw to the workspace
		$('#zeega-player').find('#preview-media').append(this.dom);
		
		this.player = new ZeegaRdioPlayer(this.model.id,this.attr.url,this.attr.in,this.attr.out,this.attr.volume,'layer-publish-'+this.model.id);
        //make dom object
		var container= $('<div>');
		
		var h = Math.floor(this.attr.w*1.5/this.attr.aspect);
		var cssObj = {
			'backgroundImage':'url(' + getHost() + '/content/images/items/'+this.attr.item_id+'_s.jpg)',
			'backgroundSize': '100% 100%',
			'position' : 'absolute',
			'top' : "-100%",
			'left' : "-100%",
			'z-index' : this.zIndex,
			'width' : "200px",
			'height' : "200px",
			
		};
		
		
		container.css(cssObj);
		this.dom = container;
		
		//draw to preview
		$('#zeega-player').find('#preview-media').append(this.dom);
	    console.log("rdio preload finished");
	},
	
	drawPublish : function(z){
		console.log('rdio drawPublish ');
		this.dom.css({'z-index':z,'top':"40%",'left':"40%"});
		
		if(this.player) this.player.play();
	},
	
	hidePublish : function(){
		console.log('rdio hidePublish ');
		this.dom.css({'top':"-100%",'left':"100%"});
		var that = this;
		if(!that.player.isPlaying())
		{
			setTimeout(function(){
				that.player.pause();
			}, 1500); 
		}
		//if(this.player) this.player.pause();
	},
		
	closeControls: function(){
	
		if(this.player) this.player.pause();
		
	},
	
	drawPreview : function(){
	
		//make dom object
		var container= $('<div>');
		
		var h = Math.floor(this.attr.w*1.5/this.attr.aspect);
		var cssObj = {
			'backgroundImage':'url('+ getHost() + '/content/images/items/'+this.attr.item_id+'_s.jpg)',
			'backgroundSize': '100% 100%',
			'position' : 'absolute',
			'top' : "133px",
			'left' : "233px",
			'z-index' : this.zIndex,
			'width' : "144px",
			'height' : "144px",
		};
		
		
		container.css(cssObj);
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
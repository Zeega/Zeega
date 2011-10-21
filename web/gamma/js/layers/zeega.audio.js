
/************************************

	AUDIO LAYER CHILD CLASS
	

************************************/

var AudioLayer = ProtoLayer.extend({
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
	console.log('Audio Controls Opened');
	
	var that=this;
		if(!this.editorLoaded){
			$('#player-'+this.model.id).load('http://alpha.zeega.org/demo/web/gamma/js/templates/zeega.av.html',function(){
				that.player=new ZeegaMP(that.model.id,that.attr.url,that.attr.in,that.attr.out,that.attr.volume,'layer-preview-'+that.model.id);
				
				//player triggers 'update' event to persist changes
				$('#player-'+that.model.id).bind('updated',function(){
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
				'background-image':'url("http://demo/web/gammaalpha.zeega.org/demo/web/gamma/css/layers/icons/zeega.audio.icon.png")',
				'width':'48px',
				'height':'40px'
				});
				
		this.dom = container;
		
		//draw to the workspace
		$('#workspace').append(this.dom);
		
	},
	preLoad : function(){
		//make dom object

		var container= $('<div>').attr({
				'id' : 'layer-preview-'+this.model.id,
				'data-layer-id' : this.model.id
				}).css({
				
				'position':'absolute',
				'z-index':'1000',
				'top':'10px',
				'right':'15px',
				'background-image':'url("http://demo/web/gammaalpha.zeega.org/demo/web/gamma/css/layers/icons/zeega.audio.icon.png")',
				'width':'48px',
				'height':'40px'
				});
				
		this.dom = container;
		
		//draw to the workspace
		$('#zeega-player').append(this.dom);
		
		this.player=new ZeegaAV(that.model.id,that.attr.url,that.attr.in,that.attr.out,that.attr.volume,'layer-publish-'+that.model.id,'zeega-player');
				
		
	},
	
	drawPublish : function(){
		//make dom object
		this.dom.css({'top':this.attr.y+"%",'left':this.attr.x});
		this.player.play();
		
	},
	
	updateAttr: function(){
	
		//get a copy of the old attributes into a variable
		var newAttr = this.attr;
		
		if(this.editorLoaded){
			newAttr.in=this.player._start_time;
			newAttr.out=this.player._stop_time;
			newAttr.volume = Math.floor(this.player._vol*100.0);
		}
		
		//set the attributes into the layer
		this.updateLayerAttr(newAttr);
		//save the layer back to the database
		this.saveLayer();
	
	
	}
	
});
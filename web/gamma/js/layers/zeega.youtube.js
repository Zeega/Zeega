
/************************************

	VIDEO LAYER CHILD CLASS

************************************/

var YoutubeLayer = VideoLayer.extend({
	
	defaultAttributes : {
							'title' : 'Video Layer',
							'url' : 'none',
							'x' : 0,
							'y' : 0,
							'h' : 100,
							'w' : 100,
							'volume' : 50,
							'in'  : 0,
							'out' : 0,
							'opacity':1,
							'aspect':1.33
						},
	
	openControls: function(){
			var that=this;
			if(!this.editorLoaded){
				
				var html = this.getTemplate();
				$('#player-'+this.model.id).html(html);
				//that.player=new ZeegaMP(that.model.id,that.attr.url,that.attr.in,that.attr.out,that.attr.volume,'layer-preview-'+that.model.id);
				that.player=new ZeegaYoutube(that.model.id,that.attr.url,that.attr.in,that.attr.out,that.attr.volume,'layer-preview-'+that.model.id,that.attr.w,that.attr.h);
			
				//player triggers 'update' event to persist changes
				$('#player-'+that.model.id).bind('updated',function(){
					that.updateAttr();
				});
				that.editorLoaded=true;
			}
	},
	closeControls: function(){
		
		//if(this.player) this.player.pause();
		
		
	},
	drawPreview : function(){
		//make dom object


		var container= $('<div>');
		
		var h=Math.floor(this.attr.w*1.5/this.attr.aspect);
		var cssObj = {
			'backgroundImage':'url(' + $("#header").data("hostname") + $("#header").data("directory") + 'images/items/'+this.attr.item_id+'_s.jpg)',
			'backgroundSize': '100px 100px',
			'position' : 'absolute',
			'top' : this.attr.y+"%",
			'left' : this.attr.x+"%",
			'z-index' : this.zIndex,
			'width' : this.attr.w+"%",
			'height' : h+"%",
			'opacity' : this.attr.opacity
		};
		
		
		container.addClass('media editable draggable')
			.attr({
				'id' : 'layer-preview-'+this.model.id,
				'data-layer-id' : this.model.id
			})
			.css(cssObj);
			
			
			
		//need this to be accessable inside the draggable function
		var that  = this;
		
		container.draggable({
			
			//when the image stops being dragged
			stop : function(){
				that.updateAttr();
			}
		});
		
		
		//$('#layer_'+this.model.id).append(img);
		this.dom = container;
		
		//draw to the workspace
		$('#workspace').append(this.dom);
		
		
	},
	
	
	preloadMedia : function(){
		
		//make dom object
		var that=this;
		var container= $('<div>');
		
		var h = Math.floor(this.attr.w*1.5/this.attr.aspect);

		var cssObj = {
			'backgroundImage':'url(' + getHost() + '/images/items/'+this.attr.item_id+'_s.jpg)',
			'backgroundSize': '100px 100px',
			'position' : 'absolute',
			'top' : "-200%",
			'left' : "-200%",
			'z-index' : this.zIndex,
			'width' : this.attr.w+"%",
			'height' : h+"%",
			'opacity' : this.attr.opacity
		};
		
		
		container.addClass('media editable draggable')
			.attr({
				'id' : 'layer-publish-'+this.model.id,
				'data-layer-id' : this.model.id
			})
			.css(cssObj);
			
		
		
		//$('#layer_'+this.model.id).append(img);
		this.dom = container;
		
		//draw to the workspace
		$('#zeega-player').find('#preview-media').append(this.dom);
		that.player=new ZeegaYoutubePublish(that.model.id,that.attr.url,that.attr.in,that.attr.out,that.attr.volume,'layer-publish-'+that.model.id,'zeega-player', this.attr.w,this.attr.h);
			
		//this.player=new ZeegaAV(that.model.id,that.attr.url,that.attr.in,that.attr.out,that.attr.volume,'layer-publish-'+that.model.id,'zeega-player');
		
	},
	
	drawPublish : function(z){
		//make dom object
		this.dom.css({'z-index':z,'top':this.attr.y+"%",'left':this.attr.x+"%"});
		this.player.play();
		
	},
	
	hidePublish :function()
	{
		
		this.dom.css({'top':"-200%",'left':"-200%"});
		this.player.pause();
	},
	
	updateAttr: function(){
	
		//get a copy of the old attributes into a variable
		var newAttr = this.attr;
		//set the new x/y coords into the attributes
		newAttr.x = this.dom.position().left/6.0;
		newAttr.y = this.dom.position().top/4.0;
		newAttr.opacity = $('#layer-edit-'+this.model.id).find('#Opacity-slider').slider('value');
		newAttr.w = $('#layer-edit-'+this.model.id).find('#Width-slider').slider('value');
		if(this.editorLoaded){
			console.log('Volume: '+this.player._vol);
			newAttr.in=this.player._start_time;
			newAttr.out=this.player._stop_time;
			newAttr.volume = this.player._vol;
			

		}
		//set the attributes into the layer
		this.updateLayerAttr(newAttr);
		//save the layer back to the database
		this.saveLayer();
	
	
	},
	exit: function(){
		
		this.player.pause();
	},
	
	getTemplate : function(){
	
		var html ='<div id="durationWrapper"><span style="line-height: 1.9;"> Duration: </span><span id="layerDuration" class="layerLength">0 </span> </div>';
		html +='<div id="avControls"> ';
		html +='<div id="avStart"> ';
		html +='<h4>In</h4><input disabled="true"  name="avStartMinutes" class="mediaInput mediaInputMinutes" id="avStartMinutes" value="0" type="text">:<input  disabled="true"  name="avStartSeconds" class="mediaInput mediaInputSeconds" id="avStartSeconds" value="00.0" type="text">';
		html +='</div>';
		html +='<div id="avStop"> ';
		html +='<h4>Out</h4> <input name="avStopMinutes" class="mediaInput" disabled="true" id="avStopMinutes" value="0" type="text">:<input  disabled="true"  class="mediaInput" name="avStopSeconds" id="avStopSeconds" value="00.0" type="text">';
		html +=	'</div>';
		html +='</div>';
		html +='<div id="avVolumeWrapper">';
		html +='</div> ';
		html +='<div class="avComponent"> ';
		html +='	<div id="mediaPlayerMP"> ';
		html +='		<div id="loadingMP" ><p>Loading Media...</p></div>';
		html +='		<div id="playMP" class="playButtonMP"> </div> ';
		html +='		<div id="loadingOutsideMP"> ';
		html +='			<div id="startBar"></div>';
		html +='			<div id="stopBar"></div>';
		html +='			<div id="startMP" class="markerMP"><div class="bar"></div><div class="arrow-down"></div></div>';
		html +='			<div id="stopMP" class="markerMP"><div class="bar"></div><div class="arrow-down"></div></div>';
		html +='			<div id="currentMP" class="markerMP"><div class="box"></div></div>';
		html +='			<div id="loadingInsideMP"> </div> ';
		html +='			<div id="loadingStatusMP"></div> ';
		html +='		</div> ';
		html +='		<div id="timeWrapperMP"><span id="currentTime"></span> </div>';
		html +='	</div>				';	 
		html +='</div> <!-- #avComponent --> ';
		html +='<div id="clear"></div> ';
		html +='<div id ="volumeMP">';
		html +='<h4>Volume</h4>';
		html +='<div id="volume-slider" ></div>';
		html +='</div>';
		return html;
	}
	
});
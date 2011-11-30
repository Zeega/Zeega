
/************************************

	VIDEO LAYER CHILD CLASS

************************************/

var VideoLayer = ProtoLayer.extend({
	
	defaultAttributes : 
	{
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
		'dimension':1.3
	},
						
	drawControls : function(template)
	{
		
		console.log('drawing video controls');
		
		//need this to be accessable inside the draggable function
		var that  = this;
		
		var div = $('<div>').addClass('timeLEF').addClass('layerEditingFrame').attr('id','player-'+this.model.id);
		
		
		
		this.editorLoaded=false;
		
		
		var opacityArgs = {
			min:0,
			max:1,
			value:that.attr.opacity,
			step:0.01,
			layer_id:that.model.id,
			label:'Opacity',
			css: 'opacity',
			suffix:''
		};
		var scaleArgs = {
			min:0,
			max:200,
			value:that.attr.w,
			step:1,
			layer_id:that.model.id,
			label:'Scale',
			css: 'width',
			suffix:'%'
		};
		
		
		template.find('#controls').append( makeSlider(scaleArgs) );
		
		template.find('#controls').append( makeSlider(opacityArgs) );
	
		

		template.find('#controls').find('.layer-slider').bind( "slidestop", function(event, ui) {that.updateAttr();});
		
		template.find('#controls')
			.find('.layer-slider')
			.bind( "slidestart", function(event, ui) {
				$('#layer-preview-'+that.model.id).css({'backgroundImage':'none'});
			});
		
		
		
		template.find('#controls').append(div);
		template.find('#controls').append( makeFullscreenButton());
		
		template.find('#controls').find('.fullscreen-submit')
			.click(function(){
				$('#layer-preview-'+that.model.id ).css( {'top':'0px','left':'0px','width':'100%'});
				$('#layer-edit-'+that.model.id).find('#Width-slider')
					.slider("option", "value", 100 );
				that.updateAttr();
			});
		
		//change icon on layer template
		template.find('.asset-type-icon').removeClass('ui-icon-pin-w');
		template.find('.asset-type-icon').addClass('ui-icon-video');
		
	},
	
	openControls: function()
	{
			var _this = this;
			if(!this.editorLoaded){
				$('#layer-preview-'+this.model.id).css({'backgroundImage':'none'});
				var html = this.getTemplate();
				$('#player-'+this.model.id).html(html);
				_this.player=new ZeegaMP(_this.model.id,_this.attr.url,_this.attr.in,_this.attr.out,_this.attr.volume,'layer-preview-'+_this.model.id);
			
				//player triggers 'update' event to persist changes
				$('#player-'+_this.model.id).bind('updated',function(){
					_this.updateAttr();
				});
				_this.editorLoaded=true;
			}
	},
	
	closeControls: function()
	{
		if(this.player) this.player.pause();
	},
	
	drawPreview : function()
	{
		//make dom object
		var container= $('<div>');
		
		var h = Math.floor(this.attr.w*1.5/this.attr.dimension);
		var cssObj = {
			'backgroundImage':'url('  + sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + 'images/items/'+this.attr.item_id+'_s.jpg)',
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
		
		
		container.bind('slide',function(){
		
				var height = Math.floor($('#layer-edit-'+that.model.id).find('#Scale-slider').slider('value')*1.5/that.attr.dimension);
		
				$(this).css({'opacity':$('#layer-edit-'+that.model.id).find('#Opacity-slider').slider('value'),
						'width': $('#layer-edit-'+that.model.id).find('#Scale-slider').slider('value')+'%',
						'height':height+'%'});
				console.log('height: '+height);
			
			
			});
		
		//$('#layer_'+this.model.id).append(img);
		this.dom = container;
		
		//draw to the workspace
		$('#workspace').append(this.dom);
		
		
	},
	
	drawThumb : function()
	{
		//Video Layers break headless browser
		
		
	

		
		
	},
	
	
	preloadMedia : function()
	{
		console.log('video preloadMedia');
		
		//make dom object
		var _this = this;
		var container= $('<div>');
		
		var ratio = parseFloat($('#zeega-player').css('width'))/parseFloat($('#zeega-player').css('height'));
		var h = Math.floor(this.attr.w*ratio/this.attr.dimension);
		var cssObj = {
			
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
		
		this.player=new ZeegaAV(_this.model.id,_this.attr.url,_this.attr.in,_this.attr.out,_this.attr.volume,'layer-publish-'+_this.model.id,'zeega-player');
		
		console.log(this.player);
	},
	
	drawPublish : function(z)
	{
		console.log('video drawPublish');
		
	
		
		//make dom object
		this.dom.css({'z-index':z,'top':this.attr.y+"%",'left':this.attr.x+"%"});
		this.player.play();
		
	},
	
	hidePublish :function()
	{
		console.log('video hidePublish');
		
		this.dom.css({'top':"-200%",'left':"-200%"});
		this.player.pause();
	},
	
	updateAttr: function()
	{
	
		//get a copy of the old attributes into a variable
		var newAttr = this.attr;
		//set the new x/y coords into the attributes
		newAttr.x = this.dom.position().left/6.0;
		newAttr.y = this.dom.position().top/4.0;
		newAttr.opacity = $('#layer-edit-'+this.model.id).find('#Opacity-slider').slider('value');
		newAttr.w = $('#layer-edit-'+this.model.id).find('#Scale-slider').slider('value');
		if(this.editorLoaded)
		{
			console.log('Volume: '+this.player._vol);
			newAttr.in=this.player._start_time;
			newAttr.out=this.player._stop_time;
			newAttr.volume = Math.floor(this.player._vol*100.0);
			

		}
		//set the attributes into the layer
		this.updateLayerAttr(newAttr);
		//save the layer back to the database
		this.saveLayer();
	
	
	},
	exit: function()
	{
		this.player.pause();
	},
	
	getTemplate : function(){
	
		var html ='<div id="durationWrapper"><span style="line-height: 1.9;"> Duration: </span><span id="layerDuration" class="layerLength">0 </span> </div>';
		html +='<div id="avControls"> ';
		html +='<div id="avStart"> ';
		html +='<span style="font-weight: bold;">In:</span><input disabled="true"  name="avStartMinutes" class="mediaInput mediaInputMinutes" id="avStartMinutes" value="0" type="text">:<input  disabled="true"  name="avStartSeconds" class="mediaInput mediaInputSeconds" id="avStartSeconds" value="00.0" type="text">';
		html +='</div>';
		html +='<div id="avStop"> ';
		html +='<span style="font-weight: bold;">Out:</span> <input name="avStopMinutes" class="mediaInput" disabled="true" id="avStopMinutes" value="0" type="text">:<input  disabled="true"  class="mediaInput" name="avStopSeconds" id="avStopSeconds" value="00.0" type="text">';
		html +=	'</div>';
		html +='</div>';
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
		html +='<h4 style="margin:10px">Volume</h4>';
		html +='<div id="volume-slider" ></div>';
		html +='</div>';
		return html;
	}
	
});
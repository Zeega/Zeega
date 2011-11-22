
/************************************

	VIDEO LAYER CHILD CLASS

************************************/

var VideoLayer = ProtoLayer.extend({
	
	layerType : 'VISUAL',
	draggable : true,
	
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
		'aspect':1.33
	},
						
	drawControls : function()
	{
		var _this  = this;
		var controls = $('<div>');
		
		console.log('drawing video controls');
		
		//need this to be accessable inside the draggable function
		
		controls.addClass('timeLEF')
			.addClass('layerEditingFrame')
			.attr('id','player-'+this.model.id);
		
		/*
		var div = $('<div>').addClass('timeLEF').addClass('layerEditingFrame').attr('id','player-'+this.model.id);
		template.find('#controls').append(div);
		*/
		
		this.editorLoaded = false;
		
		
		var opacityArgs = {
			min:0,
			max:1,
			value:_this.attr.opacity,
			step:0.01,
			layer_id:_this.model.id,
			label:'opacity',
			css: 'opacity',
			suffix:''
		};
		var widthArgs = {
			min:0,
			max:100,
			value:_this.attr.w,
			step:1,
			layer_id:_this.model.id,
			label:'width',
			css: 'width',
			suffix:'%'
		};
		
		controls.append( makeCSSLayerSlider(widthArgs) );
		
		controls.append( makeCSSLayerSlider(opacityArgs) );
		
		controls.find('.layer-slider')
			.bind( "slidestart", function(event, ui) {
				$('#layer-preview-'+_this.model.id).css({
					'height':$('#media_'+_this.model.id).height(),
//					'backgroundImage':'url(' + sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + 'images/items/'+_this.attr.item_id+'_s.jpg)'
					'backgroundImage':'none'
					});
			});
		controls.find('.layer-slider').bind( "slidestop", function(event, ui) {
			_this.onAttributeUpdate();
		});
		
		controls.append( makeFullscreenButton() );
		
		controls.find('.fullscreen-submit')
			.click(function(){
				$('#layer-preview-'+_this.model.id ).css( {'top':'0px','left':'0px','width':'100%'});
				$('#layer-edit-'+_this.model.id).find('#Width-slider')
					.slider("option", "value", 100 );
				_this.onAttributeUpdate();
			});
		
		this.layerControls = controls;
		return controls;
	},
	
	onControlsOpen: function()
	{
			var _this = this;
			if(!this.editorLoaded){
				
				//is this necessary?
				var html = $('<div>').addClass('clearfix')
					.css('height','140px') //this should moved out
					.html(this.getTemplate());
				$('#player-'+this.model.id).prepend(html);
				_this.player = new ZeegaMP(_this.model.id,_this.attr.url,_this.attr.in,_this.attr.out,_this.attr.volume,'layer-preview-'+_this.model.id);
			
				//player triggers 'update' event to persist changes
				$('#player-'+_this.model.id).bind('updated',function(){
					_this.onAttributeUpdate();
				});
				_this.editorLoaded=true;
			}
	},
	
	onControlsClose: function()
	{
		if(this.player) this.player.pause();
	},
	
	
	drawToVisualEditor : function()
	{
		var _this  = this;

		var el = $('<div>');

		var h = Math.floor(this.attr.w*1.5/this.attr.aspect);
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

		el.addClass('media editable draggable')
			.attr({
				'id' : 'layer-preview-'+this.model.id,
				'data-layer-id' : this.model.id
			})
			.css(cssObj);
					
		el.draggable({
			//when the image stops being dragged
			stop : function(){
				_this.onAttributeUpdate();
			}
		});

		this.visualEditorElement = el;

		return( el );
	},
	
	
	preloadMedia : function()
	{
		console.log('video preloadMedia');
		
		//make dom object
		var _this = this;
		var container= $('<div>');
		
		var h = Math.floor(this.attr.w*1.5/this.attr.aspect);

		var cssObj = {
			//'backgroundImage':'url(http:/core.zeega.org/images/items/'+this.attr.item_id+'_s.jpg)',
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
		//this.player=new ZeegaMP(_this.model.id,_this.attr.url,_this.attr.in,_this.attr.out,_this.attr.volume,'layer-publish-'+_this.model.id);
		console.log(this.dom);
		console.log(this.player);
	},
	
	drawPublish : function(z)
	{
		console.log('video drawPublish');
		
		console.log(this.dom);
		
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
	
	
	onAttributeUpdate : function()
	{
		console.log('VIDEO Attribute update');
		console.log(this.layerControls);
		
		
		
		var newAttr = {};
		
		newAttr.x = Math.floor( this.visualEditorElement.position().left/6);
		newAttr.y = Math.floor( this.visualEditorElement.position().top/4);
		newAttr.opacity = Math.floor( this.layerControls.find('#opacity-slider').slider('value') * 100 )/100;
		newAttr.w = Math.floor( this.layerControls.find('#width-slider').slider('value') );
		if(this.editorLoaded)
		{
			console.log('Volume: '+this.player._vol);
			newAttr.in=this.player._start_time;
			newAttr.out=this.player._stop_time;
			newAttr.volume = Math.floor(this.player._vol*100.0);
			

		}
		
console.log(newAttr);
		this.setAttributes(newAttr);
		this.save();
	},

	exit: function()
	{
		this.player.pause();
	},
	
	getTemplate : function(){
	
		var html ='<div id="durationWrapper"><span style="line-height: 1.9;"> Duration: </span><span id="layerDuration" class="layerLength">0 </span> </div>';
		html +='<div id="avControls"> ';
		html +='<div id="avStart"> ';
		html +='<span>In:</span><input disabled="true"  name="avStartMinutes" class="mediaInput mediaInputMinutes" id="avStartMinutes" value="0" type="text">:<input  disabled="true"  name="avStartSeconds" class="mediaInput mediaInputSeconds" id="avStartSeconds" value="00.0" type="text">';
		html +='</div>';
		html +='<div id="avStop"> ';
		html +='<span>Out:</span> <input name="avStopMinutes" class="mediaInput" disabled="true" id="avStopMinutes" value="0" type="text">:<input  disabled="true"  class="mediaInput" name="avStopSeconds" id="avStopSeconds" value="00.0" type="text">';
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
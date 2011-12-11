
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
		'left' : 0,
		'top' : 0,
		'height' : 100,
		'width' : 100,
		'volume' : 50,
		'in'  : 0,
		'out' : 0,
		'opacity':1,
		'dimension':1.3
	},
	
	controls : function()
	{
		var _this  = this;
		
		//need this to be accessable inside the draggable function
		
		this.layerControls.addClass('timeLEF')
			.addClass('layerEditingFrame')
			.attr('id','player-'+this.model.id);
		
		/*
		var div = $('<div>').addClass('timeLEF').addClass('layerEditingFrame').attr('id','player-'+this.model.id);
		template.find('#controls').append(div);
		*/

		this.editorLoaded = false;
		
		var widthArgs = {
			min : 1,
			max : 200,
			label : 'Scale',
			step : 1,
			property : 'width',
			suffix : '%',
			value : this.model.get('attr').width,
			dom : this.layerControls,
			css : true,
			
			scaleWith : 'height',
			scaleValue : this.model.get('attr').height
			
		};
		var scaleSlider = makeUISlider( widthArgs );
		
		var opacityArgs = {
			max : 1,
			label : 'Opacity',
			step : 0.01,
			property : 'opacity',
			value : this.model.get('attr').opacity,
			dom : this.layerControls,
			css : true
		};
		var opacitySlider = makeUISlider( opacityArgs );
		
		this.layerControls
			.append( scaleSlider )
			.append( opacitySlider )
			.append( makeFullscreenButton( this.layerControls ) );
		
	},
	
	onControlsOpen: function()
	{
		if( !this.editorLoaded )
		{
			console.log('OPEN CONTROLSSSSSS');
			var _this = this;
			
			//is this necessary?
			var html = $('<div>').addClass('clearfix')
				.css( 'height' , '140px' ) //this should moved out
				.html( this.getTemplate() );
			this.layerControls.prepend( html );
			this.player = new ZeegaMP( _this.model.id,_this.attr.url,_this.attr.in,_this.attr.out,_this.attr.volume,'layer-preview-'+_this.model.id, 'player-' +_this.model.id );

			//player triggers 'update' event to persist changes
			this.layerControls.bind( 'updated' , function(){
				
				var properties = {
					inPoint : {
						property : 'in',
						value : _this.player.getInPoint(),
						css : false
					},
					outPoint : {
						property : 'out',
						value : _this.player.getOutPoint(),
						css : false
					},
					volume : {
						property : 'volume',
						value : _this.player.getVolume(),
						css : false
					}
				};
				_this.layerControls.trigger( 'update' , [ properties ]);
				
			});
			this.editorLoaded = true;
		}

	},
	
	onControlsClose: function()
	{
		if(this.player) this.player.pause();
	},
	
	
	visual : function()
	{
		//var h = Math.floor( this.attr.width * 1.5 / this.attr.dimension );

		var cssObj = {
			'backgroundImage':'url('  + sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + 'images/items/'+this.attr.item_id+'_s.jpg)',
			'backgroundSize': '100px 100px',
			'position' : 'absolute',
			'top' : this.attr.top+"%",
			'left' : this.attr.left+"%",
			'z-index' : this.zIndex,
			
			'width' : this.attr.width +'%',
			'height' : this.attr.height +'%',
			
			'opacity' : this.attr.opacity
		};

		
		this.visualEditorElement.addClass('media editable draggable')
			.attr({
				'id' : 'layer-preview-'+this.model.id,
				'data-layer-id' : this.model.id
			})
			.css(cssObj);
	},
	
	thumb : function()
	{
		var cssObj = {
			'backgroundImage':'url('  + sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + 'images/items/'+this.attr.item_id+'_s.jpg)',
			'backgroundSize': '100px 100px',
		};
		
		this.thumbnail.css( cssObj );
	},
	
	
	preload : function()
	{
		//make dom object
		var _this = this;
		
		var ratio = parseFloat($('#zeega-player').css('width'))/parseFloat($('#zeega-player').css('height'));
		var h = Math.floor( this.attr.width * ratio / this.attr.dimension );
		var cssObj = {
			'position' : 'absolute',
			'top' : "-1000%",
			'left' : "-1000%",
			'z-index' : this.zIndex,
			'width' : this.attr.width+"%",
			'height' : h+"%",
			'opacity' : this.attr.opacity
		};
		
		this.display
			.attr({
				'id' : 'layer-publish-'+this.model.id,
				'data-layer-id' : this.model.id
			})
			.css(cssObj);
		
		this.player=new ZeegaAV(this.model.id,this.attr.url,this.attr.in,this.attr.out,this.attr.volume,'layer-publish-'+this.model.id,'zeega-player');
		
	},
	
	play : function( z )
	{
		this.display.css({'z-index':z,'top':this.attr.top+"%",'left':this.attr.left+"%"});
		this.player.play();
	},
	
	stash :function()
	{
		this.display.css({'top':"-1000%",'left':"-1000%"});
		this.player.pause();
	},

	exit: function()
	{
		this.player.pause();
	},
	
	getTemplate : function(){
	
		var 		html ='		<div id="loadingMP" ><p>Loading Media...</p></div>';
		html+='<div id="durationWrapper"><span style="line-height: 1.9;"> Duration: </span><span id="layerDuration" class="layerLength">0 </span> </div>';
		html +='<div id="avControls"> ';
		html +='<div id="avStart"> ';
		html +='<span style="font-weight: bold;">In:</span><span id="avStartMinutes" >0</span>:<span id="avStartSeconds" >0</span>';
		html +='</div>';
		html +='<div id="avStop"> ';
		html +='<span style="font-weight: bold;">In:</span><span id="avStopMinutes" >0</span>:<span id="avStopSeconds" >0</span>';
		html +=	'</div>';
		html +='</div>';
		html +='<div class="avComponent"> ';
		html +='	<div id="mediaPlayerMP"> ';

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
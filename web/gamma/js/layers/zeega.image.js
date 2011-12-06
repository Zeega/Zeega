/************************************

	IMAGE LAYER CHILD CLASS
	
	
	TODO:
		
		Features: 
			-fullscreen bleed?

************************************/

var ImageLayer = ProtoLayer.extend({
	
	layerType : 'VISUAL',
	draggable : true,

	defaultAttributes : {
		'title' : 'Image Layer',
		'url' : 'none',
		'left' : 0,
		'top' : 0,
		'height' : 100,
		'width' : 100,
		'opacity':1,
		'aspect':1.33
	},


	controls : function()
	{
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
		
		var widthArgs = {
			min : 1,
			max : 200,
			label : 'Width',
			step : 1,
			property : 'width',
			suffix : '%',
			value : this.model.get('attr').width,
			dom : this.layerControls,
			css : true
		};
		var scaleSlider = makeUISlider( widthArgs );
		
		this.layerControls
			.append( opacitySlider )
			.append( scaleSlider )
			.append( makeFullscreenButton( this.layerControls ) );
	},
	
	visual : function()
	{
		this.visualEditorElement.css({
			width : this.attr.width+'%',
			opacity : this.attr.opacity
		})
		
		var img = $('<img>')
			.attr('src', this.model.get('attr').url)
			.css({'width':'100%'});
						
		this.visualEditorElement.append( img );
	},

	drawThumb : function(){
		
		$('#preview-media').append($('<div>').css( {
			'position' : 'absolute',
			'top' : this.attr.top  +'%',
			'left' : this.attr.left  +'%',
			'width' : this.attr.width,
			'opacity' : this.attr.opacity
		}).append($('<img>')
			.attr({'src':this.attr.url,'id':'layer-image-'+this.model.id})
			.css({'width':'100%'})));
	
	},
	
	preload : function(){
		//make dom object
		//maybe these should all be wrapped in divs?
		var div = $('<div>');

		var cssObj = {
			'position' : 'absolute',
			'top' : '-100%',
			'left' : '-100%',
			'z-index' : this.zIndex,
			'width' : this.attr.w+'%',
			'opacity' : this.attr.opacity
		};

		div.css(cssObj);

		$(div).attr('data-layer',this.model.id);

		var img=$('<img>')
			.attr({'src':this.attr.url,'id':'layer-image-'+this.model.id})
			.css({'width':'100%'});

		this.dom = div;

		//make dom
		$(this.dom).append(img);
		//add to dom

		$('#zeega-player').find('#preview-media')
			.append(this.dom)
			.trigger('ready',{'id':this.model.id});
		
	},
	
	play : function( z )
	{
		console.log('image player.play');
		this.dom.css({'z-index':z,'top':this.attr.top+"%",'left':this.attr.left+"%"});
	},

	stash : function()
	{
		console.log('image player.stash');
		this.dom.css({'top':"-100%",'left':"-100%"});
	}
	
		
});
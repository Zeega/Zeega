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
		'aspect':1.33,
		'citation':true,
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
		var cssObj = {
			width : this.attr.width+'%',
			opacity : this.attr.opacity
		};
		
		var img = $('<img>')
			.attr('src', this.model.get('attr').url)
			.css({'width':'100%'});
						
		this.visualEditorElement
			.css( cssObj )
			.append( img );
	},

	thumb : function()
	{
		var img = $('<img>')
			.attr('src', this.model.attr.url)
			.css({'width':'100%'});
				
		this.thumbnail.append( img );
	},
	
	preload : function( target ){

		var cssObj = {
			'position' : 'absolute',
			'top' : '-1000%',
			'left' : '-1000%',
			'z-index' : this.zIndex,
			'width' : this.attr.width +'%',
			'opacity' : this.attr.opacity
		};
		var _this=this;
		var img = $('<img>')
			.attr( 'src' , this.attr.url )
			.css( 'width', '100%');
		img.load(function(){target.trigger('ready', { 'id' : _this.model.id } )});

		this.display.css( cssObj )
			.append( img );
		
		//target.trigger( 'ready' , { 'id' : this.model.id } );
	},
	
	play : function( z )
	{
		this.display.css({'z-index':z,'top':this.attr.top+"%",'left':this.attr.left+"%"});
	},

	stash : function()
	{
		this.display.css({'top':"-1000%",'left':"-1000%"});
	}
	
		
});
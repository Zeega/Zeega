/************************************

	Rectangle LAYER CHILD CLASS
	
	
	TODO:
		
		Features: 
			-fullscreen bleed?

************************************/

var RectangleLayer = ProtoLayer.extend({
	
	layerType : 'VISUAL',
	draggable : true,
	linkable : true,

	defaultAttributes : {
		'title' : 'Color Layer',
		'url' : 'none',
		backgroundColor: {r:255,g:0,b:255,a:0.8},
		'left' : 0,
		'top' : 0,
		'height' : 100,
		'width' : 100,
		'opacity':1,
	},


	controls : function()
	{

		var widthArgs = {
			min : 1,
			max : 100,
			label : 'Width',
			step : 1,
			property : 'width',
			suffix : '%',
			value : this.model.get('attr').width,
			dom : this.layerControls,
			css : true
		};
		var widthSlider = makeUISlider( widthArgs );
		
		var heightArgs = {
			min : 1,
			max : 100,
			label : 'Height',
			step : 1,
			property : 'height',
			suffix : '%',
			value : this.model.get('attr').height,
			dom : this.layerControls,
			css : true
		};
		var heightSlider = makeUISlider( heightArgs );
		
		var colorPickerArgs = {
			label : 'Color',
			property : 'backgroundColor',
			id : this.model.id,
			color : this.attr.backgroundColor,
			controls : this.layerControls,
			target : this.visualEditorElement
	    };
	    var colorPicker = makeColorPicker(colorPickerArgs);
		
		this.layerControls
			.append( widthSlider )
			.append( heightSlider )
			.append( colorPicker )
			.append( makeFullscreenButton( this.layerControls ) );
	},
	
	visual : function()
	{
		
		var cssObj = {
			backgroundColor : this.getRGBAColor( this.attr.backgroundColor )
		};
		
		this.visualEditorElement
			.css( cssObj );
	},

	thumb : function()
	{
		var cssObj = {
			backgroundColor : this.getRGBAColor( this.attr.backgroundColor )
		};
				
		this.thumbnail.css( cssObj );
	},
	
	preload : function( target )
	{
		var cssObj = {
			backgroundColor : this.getRGBAColor( this.attr.backgroundColor )
		};

		this.display.css( cssObj );

		target.trigger( 'ready' , { 'id' : this.model.id } );
	},
	
	play : function( z )
	{
		this.display.css({'z-index':z,'top':this.attr.top+"%",'left':this.attr.left+"%"});
	},

	stash : function()
	{
		this.display.css({'top':"-1000%",'left':"-1000%"});
	},
	
	getRGBAColor : function ( colorObj )
	{
		_.defaults( colorObj , {a : 1 } );
		var rgbaColor = 'rgba('+colorObj.r+','+colorObj.g+','+colorObj.b+','+colorObj.a+')'
		return rgbaColor;
	}
	
		
});
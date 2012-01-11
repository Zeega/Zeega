/************************************

	DOCUMENTCLOUD LAYER CHILD CLASS
	
	
	TODO:
		
		Features: 
			-fullscreen bleed?

************************************/

var DocumentCloudLayer = ProtoLayer.extend({
	
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
			.attr('src', this.attr.thumbnail_url)
			.css({'width':'100%'});
						
		this.visualEditorElement
			.css( cssObj )
			.append( img );
	},

	thumb : function()
	{
		var img = $('<img>')
			.attr('src', this.attr.thumbnail_url)
			.css({'width':'100%'});

		this.thumbnail.append( img );
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
			'height' : this.attr.h+'%',
			'opacity' : this.attr.opacity
		};

		div.css(cssObj);

		$(div).attr('data-layer',this.model.id);
	
		/* For use with generic document cloud documents
		
		var img=$('<iframe>')
			.attr({'src':'https://www.documentcloud.org/documents/'+this.attr.url,'id':'layer-iframe-'+this.model.id})
			.css({'width':'100%','height':'100%'});
		*/
		
		//** For use with DocumentCloud Account: allows sidebar and text tab removal **//
	
		var document=$('<div>')
			.attr({'id':'DV-viewer-'+this.model.id})
			.addClass('DV-container')
			.css({'width':'100%','height':'100%'});
		
		//** End DocumentCloud Account**//
		
		
		this.dom = div;

		//make dom
		$(this.dom).append(document);
		//add to dom

		$('#zeega-player').find('#preview-media')
			.append(this.dom)
			.trigger('ready',{'id':this.model.id});
		
	},
	
	play : function( z )
	{
		//** For use with DocumentCloud Account: allows sidebar and text tab removal **//
		DV.load('http://www.documentcloud.org/documents/'+this.attr.url+'.js', {sidebar: false,  text: false,   container: "#DV-viewer-"+this.model.id});
		//** End DocumentCloud Account**//
		
		console.log('iframe player.play');
		this.dom.css({'z-index':z,'top':this.attr.y+"%",'left':this.attr.x+"%"});
	},
	

	
	stash : function()
	{
		console.log('iframe player.stash');
		this.dom.css({'top':"-100%",'left':"-100%"});
	}
	
		
});
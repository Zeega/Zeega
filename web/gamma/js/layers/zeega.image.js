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
		'x' : 0,
		'y' : 0,
		'h' : 100,
		'w' : 100,
		'opacity':1,
		'aspect':1.33
	},


	drawControls : function()
	{
		var _this = this;
		var controls = $('<div>');
		
		var opacityArgs = {
			max:1,
			value : _this.model.get('attr').opacity,
			step : 0.01,
			layer_id : _this.model.id,
			label : 'opacity',
			css : 'opacity',
			suffix : '',
			layerClass : _this
		};
		var widthArgs = {
			value : _this.model.get('attr').w,
			layer_id : _this.model.id,
			label : 'width',
			css : 'width',
			suffix : '%',
			layerClass : _this
		};

		controls.append( makeCSSLayerSlider(widthArgs) );
		controls.append( makeCSSLayerSlider(opacityArgs) );
		
		controls.find('.layer-slider').bind( "slidestop", function(event, ui) {
			_this.onAttributeUpdate();
		});
		
		controls.append( makeFullscreenButton() );
		controls.find('.fullscreen-submit')
			.click(function(){
				$('#layer-preview-'+_this.model.id ).css( {'top':'0px','left':'0px','width':'100%'});
				$('#layer-edit-'+_this.model.id).find('#width-slider').slider("option", "value", 100 );
				_this.onAttributeUpdate();
			});
			
		
		//set to layer controls
		this.layerControls = controls;
		return controls;
		
	},
	
		


	drawToVisualEditor : function()
	{

		var el = $('<div>');

		var img = $('<img>')
			.attr({'src': this.model.get('attr').url,'id':'layer-image-' + this.model.id})
			.css({'width':'100%'});
						
		el.append(img);
		
		//add to dom
		this.visualEditorElement = el;
		
		return( el );
	
	},

	
	onAttributeUpdate : function()
	{
		var _this = this;
		var newAttr = {
			x : Math.floor( _this.visualEditorElement.position().left/6),
			y : Math.floor( _this.visualEditorElement.position().top/4),
			opacity : Math.floor( _this.layerControls.find('#opacity-slider').slider('value') * 100 )/100,
			w : Math.floor( _this.layerControls.find('#width-slider').slider('value') ),
		};
		
		this.setAttributes(newAttr);
		this.save();
	},	

	drawThumb : function(){
		
		$('#preview-media').append($('<div>').css( {
			'position' : 'absolute',
			'top' : this.attr.y  +'%',
			'left' : this.attr.x  +'%',
			'width' : this.attr.w+'%',
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
		this.dom.css({'z-index':z,'top':this.attr.y+"%",'left':this.attr.x+"%"});
	},
	
	pause : function()
	{
		// not needed
	},
	
	stash : function()
	{
		console.log('image player.stash');
		this.dom.css({'top':"-100%",'left':"-100%"});
	}
	
		
});
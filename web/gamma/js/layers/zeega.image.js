/************************************

	IMAGE LAYER CHILD CLASS
	
	
	TODO:
		
		Features: 
			-fullscreen bleed?

************************************/

var ImageLayer = ProtoLayer.extend({
	
	layerType : 'visual',
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

	controls : {
		
		draw : function()
		{
			var _this  = this.parent;

			var opacityArgs = {
				min : 0,
				max : 1,
				value : _this.model.get('attr').opacity,
				step : 0.01,
				layer_id : _this.model.id,
				label : 'Opacity',
				css : 'opacity',
				suffix : '',
			};
			var widthArgs = {
				min : 0,
				max : 100,
				value : _this.model.get('attr').w,
				step : 1,
				layer_id : _this.model.id,
				label : 'Width',
				css : 'width',
				suffix : '%',
			};

			var controls = $('<div>');
			controls.append( makeCSSLayerSlider(widthArgs) );
			controls.append( makeCSSLayerSlider(opacityArgs) );

			controls.find('.layer-slider')
				.bind( "slidestop", function(event, ui) {
					_this.editor.onAttributeUpdate();
				});

			controls.append( makeFullscreenButton() );
			controls.find('.fullscreen-submit')
				.click(function(){
					$('#layer-preview-'+_this.model.id ).css( {'top':'0px','left':'0px','width':'100%'});
					$('#layer-edit-'+_this.model.id).find('#Width-slider').slider("option", "value", 100 );
					_this.editor.onAttributeUpdate();
				});

			return(controls);
		},

	}, // controls
	
	editor : {
				
		visual : {
			
			draw : function()
			{
				var _this = this.parent;

				var el = $('<div>');

				var img = $('<img>')
					.attr({'src': _this.model.get('attr').url,'id':'layer-image-' + _this.model.id})
					.css({'width':'100%'});
								
				el.append(img);
				
				//add to dom
				_this.dom = el;
				return( el );
			
			}
		}, // visual
		
		interaction : {},
		
		onAttributeUpdate : function()
		{
			var _this = this.parent;
			
			var newAttr = {};
			newAttr.x = Math.floor( _this.dom.position().left/6),
			newAttr.y = Math.floor( _this.dom.position().top/4),
			newAttr.opacity = _this.dom.find('#Opacity-slider').slider('value'),
			newAttr.w = _this.dom.find('#Width-slider').slider('value'),

			_this.util.setAttributes(newAttr);
			_this.util.save();
		}
		

		
	}, // editor
	
	player : {
		
		preload : function()
		{
			
			/**************** NEEDS UPGRADING *******************/
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
		
		play : function()
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
		},
		
	} // player
		
});
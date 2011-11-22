/************************************

	IMAGE LAYER CHILD CLASS
	
	
	TODO:
		
		Features: 
			-fullscreen bleed?

************************************/

var ImageLayer = ProtoLayer.extend({
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
	
	getAttr : function(){return this.defaultAttributes},
	

	drawControls : function(template){
		
		var opacityArgs = {
			min:0,
			max:1,
			value:this.attr.opacity,
			step:0.01,
			layer_id:this.model.id,
			label:'Opacity',
			css: 'opacity',
			suffix: '',
		};
		var widthArgs = {
			min:0,
			max:100,
			value:this.attr.w,
			step:1,
			layer_id:this.model.id,
			label:'Width',
			css: 'width',
			suffix: '%',
		};
		
		
		template.find('#controls').append( makeCSSLayerSlider(widthArgs) );
		template.find('#controls').append( makeCSSLayerSlider(opacityArgs) );
		
		//need this to be accessable inside the event functions
		var that  = this;
		template.find('#controls').find('.layer-slider').bind( "slidestop", function(event, ui) {
			that.updateAttr();
			});
		template.find('#controls').append( makeFullscreenButton());
		template.find('#controls').find('.fullscreen-submit').click(function(){
			$('#layer-preview-'+that.model.id ).css( {'top':'0px','left':'0px','width':'100%'});
			$('#layer-edit-'+that.model.id).find('#Width-slider').slider("option", "value", 100 );
			that.updateAttr();
		});
		
		//change icon on layer template
		template.find('.asset-type-icon').removeClass('ui-icon-pin-w');
		template.find('.asset-type-icon').addClass('ui-icon-image');
	},
	
	drawPreview : function(){
		//make dom object
		//maybe these should all be wrapped in divs?
		var div = $('<div>');
		//div.data('layer-id',this.model.id);
		var cssObj = {
			'position' : 'absolute',
			'top' : this.attr.y  +'%',
			'left' : this.attr.x  +'%',
			'z-index' : this.zIndex,
			'width' : this.attr.w+'%',
			'opacity' : this.attr.opacity
		};

		
		div.addClass('media editable draggable')
			.attr({
				'id' : 'layer-preview-'+this.model.id,
				'data-layer-id' : this.model.id
			})
			.css(cssObj);
		//need this to be accessable inside the draggable function
		var _this  = this;
		

		div.draggable({
			//when the image stops being dragged
			stop : function(){
				_this.updateAttr();
			}
		});

		
		var img=$('<img>')
			.attr({'src':this.attr.url,'id':'layer-image-'+this.model.id})
			.css({'width':'100%'});
		
		this.dom = div;
		
		//make dom
		$(this.dom).append(img);
		//add to dom
		this.addToWorkspace(this.dom);
	},
	
	preloadMedia : function(){
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
	
	
	drawPublish : function(z)
	{

		console.log('image drawPublish: '+ this.model.id);
		this.dom.css({'z-index':z,'top':this.attr.y+"%",'left':this.attr.x+"%"});
	},
	
	hidePublish :function()
	{
		console.log('image hidePublish: ' + this.model.id);
		this.dom.css({'top':"-100%",'left':"-100%"});
	},
	
	updateAttr: function(){
	
		//get a copy of the old attributes into a variable
		var newAttr = this.attr;
		//set the new x/y coords into the attributes
		newAttr.x = Math.floor( this.dom.position().left/6);
		newAttr.y = Math.floor( this.dom.position().top/4);

		newAttr.opacity = $('#layer-edit-'+this.model.id).find('#Opacity-slider').slider('value');
		newAttr.w = $('#layer-edit-'+this.model.id).find('#Width-slider').slider('value');
		
		
		//set the attributes into the layer
		this.updateLayerAttr(newAttr);
		//save the layer back to the database
		this.saveLayer();
	
	
	}
	
});

/************************************

	VIDEO LAYER CHILD CLASS

************************************/

var VideoLayer = ProtoLayer.extend({
	
	defaultAttributes : {
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
	drawControls : function(template){
		
		//need this to be accessable inside the draggable function
		var that  = this;
		
		var div = $('<div>').addClass('timeLEF').addClass('layerEditingFrame').attr('id','player-'+this.model.id);
		template.find('#controls').append(div);
		
		
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
		var widthArgs = {
			min:0,
			max:100,
			value:that.attr.w,
			step:1,
			layer_id:that.model.id,
			label:'Width',
			css: 'width',
			suffix:'%'
		};
		
	
		
		
		template.find('#controls').append( makeCSSLayerSlider(widthArgs) );
		template.find('#controls').append( makeCSSLayerSlider(opacityArgs) );
		
		
		
		
		template.find('#controls').find('.layer-slider').bind( "slidestop", function(event, ui) {
			
			$('#layer-preview-'+that.model.id).css({'height':$('#media_'+that.model.id).height(),'backgroundImage':'url(http://mlhplayground.org/Symfony/web/images/thumbs/'+that.attr.item_id+'_s.jpg)'});
			that.updateAttr();
			
		});
		
		template.find('#controls').find('.layer-slider').bind( "slidestart", function(event, ui) {
			
			
			$('#layer-preview-'+that.model.id).css({'backgroundImage':'none'});
			
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
	openControls: function(){
			var that=this;
			if(!this.editorLoaded){
			$('#player-'+this.model.id).load('http://alpha.zeega.org/test/web/gamma/js/templates/zeega.av.html',function(){
				that.player=new ZeegaMP(that.model.id,that.attr.url,that.attr.in,that.attr.out,that.attr.volume,'layer-preview-'+that.model.id);
				
				//player triggers 'update' event to persist changes
				$('#player-'+that.model.id).bind('updated',function(){
					that.updateAttr();
				});
				that.editorLoaded=true;
			});
			
			}
		
	},
	closeControls: function(){
		
		if(this.player) this.player.pause();
		
		console.log('editClose');
		
	},
	drawPreview : function(){
		//make dom object

		var container= $('<div>');
		
		var h=Math.floor(this.attr.w*1.5/this.attr.aspect);
		console.log(h);
		var cssObj = {
			'backgroundImage':'url(http://mlhplayground.org/Symfony/web/images/thumbs/'+this.attr.item_id+'_s.jpg)',
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
		
		
		//$('#layer_'+this.model.id).append(img);
		this.dom = container;
		
		//draw to the workspace
		$('#workspace').append(this.dom);
		
		
	},
	
	
	preLoad : function(){
		//make dom object

		var container= $('<div>');
		
		var h=Math.floor(this.attr.w*1.5/this.attr.aspect);
		console.log(h);
		var cssObj = {
			'backgroundImage':'url(http:/core.zeega.org/images/items/'+this.attr.item_id+'_s.jpg)',
			'backgroundSize': '100px 100px',
			'position' : 'absolute',
			'top' : "-100%",
			'left' : "-100%",
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
		$('#zeega-player').append(this.dom);
		
		this.player=new ZeegaAV(that.model.id,that.attr.url,that.attr.in,that.attr.out,that.attr.volume,'layer-publish-'+that.model.id,'zeega-player');
				
		
	},
	
	drawPublish : function(){
		//make dom object
		this.dom.css({'top':this.attr.y+"%",'left':this.attr.x});
		this.player.play();
		
	},
	updateAttr: function(){
	
		//get a copy of the old attributes into a variable
		var newAttr = this.attr;
		//set the new x/y coords into the attributes
		newAttr.x = this.dom.position().left/6.0;
		newAttr.y = this.dom.position().top/4.0;
		newAttr.opacity = $('#layer-edit-'+this.model.id).find('#Opacity-slider').slider('value');
		newAttr.w = $('#layer-edit-'+this.model.id).find('#Width-slider').slider('value');
		if(this.editorLoaded){
			console.log('Volume: '+this.player._vol);
			newAttr.in=this.player._start_time;
			newAttr.out=this.player._stop_time;
			newAttr.volume = Math.floor(this.player._vol*100.0);
			

		}
		//set the attributes into the layer
		this.updateLayerAttr(newAttr);
		//save the layer back to the database
		this.saveLayer();
	
	
	}
	
});
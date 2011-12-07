
/************************************

	VIDEO LAYER CHILD CLASS

************************************/

var YoutubeLayer = VideoLayer.extend({
	
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
							'dimension':1.33
						},
	
	onControlsOpen: function(){
			var _this = this;
			if(!this.editorLoaded){
				
				var html = this.getTemplate();
				$('#player-'+this.model.id).html(html);
				//that.player=new ZeegaMP(that.model.id,that.attr.url,that.attr.in,that.attr.out,that.attr.volume,'layer-preview-'+that.model.id);
				_this.player=new ZeegaYoutube(_this.model.id,_this.attr.url,_this.attr.in,_this.attr.out,_this.attr.volume,'layer-preview-wrapper-'+_this.model.id,_this.attr.w,_this.attr.h);
			
				//player triggers 'update' event to persist changes
				$('#player-'+_this.model.id).bind('updated',function(){
					_this.updateAttr();
				});
				_this.editorLoaded=true;
			}
	},
	onControlsClose: function(){
		
	
	},
	
	drawToVisualEditor : function(){
		var _this  = this;
		var el = $('<div>');

		var h=Math.floor(this.attr.w*1.5/this.attr.dimension);
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
		
		var wrapper = $('<div>').css({'width':'100%','height':'100%'}).attr('id','layer-preview-wrapper-'+this.model.id);
			
			
		//need this to be accessable inside the draggable function
		var that  = this;
		
		el.draggable({
			//when the image stops being dragged
			stop : function(){
				that.updateAttr();
			}
		});
		
				
		el.bind('slide',function(){
		
				var height = Math.floor($('#layer-edit-'+that.model.id).find('#Scale-slider').slider('value')*1.5/that.attr.dimension);
		
				$(this).css({'opacity':$('#layer-edit-'+that.model.id).find('#Opacity-slider').slider('value'),
						'width': $('#layer-edit-'+that.model.id).find('#Scale-slider').slider('value')+'%',
						'height':height+'%'});
				console.log('height: '+height);
			
			
			});
		

		el.append(wrapper);
		
		this.visualEditorElement = el;
		return( el );
	},
	
	
	
	
	preload : function(){
		
		//make dom object
		var that=this;
		var container= $('<div>');
		var ratio = parseFloat($('#zeega-player').css('width'))/parseFloat($('#zeega-player').css('height'));
		var h = Math.floor(this.attr.w*ratio/this.attr.dimension);

		var cssObj = {
			'position' : 'absolute',
			'top' : "-200%",
			'left' : "-200%",
			'z-index' : this.zIndex,
			'width' : this.attr.w+"%",
			'height' : h+"%",
			'opacity' : this.attr.opacity
		};
	
		container.attr({
				'id' : 'layer-publish-'+this.model.id,
				'data-layer-id' : this.model.id
			})
			.css(cssObj);
			
		var wrapper = $('<div>').css({'width':'100%','height':'100%','background':'transparent'}).attr('id','layer-publish-wrapper-'+this.model.id)
			
		container.append(wrapper);
		
		//$('#layer_'+this.model.id).append(img);
		this.dom = container;
		
		//draw to the workspace
		$('#zeega-player').find('#preview-media').append(this.dom);
		
		that.player=new ZeegaYoutubePublish(that.model.id,that.attr.url,that.attr.in,that.attr.out,that.attr.volume,'layer-publish-wrapper-'+that.model.id,'zeega-player', this.attr.w, h);
			
		
	},
	
	play : function(z){
		//make dom object
		this.dom.css({'z-index':z,'top':Math.floor(parseInt(this.attr.y))+'%','left':Math.floor(parseInt(this.attr.x))+'%'});
		console.log('medidfsafdsfdasavol'+this.attr.volume);
		this.player.play();
		
	},
	
	stash :function()
	{
		
		this.dom.css({'top':"-200%",'left':"-200%"});
		this.player.pause();
	},
	
	onAttributeUpdate: function(){
	
		//get a copy of the old attributes into a variable
		var newAttr = this.attr;
		//set the new x/y coords into the attributes
		newAttr.x = this.visualEditorElement.position().left/6.0;
		newAttr.y = this.visualEditorElement.position().top/4.0;
		newAttr.opacity = $('#layer-edit-'+this.model.id).find('#Opacity-slider').slider('value');
		newAttr.w = $('#layer-edit-'+this.model.id).find('#Scale-slider').slider('value');
		
		
		console.log(this.model.id);
		
		
		if(this.editorLoaded){
			console.log('Volume: '+this.player._vol);
			newAttr.in=this.player._start_time;
			newAttr.out=this.player._stop_time;
			newAttr.volume = this.player._vol;
			

		}
		//set the attributes into the layer
		this.setAttributes(newAttr);
	
	
	
	},
	exit: function(){
		
		this.player.pause();
	},
	
	
	
});

/************************************

	VIDEO LAYER CHILD CLASS

************************************/

var YoutubeLayer = VideoLayer.extend({
	
	defaultAttributes : {
		'title' : 'Video Layer',
		'url' : 'none',
		'left' : 0,
		'top' : 0,
		'height' : 100,
		'width' : 100,
		'volume' : 50,
		'in'  : 0,
		'out' : 0,
		'opacity' : 1,
		'dimension' : 1.33
	},
	
	onControlsOpen: function(){
		if( !this.editorLoaded ){
			var _this = this;
			
			var html = $('<div>').addClass('clearfix')
				.css( 'height' , '140px' ) //this should moved out
				.html( this.getTemplate() );
			this.layerControls.prepend( html );
			
			//this.layerControls.prepend( this.getTemplate() );
			this.player = new ZeegaYoutube(_this.model.id,_this.attr.url,_this.attr.in,_this.attr.out,_this.attr.volume,'layer-preview-wrapper-'+_this.model.id,_this.attr.width,_this.attr.height);
		
			this.layerControls.bind( 'updated' , function(){
				var properties = {
					inPoint : {
						property : 'in',
						value : _this.player._start_time,
						css : false
					},
					outPoint : {
						property : 'out',
						value : _this.player._stop_time,
						css : false
					},
					volume : {
						property : 'volume',
						value : Math.floor( _this.player._vol * 100.0 ),
						css : false
					}
				};
				_this.layerControls.trigger( 'update' , [ properties ]);
			});
			
			_this.editorLoaded=true;
		}
	},
	
	visual : function(){
		var _this  = this;

		var h = Math.floor( this.attr.w * 1.5 / this.attr.dimension );
		var cssObj = {
			'backgroundImage':'url('  + sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + 'images/items/'+this.attr.item_id+'_s.jpg)',
			'backgroundSize': '100px 100px',
			'position' : 'absolute',
			'top' : this.attr.top +"%",
			'left' : this.attr.left +"%",
			'z-index' : this.zIndex,
			'width' : this.attr.width +"%",
			'height' : this.attr.height +"%",
			'opacity' : this.attr.opacity
		};
		
		this.visualEditorElement.addClass('media editable draggable')
			.attr({
				'id' : 'layer-preview-'+this.model.id,
				'data-layer-id' : this.model.id
			})
			.css(cssObj);
		
		var wrapper = $('<div>').css({'width':'100%','height':'100%'}).attr('id','layer-preview-wrapper-'+this.model.id);
		
		this.visualEditorElement.draggable({
			//when the image stops being dragged
			stop : function(){
				_this.updateAttr();
			}
		});
		
				
		this.visualEditorElement.bind( 'slide' , function(){
			
			var height = Math.floor($('#layer-edit-'+that.model.id).find('#Scale-slider').slider('value')*1.5/that.attr.dimension);
			$(this).css({
				'opacity': $('#layer-edit-'+that.model.id).find('#Opacity-slider').slider('value'),
				'width' : $('#layer-edit-'+that.model.id).find('#Scale-slider').slider('value')+'%',
				'height' : height+'%'
			});
			//console.log('height: '+height);
		});
		
		this.visualEditorElement.append(wrapper);
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
	
	onAttributeUpdate: function()
	{
	/*
		//get a copy of the old attributes into a variable
		var newAttr = this.attr;
		//set the new x/y coords into the attributes
		newAttr.x = this.dom.position().left/6.0;
		newAttr.y = this.dom.position().top/4.0;
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
		console.log(newAttr);
		this.updateLayerAttr(newAttr);
		//save the layer back to the database
		this.saveLayer();
	*/
	
	},
	exit: function(){
		
		this.player.pause();
	},
	
	
	
});
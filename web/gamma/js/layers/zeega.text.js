/************************************

	TEXT LAYER CHILD CLASS
	
        TODO: 
           Fix Aloha loading to work
           with require.js

************************************/

var TextLayer = ProtoLayer.extend({

	layerType : 'VISUAL',
	draggable : true,

	defaultAttributes: {
		type:'text',
		title:'Text Layer',
		content: '',
		x:0,
		y:0,
		h:'50%',
		w:'25%',
		color: {r:255,g:255,b:255,a:1},
		backgroundColor: {r:200,g:200,b:0,a:0},
		size: 26,
		columns: 1,
		padding:5,
		indent: 0
	},

	controls : function()
	{
		console.log( this.model.get('attr'));

		//font size
		var fontSizeArgs = {
			min : 8,
			max : 50,
			label : 'Font Size',
			step : 1,
			property : 'fontSize',
			suffix : 'px',
			value : this.model.get('attr').fontSize,
			dom : this.layerControls,
			css: true
			
		};
		var fontSizeSlider = makeUISlider( fontSizeArgs );
		
		//padding
		var paddingArgs = {
			max : 25,
			label : 'Padding',
			step : 1,
			property : 'padding',
			suffix : 'px',
			value : this.model.get('attr').padding,
			dom : this.layerControls,
			css: true
		};
		var paddingSlider = makeUISlider( paddingArgs );
		
		/*
		//indent
		var indentArgs = {
			max : 25,
			label : 'Indent',
			step : 1,
			property : 'textIndent',
			suffix : '%',
			value : this.model.get('attr').textIndent,
			dom : this.layerControls,
		};
		var indentSlider = makeUISlider( indentArgs );
		*/
		
		//color picker
		var colorPickerArgs = {
			label : 'Text Color',
			//update : function(){ _this.onAttributeUpdate() },
			property : 'color',
			id : this.model.id,
			color : this.attr.color,
			controls : this.layerControls,
			target : this.visualEditorElement
	    };
	    var fontColor = makeColorPicker(colorPickerArgs);
	
	
		//bg color picker
		var bgColorPickerArgs = {
			label : 'Background Color',
			property : 'backgroundColor',
			id : this.model.id,
			color : this.attr.backgroundColor,
			controls : this.layerControls,
			target : this.visualEditorElement
	    };
	    var bgColor = makeColorPicker( bgColorPickerArgs );

		
		this.layerControls
			.append( fontSizeSlider )
			.append( paddingSlider )
			//.append( indentSlider )
			.append( fontColor )
			.append( bgColor )
			.append( makeFullscreenButton( this.layerControls ) );

	},


	visual : function()
	{

		var _this = this;

		this.visualEditorElement.addClass('text-layer-chrome-visible');


		this.visualEditorElement.css({
			'opacity' : '100%',
			'height':this.attr.w,
			'width':this.attr.h,
			'font-size' : this.attr.fontSize +'px'
		})
		

		
		/*
		if (this.attr.content == ''){
		    div.addClass('text-layer-chrome-visible');
		}

		*/
		
		var mouseELmaster = function (event) {
		    _this.toggleFrameVis();
		}

		/* This bunch of stuff shows and hides the handle and outline, based on mouseover.
		   It's only this complicated because the mouse isn't constrained within the workspace while dragging the layer */
		//div.bind('mouseenter.tl_master mouseleave.tl_master', mouseELmaster);
		/*

		div.bind('mousedown', function(event){
			div.unbind('mouseenter.tl_master mouseleave.tl_master');
			$(document).one('mouseup.tl_temp', function (event){
				div.bind('mouseenter.tl_master mouseleave.tl_master', mouseELmaster);
				var div_pos = div.offset();
				if (event.pageX <= div_pos.left || event.pageX >= div_pos.left + div.width() || event.pageY <= div_pos.top || event.pageY >= div_pos.top + div.height()){
				    _this.toggleFrameVis();
				}
			    });
		    });

		   */ 

		this.visualEditorElement.resizable({
			stop : function (){
			    _this.onAttributeUpdate();
			},
			containment:'parent',
			minHeight: 50,
			minWidth: 50,
			autoHide: true
		});

		var content = $('<div />')
			.css({
				'width' : '100%', 
				'height' : '100%', 
				'overflow' : 'auto',
				'column-count' : this.attr.columns,
				'-moz-column-count' : this.attr.columns,
				'padding' : this.attr.padding + 'px',
				'text-indent': this.attr.indent + 'px',
				'box-sizing' : 'border-box',
				'-moz-box-sizing' : 'border-box',
				'-webkit-box-sizing' : 'border-box'
			})
			.addClass('text-layer-content')
			.html( _this.attr.content );

		content.bind('click mousedown', function(event) { event.stopPropagation() });
		content.bind('blur change', function(){ 
			var newContent = _this.visualEditorElement.find('.text-layer-content').html();
			_this.layerControls.trigger( 'update' , [{
				content : {
					property : 'content',
					value : '"'+ newContent +'"',
					css : false
				},
				title : {
					property : 'title',
					value : '"'+ newContent +'"',
					css : false
				}
			}]);
			
		});

		this.visualEditorElement.append( content );


		var rgbaColor = 'rgba('+this.attr.color.r+','+this.attr.color.g+','+this.attr.color.b+','+this.attr.color.a+')';
		var rgbaBGColor = 'rgba('+this.attr.backgroundColor.r+','+this.attr.backgroundColor.g+','+this.attr.backgroundColor.b+','+this.attr.backgroundColor.a+')';

		//Color and bgColor must be set after adding to the DOM - before, jquery automatically changes rgba colors to rgb
		this.visualEditorElement.css( 'color', rgbaColor );
		this.visualEditorElement.css( 'backgroundColor', rgbaBGColor );
		this.visualEditorElement[0].style.backgroundColor = rgbaBGColor;
		this.visualEditorElement.children('.text-layer-content')[0].style.WebkitColumnCount = this.attr.columns;
		this.visualEditorElement.children('.text-layer-content').aloha();
		
	},
	
	onAttributeUpdate : function()
	{
		
	},


	drawThumb : function()
	{
		var _this  = this;
		
		//make dom object
		//maybe these should all be wrapped in divs?
		var div = $('<div />');
		var cssObj = {
			'position' : 'absolute',
			'top' : this.attr.y+'%',
			'left' : this.attr.x+'%',
			'z-index' : this.zIndex,//layers.length - i,
			'width' : this.attr.w,
			'height' : this.attr.h,
			'font-size' : this.attr.size + 'px'
		};
		div.addClass('text-layer-container')
			.attr({
				'id' : 'layer-preview-'+this.model.id,
				'data-layer-id' : this.model.id,
			})
			.css(cssObj);

		div.addClass('text-layer-chrome-visible');
		
		/*
		if (this.attr.content == ''){
		    div.addClass('text-layer-chrome-visible');
		}
		
		*/

		var mouseELmaster = function (event)
		{
		    _this.toggleFrameVis();
		}

	
		var content = $('<div />').css({'width' : '100%', 
						'height' : '100%', 
		                                'overflow' : 'auto',
						'column-count' : this.attr.columns,
						'-moz-column-count' : this.attr.columns,
						'padding-top' : this.attr.padding + 'px',
						'padding-left' : this.attr.padding + 'px',
						'padding-right' : this.attr.padding + 'px',
						'padding-bottom' : this.attr.padding + 'px',
						'text-indent': this.attr.indent + 'px',
					        'box-sizing' : 'border-box',
						'-moz-box-sizing' : 'border-box',
						'-webkit-box-sizing' : 'border-box'
		                           })
		                          .addClass('text-layer-content');
		
		content.html(_this.attr.content);

		
		div.append(content);
		$('#preview-media').append(div);
		//draw to the workspace
		//$('#workspace').append(this.dom);
		//Color and bgColor must be set after adding to the DOM - before, jquery automatically changes rgba colors to rgb
		$('#layer-preview-'+this.model.id).children('.text-layer-content')[0].style.color = 'rgba(' + this.attr.color.join(',') + ')';
		$('#layer-preview-'+this.model.id)[0].style.backgroundColor = 'rgba(' + this.attr.bgColor.join(',') + ')';
		$('#layer-preview-'+this.model.id).children('.text-layer-content')[0].style.WebkitColumnCount = this.attr.columns;

	},

	preload : function()
	{
		
		//need this to be accessable inside various functions
		var _this  = this;

		console.log('preload media text');
		console.log(this.attr);
		var previewFontSize = this.attr.size/600 * window.innerWidth;
		var previewWidth = parseInt(parseFloat(this.attr.w)/6.0)+2;
		var previewHeight = parseInt(parseFloat(this.attr.h)/4.0)+6;
		var fontColor = 'rgba(' + this.attr.color.join(',') + ')';
		//make dom object
		//maybe these should all be wrapped in divs?
		var div = $('<div />');
		var cssObj = {
			'position' : 'absolute',
			'top' : '-100%',
			'left' : '-100%',
			'width' : previewWidth+'%',
			'height' : previewHeight+'%',
			'color' : fontColor,
			'font-size' : previewFontSize + 'px'
		};
		div.addClass('text-layer-container')
			.attr({
				'id' : 'layer-preview-'+this.model.id,
				'data-layer-id' : this.model.id,
			})
			.css(cssObj);

		/*
		if (this.attr.content == ''){
		    div.addClass('text-layer-chrome-visible');
		}

		UNTIL RESOLVED CHROME ALWAYS VISIBLE

		*/

 		div.addClass('text-layer-chrome-visible');

		div.draggable({

			//when the image stops being dragged
			stop : function(){ _this.updateAttr() },
			containment: 'parent'
		});

		div.resizable({
			stop : function (){ _this.updateAttr() },
			containment:'parent',
			minHeight: 50,
			minWidth: 50,
			autoHide: true
		});

		var content = $('<div />').css({
						'width' : '100%', 
						'height' : '100%', 
						'overflow' : 'auto',
						'column-count' : this.attr.columns,
						'-moz-column-count' : this.attr.columns,
						'padding-top' : this.attr.padding + 'px',
						'padding-left' : this.attr.padding + 'px',
						'padding-right' : this.attr.padding + 'px',
						'padding-bottom' : this.attr.padding + 'px',
						'text-indent': this.attr.indent + 'px',
		                           })
		                          .addClass('text-layer-content');

		content.html( _this.attr.content );

		div.append(content);
		this.dom = div;
		//draw to the workspace
		$('#zeega-player').find('#preview-media').append(this.dom);
		//Color and bgColor must be set after adding to the DOM - before, jquery automatically changes rgba colors to rgb
		$('#layer-preview-'+this.model.id).children('.text-layer-content')[0].style.color = 'rgba(' + this.attr.color.join(',') + ')';
		//$('#layer-preview-'+this.model.id).css('backgroundColor','rgba(' + this.attr.bgColor.join(',') + ')');
		$('#layer-preview-'+this.model.id).children('.text-layer-content')[0].style.WebkitColumnCount = this.attr.columns;
		$('#layer-preview-'+this.model.id).children('.text-layer-content').aloha();

		$('#zeega-player').find('#preview-media')
			.append(this.dom)
			.trigger('ready',{'id':this.model.id});
			
		
		
		
		
		
	},
	
	play : function( z )
	{
		//Color and bgColor must be set after adding to the DOM - before, jquery automatically changes rgba colors to rgb
		$('#layer-preview-'+this.model.id).children('.text-layer-content')[0].style.color = 'rgba(' + this.attr.color.join(',') + ')';
		$('#layer-preview-'+this.model.id).css('backgroundColor','rgba(' + this.attr.bgColor.join(',') + ')');
		$('#layer-preview-'+this.model.id).children('.text-layer-content')[0].style.WebkitColumnCount = this.attr.columns;
		
		
		this.dom.css({'z-index':z,'top':this.attr.y+"%",'left':this.attr.x+"%"});
	},
	
	pause : function()
	{
		// not needed
	},
	
	stash : function()
	{
		this.dom.css({'top':"-100%",'left':"-100%"});
	},
	


	
	////////////////////////
	

	toggleFrameVis : function ()
	{
		if (this.visualEditorElement.hasClass('text-layer-chrome-visible'))
		{
			this.visualEditorElement.removeClass('text-layer-chrome-visible');
		}else {
			this.visualEditorElement.addClass('text-layer-chrome-visible');
	    }
	},  
	
	
	/*
	
	// Necessary because slider functions in ux/layer-controls.js don't 
	// provide a means of specifying the element to be acted upon.
	// Really should be in layer-controls, or split up as multiple
	// more specific functions in same.
	makeCustomSlider : function (args)
	{
	    var sliderDiv = $('<div>').addClass('layer-slider-div')
			.append( $("<h4>").html(args.label) )
			.append( $('<div>').attr({
				'id': args.label+'-slider',
				'data-layer-id': args.layer_id
				})
			.addClass('layer-slider'));
	   
	    sliderDiv.find('.layer-slider').slider({
		min : args.min,
		max : args.max,
		value : args.value,
		step : args.step,
		slide: function(e, ui)
		{
			args.custom_handler(e,ui,args.layer_id);
		}
	});
	
	return sliderDiv;
	}
	*/
});

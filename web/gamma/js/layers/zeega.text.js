/************************************

	TEXT LAYER CHILD CLASS
	
        TODO: 
           Fix Aloha loading to work
           with require.js

************************************/

var TextLayer = ProtoLayer.extend({

	defaultAttributes: {
		type:'text',
		title:'Text Layer',
		content: '',
		x:0,
		y:0,
		h:100,
		w:400,
		color: Array(255,255,255,1),
		bgColor: Array(200,200,0,0),
		size: 26,
		columns: 1,
		padding:5,
		indent: 0
	},

	drawControls : function(template)
	{
	    var fontSizeArgs = {
		min: 8,
		max: 50,
		value: this.attr.size,
		step: 1,
		layer_id: this.model.id,
		label: 'Font Size',
		css: 'font-size',
		suffix: 'px'
	    };
	    template.find('#controls').append( makeCSSLayerSlider(fontSizeArgs) );

	    var paddingArgs = {
		min: 0,
		max: 25,
		value: this.attr.padding,
		step:1,
		layer_id: this.model.id,
		label: 'Padding',
		custom_handler: function(e, ui, layer_id){
		    $('#layer-preview-'+layer_id).children('.text-layer-content')
		        .css({'padding-left': ui.value + 'px',
			      'padding-right': ui.value + 'px',
			      'padding-top': ui.value + 'px',
			      'padding-bottom': ui.value + 'px',
			    });
		}
	    };
	    template.find('#controls').append( this.makeCustomSlider(paddingArgs) );
	    
	    var indentArgs = {
		min: 0,
	        max: 100,
		value: this.attr.indent,
		step: 1,
		layer_id: this.model.id,
		label: 'Indentation',
		custom_handler: function (e,ui, layer_id){
		    $('#layer-preview-'+layer_id).children('.text-layer-content').css({'text-indent': ui.value+'px'});
		}
	    };
	    template.find('#controls').append( this.makeCustomSlider(indentArgs));

	    var textOpacityArgs = {
		    min:0,
		    max:1,
		    value:this.attr.color[3],
		    step:0.01,
		    layer_id:this.model.id,
		    label:'Text Opacity',
		    custom_handler: function (e, ui, layer_id){
		                    var content = $('#layer-preview-'+layer_id).children('.text-layer-content');
		                    var currentColor = content[0].style.color.replace(/[rgba()\s]/g,'').split(',');
		                    currentColor[3] = ui.value;
				    content[0].style.color = 'rgba('+currentColor.join(',')+')';
		    }   
	    };
	    template.find('#controls').append( this.makeCustomSlider(textOpacityArgs) );

	    var bgOpacityArgs = {
		    min:0,
		    max:1,
		    value:this.attr.bgColor[3],
		    step:0.01,
		    layer_id:this.model.id,
		    label:'Background Opacity',
		    custom_handler: function (e, ui, layer_id){
				var content = $('#layer-preview-'+layer_id);
				var currentBgColor = content[0].style.backgroundColor.replace(/[rgba()\s]/g,'').split(',');
				currentBgColor[3] = ui.value;
				console.log(ui.value);
				content[0].style.backgroundColor = 'rgba('+currentBgColor.join(',')+')';
			}   
		};
	    template.find('#controls').append( this.makeCustomSlider(bgOpacityArgs) );
	
	    //need this to be accessable inside the various functions
	    var _this  = this;
	    
	    var colorPickerArgs = {
		'layer_id' : this.model.id,
		'color' : {'r' : this.attr.color[0],
			   'g' : this.attr.color[1],
			   'b' : this.attr.color[2]
		          },
		'label' : 'Text Color',
		'_this' : this,
		'custom_handler' : function(rgb, layer_id){
		    var content = $('#layer-preview-'+layer_id).children('.text-layer-content');
		    var currentColor = content[0].style.color.replace(/[rgba()\s]/g,'').split(',');
		    if (currentColor.length == 3){
			currentColor[3] = 1;
		    }
		    currentColor[0] = rgb.r;
		    currentColor[1] = rgb.g;
		    currentColor[2] = rgb.b;
		    content[0].style.color = 'rgba('+currentColor.join(',')+')';
		}
	    };
	    template.find('#controls').append( makeColorPicker(colorPickerArgs));

	    var bgColorPickerArgs = {
		'layer_id' : this.model.id,
		'color' : {'r' : this.attr.bgColor[0],
			   'g' : this.attr.bgColor[1],
			   'b' : this.attr.bgColor[2]
		          },
		'label' : 'Background Color',
		'_this' : this,
		'custom_handler' : function(rgb, layer_id){
		    var content = $('#layer-preview-'+layer_id);
		    var currentColor = content[0].style.backgroundColor.replace(/[rgba()\s]/g,'').split(',');
		    if (currentColor.length == 3) currentColor[3] = 1;

			currentColor[0] = rgb.r;
			currentColor[1] = rgb.g;
			currentColor[2] = rgb.b;
		
			$(content[0]).css('backgroundColor', 'rgba('+currentColor.join(',')+')');
			//content[0].style.backgroundColor = 'rgba('+currentColor.join(',')+')';
		}
	    };
	    template.find('#controls').append( makeColorPicker(bgColorPickerArgs));

	    var columnsArgs = { min: 1,
				max: 3,
				value: this.attr.columns,
				step: 1,
				layer_id: this.model.id,
				label: 'Number of Columns',
				custom_handler: function (e, ui, layer_id){
		                    console.log('Columns in handler: ' + ui.value);
				    $('#layer-preview-'+layer_id).children('.text-layer-content')[0].style.WebkitColumnCount = ui.value;
		                    $('#layer-preview-'+layer_id).children('.text-layer-content')
				                                 .css({ 'column-count' : ui.value,
									'-moz-column-count' : ui.value});
		                }
	    };
	    template.find('#controls').append( this.makeCustomSlider(columnsArgs));	    				
	    template.find('#controls').find('.layer-slider').bind( "slidestop", function(event, ui) {
		    _this.updateAttr();
		});
	    
	    //change icon on layer template
	    template.find('.asset-type-icon').removeClass('ui-icon-pin-w');
	    template.find('.asset-type-icon').addClass('ui-icon-pencil');
	},
	
	openControls : function(){},
	
	closeControls : function(){},
	
	drawPreview : function(){
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

		//need this to be accessable inside various functions
		var _this  = this;
		
		
		
		
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
		    
		div.draggable({
			
			//when the image stops being dragged
			stop : function(){
				_this.updateAttr();
			},
			containment: 'parent'
			});
		div.resizable({
			stop : function (){
			    _this.updateAttr();
			},
		        containment:'parent',
		        minHeight: 50,
			minWidth: 50,
			autoHide: true
		});
		
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

		content.bind('click mousedown', function(event) { event.stopPropagation()});
		content.bind('blur change', function(){_this.updateAttr()});
		
		div.append(content);
		this.dom = div;
		//draw to the workspace
		$('#workspace').append(this.dom);
		//Color and bgColor must be set after adding to the DOM - before, jquery automatically changes rgba colors to rgb
		$('#layer-preview-'+this.model.id).children('.text-layer-content')[0].style.color = 'rgba(' + this.attr.color.join(',') + ')';
		$('#layer-preview-'+this.model.id)[0].style.backgroundColor = 'rgba(' + this.attr.bgColor.join(',') + ')';
		$('#layer-preview-'+this.model.id).children('.text-layer-content')[0].style.WebkitColumnCount = this.attr.columns;
		$('#layer-preview-'+this.model.id).children('.text-layer-content').aloha();
		
        },


drawThumb : function(){
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

		//need this to be accessable inside various functions
		var _this  = this;
		
		
		
		
		var mouseELmaster = function (event) {
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
		this.dom = div;
		//draw to the workspace
		$('#workspace').append(this.dom);
		//Color and bgColor must be set after adding to the DOM - before, jquery automatically changes rgba colors to rgb
		$('#layer-preview-'+this.model.id).children('.text-layer-content')[0].style.color = 'rgba(' + this.attr.color.join(',') + ')';
		$('#layer-preview-'+this.model.id)[0].style.backgroundColor = 'rgba(' + this.attr.bgColor.join(',') + ')';
		$('#layer-preview-'+this.model.id).children('.text-layer-content')[0].style.WebkitColumnCount = this.attr.columns;
		$('#layer-preview-'+this.model.id).children('.text-layer-content').aloha();
		
        },

	preloadMedia : function()
	{
		//need this to be accessable inside various functions
		var _this  = this;
		
		console.log('preload media text');
		console.log(this.attr);
		var previewFontSize = this.attr.size/600 * window.innerWidth;
		var previewWidth = this.attr.w/600 * window.innerWidth;
		var previewHeight = this.attr.h/400 * window.innerHeight
		var fontColor = 'rgba(' + this.attr.color.join(',') + ')';
		//make dom object
		//maybe these should all be wrapped in divs?
		var div = $('<div />');
		var cssObj = {
			'position' : 'absolute',
			'top' : '-100%',
			'left' : '-100%',
			'width' : previewWidth,
			'height' : previewHeight,
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
						'box-sizing' : 'border-box',
						'-moz-box-sizing' : 'border-box',
						'-webkit-box-sizing' : 'border-box'
		                           })
		                          .addClass('text-layer-content');
		
		content.html( _this.attr.content );

		content.bind('click mousedown', function(event) { event.stopPropagation()});

		content.bind('blur change', function(){ _this.updateAttr() });

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

    drawPublish : function(z)
	{
		this.dom.css({'z-index':z,'top':this.attr.y+"%",'left':this.attr.x+"%"});
	},

	hidePublish : function()
	{
		this.dom.css({'top':"-100%",'left':"-100%"});
	},
	
	
	updateAttr: function()
	{
	 
		//get a copy of the old attributes into a variable
		var newAttr = this.attr;
		//Without a title, layers display wrongly and are undeletable.
		if (!newAttr.title) {
		    newAttr.title = "Untitled Layer";
		}
		//set the new x/y coords into the attributes
		newAttr.x = Math.floor( this.dom.position().left/6);
		newAttr.y = Math.floor( this.dom.position().top/4);
		newAttr.w = this.dom.css('width');
		newAttr.h = this.dom.css('height');
		
		console.log('$$$$$$$$$$$$$$$$$$');
		console.log(newAttr);
		
		console.log(newAttr);
		var contentPanel = this.dom.children('.text-layer-content');
		newAttr.content = contentPanel.html();
		//Clean up broken html left behind by Aloha on empty elements
		if (newAttr.content == '<br>'){
		    newAttr.content = '';
		}
		console.log(newAttr.content);
		
		//update layer title
		
		newAttr.title =newAttr.content.substr(0,60);
		$('#layer-edit-'+this.model.id).find('.layer-title').html(newAttr.title );
		
		/*
		
		//Ensures _this empty text-boxes have visible borders
		if (newAttr.content.match(/\S/)){
		    console.log('removeClass');
		    this.dom.removeClass('text-layer-chrome-visible');
		}
		else {
		    console.log('addClass');
		    this.dom.addClass('text-layer-chrome-visible');
		}
		
		
		*/
		
		// Note: These if statements protect (x,x,x,1) from conversion to plain rgb 
		var newColor = contentPanel[0].style.color.replace(/[rgba()\s]/g,'').split(',');
		if (newColor.length == 3){
		    newColor[3] = 1;
		}
		newAttr.color = newColor;

		var newBgColor = this.dom[0].style.backgroundColor.replace(/[rgba()\s]/g,'').split(',');
		if (newBgColor.length == 3){
		    newBgColor[3] = 1;
		}
		newAttr.bgColor = newBgColor;
		newAttr.size = contentPanel.css('font-size').replace(/px/, '');
		newAttr.padding = contentPanel.css('padding-top').replace(/px/, '');
		console.log(contentPanel.css('text-indent').replace(/em/, ''));
		newAttr.indent = contentPanel.css('text-indent').replace(/px/, '');
		if (contentPanel.css('column-count')){
		    newAttr.columns = contentPanel.css('column-count');
		}else if (contentPanel[0].style.WebkitColumnCount){
		    newAttr.columns = contentPanel[0].style.WebkitColumnCount;
		}
		else if (contentPanel.css('-moz-column-count'))
		{
		    newAttr.columns = contentPanel.css('-moz-column-count');
		}else {
		    newAttr.columns = 1;
		}
		//set the attributes into the layer
		this.updateLayerAttr(newAttr);
		//save the layer back to the database
		this.saveLayer();	
	},
	
	toggleFrameVis : function ()
	{
		if (this.dom.hasClass('text-layer-chrome-visible'))
		{
			this.dom.removeClass('text-layer-chrome-visible');
		}else {
			this.dom.addClass('text-layer-chrome-visible');
	    }
	},  
	
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
});

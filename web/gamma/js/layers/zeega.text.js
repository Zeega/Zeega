/************************************

	TEXT LAYER CHILD CLASS
	
        TODO: 
           Fix Aloha loading to work
           with require.js

************************************/

var TextLayer = ProtoLayer.extend({

	layerType : 'visual',
	draggable : true,

	defaultAttributes: {
		type:'text',
		title:'Text Layer',
		content: '',
		x:0,
		y:0,
		h:'50%',
		w:'25%',
		color: Array(255,255,255,1),
		backgroundColor: Array(200,200,0,0),
		size: 26,
		columns: 1,
		padding:5,
		indent: 0
	},

	drawControls : function()
	{
		var _this  = this;
		var controls = $('<div>');

		controls.bind('updateAttribute', function(e){
			console.log('updating');
			console.log(e);
		})


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
	    controls.append( makeCSSLayerSlider(fontSizeArgs) );


/*
		var fontSizeArgs = {
			min: 8,
			max: 50,
			value: this.attr.size,
			id: this.model.id,
			label: 'Font Size',
			property: 'font-size',
			suffix: 'px',
			dom : controls;
	    };
		controls.append( makeUISlider( fontSizeArgs );

		controls.bind('update', function(){
			
		})
*/


	    var paddingArgs = {
			min: 0,
			max: 25,
			value: this.attr.padding,
			step:1,
			layer_id: this.model.id,
			label: 'Padding',
			custom_handler: function(e, ui, layer_id)
			{
				$('#layer-preview-'+layer_id).children('.text-layer-content')
					.css({
						'padding-left': ui.value + 'px',
						'padding-right': ui.value + 'px',
						'padding-top': ui.value + 'px',
						'padding-bottom': ui.value + 'px',
					});
			}
	    };
	    controls.append( this.makeCustomSlider(paddingArgs) );




		var indentArgs = {
			min: 0,
			max: 100,
			value: this.attr.indent,
			step: 1,
			layer_id: this.model.id,
			label: 'Indentation',
			custom_handler: function (e,ui, layer_id)
			{
				$('#layer-preview-'+layer_id)
					.children('.text-layer-content')
					.css({'text-indent': ui.value+'px'});
			}
		};
		controls.append( this.makeCustomSlider(indentArgs));

		var colorPickerArgs = {
			label : 'Text Color',
			update : function(){ _this.onAttributeUpdate() },
			property : 'color',
			id : this.model.id,
			color : {
				r : this.attr.color[0],
				g : this.attr.color[1],
				b : this.attr.color[2],
				a : this.attr.color[3]
			},
			dom : this.visualEditorElement
	    };
	    controls.append( makeColorPicker(colorPickerArgs));
	
		var bgColorPickerArgs = {
			label : 'Background Color',
			update : function(){ _this.onAttributeUpdate() },
			property : 'backgroundColor',
			id : this.model.id,
			color : {
				r : this.attr.backgroundColor[0],
				g : this.attr.backgroundColor[1],
				b : this.attr.backgroundColor[2],
				a : this.attr.backgroundColor[3]
			},
			dom : this.visualEditorElement
	    };
	    controls.append( makeColorPicker( bgColorPickerArgs ) );

	    controls.find('.layer-slider').bind( "slidestop", function(event, ui) {
		    _this.onAttributeUpdate();
		});

		this.layerControls = controls;
		return(controls);
	},


	drawToVisualEditor : function()
	{
		var _this = this;
		var el = $('<div>');

		el.addClass('text-layer-chrome-visible');

console.log(this.attr.size);

		el.css({
			'height':this.attr.w,
			'width':this.attr.h,
			'font-size' : this.attr.size +'px'
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

		el.resizable({
			stop : function (){
			    _this.onAttributeUpdate();
			},
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
		content.bind('blur change', function(){_this.onAttributeUpdate()});

		el.append( content );

		//Color and bgColor must be set after adding to the DOM - before, jquery automatically changes rgba colors to rgb
		el.css( 'color', 'rgba(' + this.attr.color.join(',') + ')' );
		
		el[0].style.backgroundColor = 'rgba(' + this.attr.backgroundColor.join(',') + ')';
		el.children('.text-layer-content')[0].style.WebkitColumnCount = this.attr.columns;
		el.children('.text-layer-content').aloha();
		
/////				
		//add to dom
		this.visualEditorElement = el;
		return( el );
	
	},
	
	onAttributeUpdate : function()
	{
		console.log('text onAttributeUpdate');
		var _this = this;
		
		var newAttr = {};
		//Without a title, layers display wrongly and are undeletable.
		if (!newAttr.title) newAttr.title = "Untitled Layer";

		//set the new x/y coords into the attributes
		newAttr.x = Math.floor( this.visualEditorElement.position().left/6);
		newAttr.y = Math.floor( this.visualEditorElement.position().top/4);
		newAttr.w = this.visualEditorElement.css('width');
		newAttr.h = this.visualEditorElement.css('height');
	

		var contentPanel = _this.visualEditorElement.children('.text-layer-content');
		newAttr.content = contentPanel.html();
		//Clean up broken html left behind by Aloha on empty elements
		if (newAttr.content == '<br>') newAttr.content = '';
		
		//update layer title
		newAttr.title = newAttr.content.substr(0,60);
		_this.visualEditorElement.find('.layer-title').html(newAttr.title );
	
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
	
		var colorPickers = this.layerControls.find('.color-window');
		_.each( colorPickers, function( picker ){
			var colorObj = [];
			_.each( $(picker).children('input') , function(input){
				colorObj.push( $(input).val() );
//				eval( 'colorObj.' + $(input).attr('id') + '=' + $(input).val() );
			});
			eval( 'newAttr.' + $(picker).data().info.property + '= colorObj ');
		})
		
		/*console.log(newAttr);
	
		// Note: These if statements protect (x,x,x,1) from conversion to plain rgb 
		var newColor = $(contentPanel[0]).css('color').replace(/[rgba()\s]/g,'').split(',');
		if (newColor.length == 3) newColor[3] = 1;
		newAttr.color = newColor;

		var newBgColor = $(contentPanel[0]).css('background-color').replace(/[rgba()\s]/g,'').split(',');
		if (newBgColor.length == 3) newBgColor[3] = 1;

		newAttr.bgColor = newBgColor;
		*/
		
		newAttr.size = contentPanel.css('font-size').replace(/px/, '');
		newAttr.padding = contentPanel.css('padding-top').replace(/px/, '');
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
		
		_this.setAttributes(newAttr);
		_this.save();
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

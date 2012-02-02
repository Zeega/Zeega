/************************************

	TEXT LAYER CHILD CLASS
	
        TODO: 
           Fix Aloha loading to work
           with require.js

************************************/

var TextLayer = ProtoLayer.extend({

	layerType : 'VISUAL',
	draggable : true,
	linkable : true,

	defaultAttributes: {
		type:'text',
		title:'Text Layer',
		content: '',
		left:0,
		top:0,
		height:'200',
		width:'400',
		color: {r:255,g:255,b:255,a:1},
		backgroundColor: {r:0,g:0,b:0,a:0.5},
		fontSize: 26,
		columns: 1,
		padding:5,
		indent: 0
	},

	controls : function()
	{

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
			.append( bgColor );

	},
	
	visual : function()
	{

		var _this = this;

		this.visualEditorElement.addClass('text-layer-chrome-visible');

		var rgbaColor = 'rgba('+this.attr.color.r+','+this.attr.color.g+','+this.attr.color.b+','+this.attr.color.a+')';
		var rgbaBGColor = 'rgba('+this.attr.backgroundColor.r+','+this.attr.backgroundColor.g+','+this.attr.backgroundColor.b+','+this.attr.backgroundColor.a+')';

		this.visualEditorElement.css({
			'color' : rgbaColor,
			'backgroundColor' : rgbaBGColor,
			'height' : this.attr.height +'px',
			'width' : this.attr.width +'px',
			'font-size' : this.attr.fontSize +'px',
			'padding' : this.attr.padding + 'px',
		})
		
		var content = $('<div />')
			.css({
				'color' : 'inherit',
				'width' : '100%', 
				'height' : '100%', 
				'overflow' : 'auto',
				'column-count' : this.attr.columns,
				'-moz-column-count' : this.attr.columns,
				'text-indent': this.attr.indent + 'px',
				'box-sizing' : 'border-box',
				'-moz-box-sizing' : 'border-box',
				'-webkit-box-sizing' : 'border-box'
			})
			.addClass('text-layer-content')
			.html( _this.attr.content );

		this.visualEditorElement.append( content );

		
	},
	
	onControlsOpen : function()
	{
	},
	
	onDomPlacement : function()
	{
		//console.log('onDomPlacement')
		var _this = this;
		var content = this.visualEditorElement.find('.text-layer-content');
		// make the text resizable
		this.visualEditorElement.resizable({
			stop : function (){
				
				console.log( $(this).width() +':'+ $(this).height());
				
			    _this.layerControls.trigger( 'update' , [{
					height : {
						property : 'height',
						value : $(this).height(),
						css : false
					},
					width : {
						property : 'width',
						value : $(this).width(),
						css : false
					}
				}]);
				
			},
			containment:'parent',
			minHeight: 50,
			minWidth: 50,
			autoHide: true
		});

		
		// set the text content to save
		content.bind('click mousedown', function(event) { event.stopPropagation() });
		_this.visualEditorElement.find('.text-layer-content').bind('blur change', function(){ 
			console.log('onblur')
			var newContent = _this.visualEditorElement.find('.text-layer-content').html();
			_this.layerControls.trigger( 'update' , [{
				content : {
					property : 'content',
					value : newContent,
					css : false
				},
				title : {
					property : 'title',
					value : newContent,
					css : false
				}
			}]);
			
		});

		//this.visualEditorElement.children('.text-layer-content')[0].style.WebkitColumnCount = this.attr.columns;
		//console.log('text layer alohad')
		Aloha.jQuery(content).aloha();
		
		
	},
	
	thumb : function()
	{
		var container = $('<div>');
		var cssObj = {
			'font-size' : this.attr.size + 'px'
		};
		container.addClass('text-layer-container')
			.attr({
				'id' : 'layer-preview-'+this.model.id,
				'data-layer-id' : this.model.id,
			})
			.css(cssObj);
	
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
		
		content.html( this.attr.content );

		
		container.append(content);
		this.thumbnail.append( container );
	},

	preload : function( target )
	{
		
		//need this to be accessable inside various functions
		var _this  = this;

		var workspaceWidth = 704; // this should be editable depending on the workspace ratio
		var previewFontSize = this.attr.fontSize / workspaceWidth  * window.innerWidth;
		var previewWidth = parseInt( parseFloat( this.attr.width ) / 6.0 ) + 2;
		var previewHeight = parseInt( parseFloat( this.attr.height ) / 4.0 ) + 6;
		
		var rgbaColor = 'rgba('+this.attr.color.r+','+this.attr.color.g+','+this.attr.color.b+','+this.attr.color.a+')';
		var rgbaBGColor = 'rgba('+this.attr.backgroundColor.r+','+this.attr.backgroundColor.g+','+this.attr.backgroundColor.b+','+this.attr.backgroundColor.a+')';

		var cssObj = {
			'position' : 'absolute',
			'color' : rgbaColor,
			'backgroundColor' : rgbaBGColor,
			'height' : previewHeight +'%',
			'width' : previewWidth +'%',
			'font-size' : previewFontSize +'px',
			'padding' : this.attr.padding + 'px',
			'top' : '-1000%',
			'left' : '-1000%'
		};
		
		var content = $('<div />')
			.css({
				'color' : 'inherit',
				'width' : '100%', 
				'height' : '100%', 
				'overflow' : 'auto',
				'column-count' : this.attr.columns,
				'-moz-column-count' : this.attr.columns,
				'text-indent': this.attr.indent + 'px',

			})
			.addClass( 'text-layer-content' )
			.html( this.attr.content );

		this.display
			.css( cssObj )
			.append( content );

		//this.visualEditorElement.children('.text-layer-content')[0].style.WebkitColumnCount = this.attr.columns;

		target.trigger( 'ready' , { 'id' : this.model.id } );

	},
	
	play : function( z )
	{
		this.display.css({'z-index':z,'top':this.attr.top+"%",'left':this.attr.left+"%"});
	},
	
	stash : function()
	{
		this.display.css({'top':"-1000%",'left':"-1000%"});
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
	

});

(function(Layer){

	Layer.Views.VisualEditor = Backbone.View.extend({
		
		tagName : 'div',

		initialize : function()
		{
			this.model.on('destroy', this.remove, this );
			this.model.on( 'change:visibleineditor', this.showHide, this );
		},

		//draws the controls
		render : function(i)
		{
			var _this = this;

			this.model.set({visibleineditor:true});
			//remove this view when the model is removed
			this.model.bind('remove',function(){ _this.remove() });

			//set the view element to whatever the layerclass returns for the visual editor
			//$(this.el).append( this.model.layerClass.drawToVisualEditor() );

			this.el = this.model.layerClass.drawToVisualEditor();

			if(this.model.layerClass.draggable)
			{
				$(this.el).draggable({
					stop : function(){
						var pos = $(this).position();

						var parentWidth = $(this).parent().css('width').replace(/px/,'');
						var parentHeight = $(this).parent().css('height').replace(/px/,'');

						var left = ( pos.left / parentWidth ) * 100;
						var top = ( pos.top / parentHeight ) * 100;

						var settings = [{
							left: {property:'left',value:left,suffix:'%'},
							top: {property:'top',value:top,suffix:'%'}
							}]

						_this.model.layerClass.layerControls.trigger('update',settings);
					}
				});
			}

			$(this.el).addClass('media')
				.attr({
					'id' : 'layer-preview-'+ _this.model.id,
					'data-layer-id' : _this.model.id
				});

			var cssObj = {
				'position' : 'absolute',
				'top' : _this.model.get('attr').top  +'%',
				'left' : _this.model.get('attr').left  +'%',
				'width' : _this.model.get('attr').w+'%',
				'opacity' : _this.model.get('attr').opacity
			};

			$(this.el).css(cssObj);

			this.model.layerClass.setZIndex( i );

			this.model.layerClass.onDomPlacement();

			//return the view
			return this;
		},

		showHide : function()
		{
			if( this.model.get('visibleineditor') ) $(this.el).fadeIn('fast');
			else $(this.el).fadeOut('fast');
		},
		
		remove : function(){ $(this.el).remove() }

	});


})(zeega.module("layer"));

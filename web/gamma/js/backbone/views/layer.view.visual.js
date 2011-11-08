var LayerVisualEditorView = Backbone.View.extend({	
		
	initialize : function(options)
	{
		this.model.bind( 'change', function(){
			console.log('layer change!!');
		});
	},
	
	//draws the controls
	render : function()
	{
		console.log(this);
		
		var _this = this;
		//remove this view when the model is removed
		this.model.bind('remove',function(){ _this.remove() });
				
		//set the view element to whatever the layerclass returns for the visual editor
		this.el = this.model.layerClass.editor.visual.draw();
		
		if(this.model.layerClass.draggable)
		{
			
			$(this.el).draggable({
				stop : function(){
					_this.model.layerClass.editor.onAttributeUpdate();
				}
			});
			
		}

		this.el.addClass('media')
			.attr({
				'id' : 'layer-preview-'+ _this.model.id,
				'data-layer-id' : _this.model.id
			});
			
			
		var cssObj = {
			'position' : 'absolute',
			'top' : _this.model.get('attr').y  +'%',
			'left' : _this.model.get('attr').x  +'%',
			'z-index' : _this.model.layerClass.zIndex,
			'width' : _this.model.get('attr').w+'%',
			'opacity' : _this.model.get('attr').opacity
		};

		this.el.css(cssObj);
		
		
		//set the z-index of the layer
		var layerOrder = _.compact( Zeega.currentNode.get('layers') );
		this.model.layerClass.util.setZIndex( _.indexOf(layerOrder, this.model.id) );
		
		//put the view element into the workspace
		$('#visual-editor-workspace').append($(this.el));
		
		//return the view
		return this;
	}
});

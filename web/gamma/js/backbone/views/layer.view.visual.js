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
		var _this = this;
		//remove this view when the model is removed
		this.model.bind('remove',function(){ _this.remove() });
				
		//set the view element to whatever the layerclass returns for the visual editor
		$(this.el).append( this.model.layerClass.drawPreview() );
		
		//set the z-index of the layer
		var layerOrder = _.compact( Zeega.currentNode.get('layers') );
		this.model.layerClass.updateZIndex( _.indexOf(layerOrder, this.model.id) );
		
		//put the view element into the workspace
		$('#visual-editor-workspace').append($(this.el));
		
		//return the view
		return this;
	}
});

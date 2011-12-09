/***

 the visual layer collection draws to both the layer list and to the editor window

***/

var VisualLayerViewCollection = Backbone.View.extend({

	initialize : function( options )
	{
		var _this = this;

		this.editorViewCollection = new VisualLayerEditorViewCollection({ collection : this.collection });
		this.listViewCollection = new VisualLayerListViewCollection({ collection : this.collection });

		this.collection.bind('reset', function(layer){ _this.reset() });
	},
	
	reset : function()
	{
		this.editorViewCollection.render();
		this.listViewCollection.render();
	}
	
});


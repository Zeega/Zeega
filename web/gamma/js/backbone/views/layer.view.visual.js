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
	},
	
	getTemplate : function()
	{
		var layerTemplate = '<div id="<%= id %>" class="layer-list clearfix">';
		layerTemplate += 		'<div class="layer-uber-bar clearfix">';
		layerTemplate += 			'<div class="layer-icon">';
		layerTemplate += 				'<span class="asset-type-icon ui-icon ui-icon-pin-w"></span>';
		layerTemplate += 			'</div>';
		layerTemplate += 		'<div class="layer-title"><%= layerName %></div>';
		layerTemplate += 		'<div class="layer-uber-controls">';
		layerTemplate += 			'<span class="delete-layer ui-icon ui-icon-trash"></span>';
		layerTemplate += 		'</div>';
		layerTemplate += 		'<div class="layer-drag-handle">';
		layerTemplate += 			'<span class="ui-icon ui-icon-grip-solid-horizontal"></span>';
		layerTemplate += 		'</div>';
		layerTemplate += 	'</div>';
		layerTemplate += 	'<div class="hidden layer-content clearfix">';
		layerTemplate += 		'<div id="controls"></div>';
		layerTemplate += 		'<br />';
		layerTemplate += 		'<form id="layer-persist">';
		layerTemplate += 			'<input id="persist" type="checkbox" name="vehicle" value="persist" <%= persist %> /> <label for="persist">Persist layer to route</label>';
		layerTemplate += 		'</form>';
		layerTemplate += 	'</div>';
		layerTemplate += '</div>';
		
		return layerTemplate;
	}
	
});


/***

 the visual layer collection draws to both the layer list and to the editor window

***/

var VisualLayerViewCollection = Backbone.View.extend({



	initialize : function()
	{
		
		//this.editorViewCollection = new VisualLayerEditorViewCollection;
		//this.listViewCollection = new VisualLayerListViewCollection;
		
		/*
		_(this).bindAll('add', 'remove');

		this.collection.each(this.add);
		this.collection.bind('add',this.add);
		this.collection.bind('remove',this.remove);
		this.collection.bind('destroy', this.remove);
		*/
	},
	
	//only happens once at the start
	loadCollection : function( collection )
	{
		var _this = this;
		//set the collection
		this.collection = collection;

		this.editorViewCollection = new VisualLayerEditorViewCollection({ collection : this.collection });
		this.listViewCollection = new VisualLayerListViewCollection({ collection : this.collection });
		//this.editorViewCollection.collection = collection;
		//this.listViewCollection.collection = collection;
		
		this.editorViewCollection.render();
		this.listViewCollection.render();
		
		/*
		this.collection.bind("add", function(layer) {
			// should draw the layer if it's in the node
			//this.add(layer);
		});
		*/
		//this.collection.bind('add',this.add);
		//this.collection.bind('reset',this.reset);
		
		this.collection.bind('reset', function(layer) {
			_this.reset();
		});
		
		/*
		//this.collection.each(this.add);
		this.collection.bind('remove',this.remove);
		this.collection.bind('destroy', this.remove);
		*/
		
		//explicitly set these because we know what they will be ahead of time
		//this.editorViewCollection.collection = this.collection;
		//this.listViewCollection.collection = this.collection;
		
	},
		
	reset : function()
	{
		console.log('RESET collection');
		this.editorViewCollection.render();
		this.listViewCollection.render();
	},
	
	remove : function(layer)
	{
		console.log('rmvCollection')
		
		var viewToRemove = this; // _(this._layerViews.select(function(lv){return lv.model === model;}))[0];
		this._layerViews = _(this._layerViews).without(viewToRemove);
		
		Zeega.currentNode.noteChange();
		
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





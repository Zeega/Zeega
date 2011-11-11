/***

 the visual layer collection draws to both the layer list and to the editor window

***/

var VisualLayerViewCollection = Backbone.View.extend({



	initialize : function()
	{
		this._listViews = [];
		this._editorViews = [];
		
		/*
		_(this).bindAll('add', 'remove');
		this._layerViews = [];
		*/
		/*
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
		
		//explicitly set these because we know what they will be ahead of time
		this.editorViewCollection = new VisualLayerEditorViewCollection({collection:this.collection});
		this.listViewCollection = new VisualLayerListViewCollection({collection:this.collection});
		
	},
	
	add : function ( layer )
	{
		//make and store the various views
		//LIST
		
		//VISUAL EDITOR
		
		
		console.log(layer);
	},
	
	remove : function(layer)
	{
		console.log('rmvCollection')
		
		var viewToRemove = this; // _(this._layerViews.select(function(lv){return lv.model === model;}))[0];
		this._layerViews = _(this._layerViews).without(viewToRemove);
		
		Zeega.currentNode.noteChange();
		
	},
	
	
	render : function()
	{
		this._rendered = true;
		var _this = this;
		
		//clear out any old stuff inside this.el
		$(this.el).empty();
		//add EACH model's view to the _this.el and render it
		_.each(this._layerViews, function(layer){ $(_this.el).prepend(layer.render().el) });
		
		return this;
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





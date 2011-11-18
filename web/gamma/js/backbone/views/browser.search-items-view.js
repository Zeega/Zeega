//presents results of a search
var BrowserSearchItemsView = Backbone.View.extend({
	
	
	initialize : function() {},
	
	render: function()
	{
		var itemCount = 20;
		for (var i=0;i<itemCount;i++){
			var item = new Item();
			var itemView = new BrowserSearchItemView({model: item});
			itemView.render();
		}
		//draw the search items
		return this;
	},
	
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
	
	
});


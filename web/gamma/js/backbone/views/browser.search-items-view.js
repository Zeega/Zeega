//presents results of a search
var BrowserSearchItemsView = Backbone.View.extend({
	
	// ??? tagName: 'browser-results',

	initialize : function() {
		
		this.model.bind('change', this.render, this);
    	this.model.bind('destroy', this.remove, this);
	},
	
	render: function()
	{
		//Show results drawer's loading spinner
		$('#browser-results .browser-loading').show();
		
		var results = this.model.get("resultSet");
		
		for (var i=0;i<results;i++){
			var item = results[i];
			var itemView = new BrowserSearchItemView({model: item});
			itemView.render();
		}
		//Show more results link (TODO: only if search yields more than 100)
		$('#browser-show-more-results').show();

		//Hide results drawer's loading spinner
		$('#browser-results .browser-loading').hide();
		
		return this;
	},
	
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
	
	
});


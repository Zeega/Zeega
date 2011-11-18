//renders individual items in a search be they collection or item type
var BrowserSearchItemView = Backbone.View.extend({
	
	
	initialize : function() {
		
		//draw the item for the first time
		var template = $("#browser-results-item-template").clone();
		template.addClass('browser-results-item');
		template.removeAttr('id');
		template.insertAfter($("#browser-toggle-items-vs-collections"));
	},
	
	render: function()
	{
		
		

		return this;
	},
	
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
	
});


//renders individual items in a search be they collection or image or audio or video type
var BrowserSearchItemView = Backbone.View.extend({
	
	
	initialize : function() {
		
		//listens for changes to its model, re-rendering
		this.model.bind('change', this.render, this);
    	this.model.bind('destroy', this.remove, this);
		
	},
	
	render: function()
	{
		
		switch (this.model.get("itemType"))
		{
			case 'collection':
				var template = $("#browser-results-collection-template").clone();
				template.addClass('browser-results-collection');
				template.removeAttr('id');
				$('#browser-results-collections').append(template);
			break;

			case 'image':
				var template = $("#browser-results-image-template").clone();
				template.addClass('browser-results-image');
				template.removeAttr('id');
				$('#browser-results-items').append(template);
			break;

			case 'audio':

			break;

			case 'video':

			break;
		}

		return this;
	},
	
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
	
});


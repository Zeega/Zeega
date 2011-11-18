
var MyCollectionsView = Backbone.View.extend({
	model : MyCollections,
	
	initialize : function() {
		
		//draw the collections
		for (var i=0; i<3;i++){
			var template = $("#browser-my-collection-template").clone();
			template.addClass('browser-my-collection');
			template.removeAttr('id');
			template.insertAfter($("#browser-create-new-collection"));
		}
	},
	
	render: function()
	{
		
		//draw the search items
		return this;
	},
	
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
	
	
});


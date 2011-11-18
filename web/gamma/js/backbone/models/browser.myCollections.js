var MyCollections = Backbone.Model.extend({
	url : function(){return Zeega.url_prefix + "collections/personal"},
	
	//This is an ItemCollection
	itemCollection : '',
	
	initialize : function()
	{
		
	}
});



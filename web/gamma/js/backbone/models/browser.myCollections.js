/*
	TODO: Should this be a Model or a Collection? I think it's a collection of 
	BrowserCollection models. HAHAHAHAHA. For real, though. Anyways, revisit this.
*/

var MyCollections = Backbone.Model.extend({
	url : function(){return Zeega.url_prefix + "collections/personal"},
	
	//This is an ItemCollection
	itemCollection : '',
	
	initialize : function()
	{
		
	}
});



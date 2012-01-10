var Collection = Backbone.Model.extend({
	defaults : {
		title : 'Untitled'
	},
	
	url: function()
	{
		return Zeega.url_prefix + "api/items/"+ this.id;
	},
	
	initialize : function()
	{
	}

});

var CollectionCollection = Backbone.Collection.extend({
	model : Collection,
	
	url: function()
	{
		return Zeega.url_prefix + "api/search?user=-1&r_items=0";
	},
	
	parse : function(response)
	{
		this.count = response.collections_count;
		return response.collections;
	}
	
	
});

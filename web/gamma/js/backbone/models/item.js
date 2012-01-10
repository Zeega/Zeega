var Item = Backbone.Model.extend({
	defaults : {
		title : 'Untitled',
		
	},
	
	url: function(){
		// http://dev.zeega.org/jda/web/api/items/703493
		return Zeega.url_prefix + "api/items/"+ this.id;
	},
	
	initialize : function()
	{
	}

});

var ItemCollection = Backbone.Collection.extend({
	model : Item,
	
	page : 0,
	
	url: function()
	{
		//http://dev.zeega.org/jda/web/api/search
		return Zeega.url_prefix + "api/search?page="+ this.page;
	},
	
	parse : function(response)
	{
		this.count = response.items_count;
		return response.items;
	}
	
	
});

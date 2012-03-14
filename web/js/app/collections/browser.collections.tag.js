(function(Tag) {

	Tag.Collection = Backbone.Collection.extend({

		model : Tag.Model,
		
		url : function()
		{ 
			return sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/items/" + this.item_id + "/tags";
		},
	
		parse : function(response)
		{
			this.item_id = response.tags_for_item;
			return  response.tags;
		}
		
	});
	
})(zeegaBrowser.module("tag"));
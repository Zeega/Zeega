var Tag =  Backbone.Model.extend({

	url : function(){ 
		var url = sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/items/"
						+ this.get("item_id") + "/tags/"+this.get("tag_name");
		console.log("Final url for getting tags is: " + url);
		return url;
	},

	
	defaults :{},
	
	initialize: function(){},
	
	

});
var TagCollection = Backbone.Collection.extend({
	model : Tag,
	url : function(){ 
		return sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/items/"
						+ this.item_id + "/tags";
	},
	
	initialize: function(){},
	parse : function(response)
	{
		this.item_id = response.tags_for_item;
		return  response.tags;
	},
	
		
});
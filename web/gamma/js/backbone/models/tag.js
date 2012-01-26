var Tag =  Backbone.Model.extend({

	url : function(){ 
		return sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/items/"
						+ this.get("itemID") + "/tags/";
	},

	
	defaults :{},
	
	initialize: function(){},
	

});
var TagCollection = Backbone.Collection.extend({
	model : Tag,
	url : function(){ },
	
	initialize: function(){},
	parse : function(response)
	{
		this.options.itemID = response.tags_for_item;
		return response.tags;
	},
	
		
});
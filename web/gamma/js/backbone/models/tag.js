var Tag =  Backbone.Model.extend({

	url : function(){ },
	
	defaults :{},
	
	initialize: function(){},
	

});
var TagCollection = Backbone.Collection.extend({
	model : Tag,
	url : function(){ },
	
	initialize: function(){},
	parse : function(response)
	{
		return response.tags;
	},
	
		
});
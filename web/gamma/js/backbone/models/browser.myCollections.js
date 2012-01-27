/*
	This is for the MyCollections part of the interface. 
	It's a collection of BrowserCollection objects. Yup, a collection of collections.
*/

var MyCollections = Backbone.Collection.extend({
	model: BrowserCollection, 
	

	url : function(){return sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/search?user=-1&r_items=0&r_collections=1&r_items_and_collections=0"},
	
	
	initialize : function()
	{
		
		
	},
	
	parse: function(data){

		return data['collections'];
		
	},
	
});
MyCollections.comparator = function(myCollection) {
  return myCollection.get("date_created");
};


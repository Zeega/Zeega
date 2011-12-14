/*
	This is for the MyCollections part of the interface. 
	It's a collection of BrowserCollection objects. Yup, a collection of collections.
*/

var MyCollections = Backbone.Collection.extend({
	model: BrowserCollection, 
	

	url : function(){return sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/search?user=-1&r_items=0"},
	
	
	initialize : function()
	{
		
		
	},
	
	parse: function(data){

		console.log('My Collections: returned ' + data['collections_count'] + ' collections');
		
		//Assemble collection data into BrowserCollections
		if (data['collections'] != null){
			_.each(data['collections'], function(coll){
			
				
				this.add(new BrowserCollection(coll));
				console.log("Zeega browser has " + ZeegaBrowser.myCollections.length);
				console.log("this thingie has " + this.length + " myCollection models");
			}, this);

		}
		
		
	},
	
});
MyCollections.comparator = function(myCollection) {
  return myCollection.get("date_created");
};


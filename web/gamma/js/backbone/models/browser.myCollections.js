/*
	This is for the MyCollections part of the interface. 
	It's a collection of BrowserCollection objects. Yup, a collection of collections.
*/

var MyCollections = Backbone.Collection.extend({
	model: BrowserCollection, 
	

	url : function(){return Zeega.url_prefix + "app_dev.php/api/search?user=-1&r_items=0"},
	
	
	initialize : function()
	{
	
		this.fetch({
			success : function()
			{
				ZeegaBrowser.myCollectionsQueryDone();
			}
		});
	},
	
	parse: function(data){

		console.log('My Collections: returned ' + data['collections_count'] + ' collections');
		
		//Assemble collection data into BrowserCollections
		if (data['collections'] != null){
			_.each(data['collections'], function(coll){
			
				
				this.add(new BrowserCollection(coll));
			}, this);

		}
		
		
	},
});



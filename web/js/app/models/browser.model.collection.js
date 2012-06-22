(function(Collection) {

/*
		Model for items of type='collection'
*/
	Collection.Model = Backbone.Model.extend({

		defaults : {
			"title" 	: 'New collection',
			"media_type"	: 'Collection',
			"layer_type"	: 'Collection',
			"uri"	: 'http://zeega.org',
			"attribution_uri"	: 'http://zeega.org',
			"archive"	: 'Zeega',
			'new_items' : []
		},
		
		initialize : function()
		{

			this.set({"new_items": new Array()});
		},
		
		url : function()
		{
			var url = null;
			if ( this.isNew() )
			{
				url = sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/items";
			}
			else if (this.isUpdate)
			{
			    this.isUpdate = false;
			    url = sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/items/"+this.id;
			}
			else
			{
				url = sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/items/"+this.id+"/items";
			}
			//console.log("Final URL is " + url);
			return url; 
		},
		
		addNewItemID : function(newID)
		{
			var ids = this.get("new_items");
			ids.push(newID);
		},
		
		//parse : function(data){ return data.collections }

	});

})(zeegaBrowser.module("collection"));

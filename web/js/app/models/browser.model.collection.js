(function(Collection) {

/*
		Model for items of type='collection'
*/
	Collection.Model = Backbone.Model.extend({

		defaults : {
			"title" 	: 'Untitled',
			"type"	: 'collection',
			'newItemIDS' : []
		},
		
		initialize : function()
		{
			//console.log('COLLECTION MODEL INITIALIZED')
			//console.log(this)
			this.set({"newItemIDS": new Array()});
		},
		
		url : function()
		{
			var url = null;
			if ( this.isNew() )
			{
				url = sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/collections/items";
			}
			else if (this.isUpdate)
			{
			    this.isUpdate = false;
			    url = sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/collections/"+this.id;
			}
			else
			{
				url = sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/collections/"+this.id+"/items";
			}
			//console.log("Final URL is " + url);
			return url; 
		},
		
		addNewItemID : function(newID)
		{
			var ids = this.get("newItemIDS");
			ids.push(newID);
		},
		
		//parse : function(data){ return data.collections }

	});

})(zeegaBrowser.module("collection"));

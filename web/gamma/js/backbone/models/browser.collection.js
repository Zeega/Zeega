/*
	Model for items of type='collection'
*/
var BrowserCollection = Backbone.Model.extend({
	
	
	url : function(){
		if (this.isNew()){
			return Zeega.url_prefix + 'app_dev.php/api/collections/'; 
		}else {
			return Zeega.url_prefix +'app_dev.php/api/collections/'+this.id;
		}
	},
	defaults : {
		"title" 	: 'Untitled',
		"type"	: 'collection',
		"newItemIDs" :[]
	},
	
	initialize : function()
	{
	},
	addNewItemID : function(newID){
		var ids= this.get("newItemIDs");
		ids.push(newID);
	},
	parse : function(data){
		this.id = data;
		this.set({"title":"Saved collection " + this.id});
		this.set({"newItemIDs": []}); //reset the new item ids
	}

});

/*
	Nothing's better than a collection-collection
*/
var BrowserCollectionCollection = Backbone.Collection.extend({
	model : BrowserCollection,
	
	/*,
	url: function(){
		return Zeega.url_prefix+"search/items/"+ this.offset +"/100";
	}
	*/
	
});

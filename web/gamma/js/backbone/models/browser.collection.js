/*
	Model for items of type='collection'
*/
var BrowserCollection = Backbone.Model.extend({
	
	
	url : function(){
		if (this.isNew()){
			return Zeega.url_prefix + 'app_dev.php/api/collections/items'; 
		}else {
			return Zeega.url_prefix +'app_dev.php/api/collections/'+this.id+'/items';
		}
	},
	defaults : {
		"title" 	: 'Untitled',
		"type"	: 'collection',
		"newItemIDS" :[]
	},
	
	initialize : function()
	{
	},
	addNewItemID : function(newID){
		var ids= this.get("newItemIDS");
		ids.push(newID);
		this.set({"newItemIDS":ids});
	},
	parse : function(data){
		this.id = data;
		this.set({"title":"Saved collection " + this.id});
		this.set({"newItemIDS": []}); //reset the new item ids
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

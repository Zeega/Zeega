/*
	Model for items of type='collection'
*/
var BrowserCollection = Backbone.Model.extend({
	
	
	url : function(){
		if (this.isNew()){
			return sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/collections/items"; 
		}else {
			return sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "app_dev.php/api/collections/"+this.id+"/items";
		}
	},
	defaults : {
		"title" 	: 'Untitled',
		"type"	: 'collection',
		
	},
	
	initialize : function()
	{
		this.set({"newItemIDS": new Array()});
	},
	addNewItemID : function(newID){
		var ids= this.get("newItemIDS");
		ids.push(newID);
		
	},
	parse : function(data){
		this.set(data);
		this.unset("newItemIDS", {"silent":"true"});
		this.set({"newItemIDS": new Array()}); //reset the new item ids

		var test = 'blah';
		
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

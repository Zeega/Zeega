/*
	Model for items of type='collection'
*/
var BrowserCollection = Backbone.Model.extend({
	defaults : {
		title 	: 'Untitled',
		type	: 'collection'
		
	},
	
	initialize : function()
	{
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

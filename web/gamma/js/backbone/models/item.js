var Item = Backbone.Model.extend({
	defaults : {
		title : 'Untitled',
		tags : new TagCollection(),
	},
	
	url: function(){
		// http://dev.zeega.org/jda/web/api/items/703493
		return sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + "api/items";
	},
	
	initialize : function()
	{
	},

	loadTags : function(){
		this.get("tags").reset({silent:true});
		this.get("tags").fetch( {url: sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + "api/items/"+ this.id  +"/tags"});
	},

});

var ItemCollection = Backbone.Collection.extend({
	model : Item,
	
	page : 0,
	contentType : null,
	collectionID : null,
	query : null,
	totalItemsCount : 0,
	
	initialize:function(){
		
		this.bind('destroy',   this.decrementItemsCount, this);	
	},
	url: function()
	{
		var url = Zeega.url_prefix + "api/search?page="+ this.page;
		if( !_.isNull(this.query) && this.query != "" ) url += '&q=' + this.query;
		if( !_.isNull(this.contentType) ) url += '&content=' + this.contentType;
		if( !_.isNull(this.collectionID) && this.collectionID != 'all' ) url += '&collection=' + this.collectionID;
		return url;
	},
	decrementItemsCount : function(){
		this.totalItemsCount = this.totalItemsCount - 1;
	},
	resetQuery : function()
	{
		this.page = 0;
		this.contentType = null;
		this.collecitonID = null;
		this.query = null;
	},
	
	parse : function(response)
	{
		this.count = response.items_count;
		return response.items;
	}
	
	
});

//Adds a function to the javascript date object.
//Didn't really know where to put this so I put it here...(Catherine)
Date.prototype.getMonthAbbreviation = function() {
   return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][this.getMonth()]; 
}

var ZeegaWidget = {

	myCollections : null,
	myCollectionsView : null,
	search : null, 
	searchItemsView : null,
	searchCollectionsView : null,

	init : function()
	{
		this.item = new Item;
		this.itemCollection = new ItemCollection;
		this.itemViewCollection;
		
		var itemsBS = jQuery.parseJSON(itemJSON);
		this.item.set( itemsBS);
		
	    var collection = jQuery.parseJSON(itemCollectionJSON);
		
		this.itemCollection.reset( collection.items );
		this.itemCollection.count = parseInt(collection.items_count);
		this.itemViewCollection = new BrowserItemViewCollection({ collection : this.itemCollection });
        
		//this.item.set({title: "yo"});
		console.log(this.item);
		this.itemViewCollection = new BookmarkletItemView({ model : this.item });
		
		this.itemViewCollection.render(this);
	},
}
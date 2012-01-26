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
		this.itemViewCollection;
		
		var itemsBS = jQuery.parseJSON(itemJSON);
		console.log(itemsBS);
		
		this.item.set( itemsBS.items );
		console.log(this.item);
		//this.itemViewCollection = new BookmarkletItemView({ collection : this.item });
		

	},
}
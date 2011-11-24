var ZeegaBrowser = {

	myCollectionsModel : null,
	myCollectionsView : null,
	search : null, 
	searchItemsView : null,
	searchCollectionsView : null,

	init : function()
	{
		//Load MyCollections
		this.myCollectionsModel = new MyCollections({ 'id' : 23 });
		this.myCollectionsView = new MyCollectionsView({ model : this.myCollectionsModel });
			
		this.myCollectionsView.render();

		//Hide the loading spinner for the myCollections drawer
		$('#browser-my-collections .browser-loading').hide();

		//Load Search items
		this.search = new BrowserSearch();

		var itemsCollection = this.search.get("itemsCollection");
		//attach items collection to items view and collections collection to collections view
		this.searchItemsView = new BrowserSearchItemsView({ collection: itemsCollection, id : '54' });
		this.searchCollectionsView = new BrowserSearchCollectionsView({collection: this.search.get("collectionsCollection")});

		
		this.search.updateQuery();
		
		


		
	},
	queryDone : function(){
		//the views render
		this.searchItemsView.render();
		this.searchCollectionsView.render();
		
		//Hide results drawer's loading spinner
		$('#browser-results .browser-loading').hide();

	}

	
}
var ZeegaBrowser = {

	myCollections : null,
	myCollectionsView : null,
	search : null, 
	searchItemsView : null,
	searchCollectionsView : null,

	init : function()
	{
		//Load MyCollections  (renamed from inconsistently named myCollectionsModel )
		this.myCollections = new MyCollections();
		this.myCollectionsView = new MyCollectionsView({ collection : this.myCollections });
			

		//Hide the loading spinner for the myCollections drawer
		$('#browser-my-collections .browser-loading').hide();

		//Load Search items
		this.search = new BrowserSearch();
		
		//attach items collection to items view and collections collection to collections view
		this.searchItemsView = new BrowserSearchItemsView({ collection: this.search.get("itemsCollection"), id : '54' });
		this.searchCollectionsView = new BrowserSearchCollectionsView({collection: this.search.get("collectionsCollection")});
		
		this.search.updateQuery();
		
	},
	renderResults : function(){
		this.searchItemsView.render();
		this.searchCollectionsView.render();
		var _this=this;
		if (this.search.get("collection") != null){
			$('#browser-collection-filter-title').html(ZeegaBrowser.clickedCollectionTitle);
			$('#browser-collection-filter').show();
			 
			
		} 
		//Hide results drawer's loading spinner
		$('#browser-results .browser-loading').hide();
	},
	
	myCollectionsQueryDone : function(){
		this.myCollectionsView.render();
	},
	doCollectionSearch : function(collectionID){
		
		/* When user clicks on a collection default to items view
		instead of collections view */
		$('#browser-item-count').closest('li').removeClass('browser-unselected-toggle');
		$('#browser-item-count').closest('li').addClass('browser-selected-toggle');
		$('#browser-item-count').siblings().removeClass('browser-selected-toggle');
		$('#browser-item-count').siblings().addClass('browser-unselected-toggle');
		$('#browser-results-collections').hide();
		$('#browser-results-items').show();
		
		/* For the moment - clear other filters like query & type */
		$('#database-search-text').val('');
		$('#database-search-filter').val('All');
		this.search.set({'user':-2, 'collection':collectionID});
		this.doSearch();
	},
	doSearch : function(){
		
		
		//Empty items and collections from results drawer
		$('#browser-results #browser-results-collections').empty();
		$('#browser-results #browser-results-items').empty();
		
		//Show results drawer's loading spinner
		$('#browser-results .browser-loading').show();


		//Hide any previous results messages
		$('#browser-no-results-my-media-message').hide();
		$('#browser-no-items-results-message').hide();
		$('#browser-no-collections-results-message').hide();

		this.search.set({
							q: $('#database-search-text').val(), 
							content:$('#database-search-filter').val()
						});
		this.search.updateQuery();
	} 
	
}
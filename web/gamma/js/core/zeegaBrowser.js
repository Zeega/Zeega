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
		
		//populate myCollections from server
		this.myCollections.fetch({
			success : function()
			{
				console.log("FROM ZeegaBrowser.js - Zeega browser has " + ZeegaBrowser.myCollections.length);
				
			}
		});

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
		
		if (this.search.get("collection") != null){
			this.showCollectionFilter();
		} 
		//Hide results drawer's loading spinner
		$('#browser-results .browser-loading').hide();
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
	}, 
	
	//remove collection filter from view to the user
	//Does NOT perform search, just updating UI
	removeCollectionFilter : function(){

		$('#browser-collection-filter').hide();
		this.search.set({'collection':null});
		$('#browser-search-filter-toggle').css("height", "44px");
		$('#browser-my-collections-drawer .browser-results-collection').each(
			function(idx,collectionEl){
				$(collectionEl).fadeTo('fast', 1.0, function() {});
    			
		});
	},
	showCollectionFilter: function(){
		$( '#browser-collection-filter-title-form' ).hide();
		$('#browser-collection-filter-title').show();
		$('#browser-collection-filter-title').html(ZeegaBrowser.clickedCollectionTitle);

		$('#browser-collection-filter').show();
		$('#browser-search-filter-toggle').css("height", "64px");
		$('#browser-my-collections-drawer .browser-results-collection').each(
			function(idx,collectionEl){
				
				if(ZeegaBrowser.clickedCollectionTitle != $(collectionEl).find('.title').text()){
					$(collectionEl).fadeTo('fast', 0.5, function() {});
    			} else if ($(collectionEl).css("opacity") != "1.0"){
    				$(collectionEl).fadeTo('fast', 1.0, function() {});
    			}
		});
		
		$('#browser-collection-filter-title').click(function() {
			$('#browser-collection-filter-title').hide();
			$('#browser-collection-filter-title-form').show();
			$('#browser-collection-filter-title-form').css("display", "inline");
			$('#browser-update-collection-title').val(ZeegaBrowser.clickedCollectionTitle);
			$('#browser-update-collection-title').focus();
			
			//When title input field loses focus then just cancel the save
			$('#browser-update-collection-title').blur(function() {
			  	$( '#browser-collection-filter-title-form' ).hide();
				$('#browser-collection-filter-title').show();
			});

			//When user presses return, save collection with its new title
			$( '#browser-collection-filter-title-form' ).bind('keypress', function(e){
			   if ( e.keyCode == 13 ) {
			     	e.preventDefault();
			     	
			     	//Look up collection model to update
			     	var collectionID = ZeegaBrowser.search.get("collection");
					var collectionToUpdate = ZeegaBrowser.myCollections.get(collectionID);
					
					

					//Save collection and hide form field on success
					collectionToUpdate.save({ title:$('#browser-update-collection-title').val() }, 
							{
								success: function(model, response) { 
									
									$( '#browser-collection-filter-title-form' ).hide();
									$('#browser-collection-filter-title').show();
									//Update newGuy
									/*model.set({id:response.collections.id});
									model.set({thumbnail_url:response.collections.thumbnail_url});
									model.set({child_items_count:response.collections.child_items_count});
									ZeegaBrowser.myCollectionsView.collection.add(model, {at: 0});*/
				 				},
				 				error: function(model, response){
				 					
				 					console.log("Error updating collection title.");
				 					console.log(response);
				 				}
				 			});
			   }
			 });
			
		});

	}
	
}
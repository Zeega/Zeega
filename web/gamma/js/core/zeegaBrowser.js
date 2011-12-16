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

		//On hover, expand item editing bar to update or remove item
		//But only do this if user is looking at one of their own collections
		var collectionID = this.search.get("collection");
		var theCollection = this.myCollections.get(collectionID);
		if( theCollection != null){
			

			$(".browser-results-image").hover( function(e) {
				$(this).find('.browser-results-image-edit').show();
				
				}, 
				function(e) {
					$(this).find('.browser-results-image-edit').hide();

				}
			);
			//Functionality for updating thumbnail 
			$('.browser-change-thumbnail').click(function(e){

				var theImageEl = $(this).closest(".browser-results-image");
				var newThumbPath = theImageEl.find("img").attr("src");
				theCollection.isUpdate = true;
				theCollection.save({ thumbnail_url : newThumbPath }, 
						{
							success: function(model, response) { 
								console.log("Saved new thumbnail for collection " + model.id);			
			 				},
			 				error: function(model, response){
			 					
			 					console.log("Error updating collection thumbnail.");
			 					console.log(response);
			 				}
			 			});
			 	return false;
			});

			//Functionality for removing item from collection 
			$('.browser-remove-from-collection').click(function(e){

				var theImageEl = $(this).closest(".browser-results-image");
				var itemID = theImageEl.find('a:first').attr("id");
				var theItem = ZeegaBrowser.searchItemsView.collection.get(itemID);
				var deleteURL = sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/collections/"+collectionID+"/items/"+itemID;
				
				//This item is currently the thumbnail cover for the collection
				//gotta flag it to be changed once item is removed

				if( theCollection.get("child_items_count") > 1 && theImageEl.find("img").attr("src").indexOf("items/"+itemID) != -1){
					
					var otherImageEl = theImageEl.next(".browser-results-image");
					if (otherImageEl == null) {otherImageEl =theImageEl.previous(".browser-results-image"); }
					var	newThumbnailURL = otherImageEl.find("img").attr("src");
				}

				//DESTROYYYYYYYY
				theItem.destroy({	
					 				url : deleteURL,
									success: function(model, response) { 
										var newCount = theCollection.get("child_items_count") - 1;
										theCollection.set({child_items_count:newCount});
										console.log("Removed item " + itemID + " from collection " + theCollection.id);	
										
										//Update thumbnail URL if the previous item served as the
										//collection's thumbnail
										if (newThumbnailURL != null){
											theCollection.isUpdate = true;
											theCollection.save({ thumbnail_url : newThumbnailURL }, 
											{
												success: function(model, response) { 
													console.log("Saved new thumbnail for collection " + model.id);			
								 				},
								 				error: function(model, response){
								 					
								 					console.log("Error updating collection thumbnail.");
								 					console.log(response);
								 				}
								 			});
										}		
					 				},
					 				error: function(model, response){
					 					
					 					console.log("Error removing item " + itemID + " from collection " + theCollection.id);		
					 					console.log(response);
					 				}
			 					});
				
			 	return false;
			});
		}

	}
	
}
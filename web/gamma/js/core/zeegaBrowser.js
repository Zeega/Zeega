//Adds a function to the javascript date object.
//Didn't really know where to put this so I put it here...(Catherine)
Date.prototype.getMonthAbbreviation = function() {
   return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][this.getMonth()]; 
}

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
			success : function(model, response)
			{
				$('#browser-my-collections-drawer').jcarousel();
				
			}
		});

		//Hide the loading spinner for the myCollections drawer
		$('#browser-my-collections .browser-loading').hide();

		//Load Search items
		this.search = new BrowserSearch();
		
		//attach items collection to items view and collections collection to collections view
		this.searchItemsView = new BrowserSearchItemsView({ collection: this.search.get("itemsCollection") });
		this.searchCollectionsView = new BrowserSearchCollectionsView({collection: this.search.get("collectionsCollection")});
		this.timeBinsView = new BrowserTimeBinsView({collection: this.search.get("timeBinsCollection") });
		this.search.updateQuery();
		
	},
	renderResults : function(){

		this.searchItemsView.render();
		this.searchCollectionsView.render();
		this.timeBinsView.render();
		
		
		if (this.search.get("collection") != null){
			this.showCollectionFilter();
		} 
		//Hide results drawer's loading spinner
		$('#browser-results .browser-loading').hide();
		
	},
	/* Resets the page count so that results are refreshed completely */
	resetPageCount : function(){
		this.search.set({page: 1});	
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
		
		if (this.search.get("page") == 1) {
		
			//Empty items and collections from results drawer
			$('#browser-results #browser-results-collections .browser-results-collection').remove();
			$('#browser-results #browser-results-items .browser-results-image').remove();		

			//Show results drawer's loading spinner
			$('#browser-results .browser-loading').show();

		} 
		
		//Hide any previous results messages
		$('#browser-no-results-my-media-message').hide();
		$('#browser-no-items-results-message').hide();
		$('#browser-no-collections-results-message').hide();

		//Hide "load more results" link
		$('#browser-view-more-collection-results').hide();
		$('#browser-view-more-item-results').hide();

		//TimeBins
		if ($('#browser-time-filter').is(':visible')) {

			//Check if user has selected a particular bin. if so then
			//set search to NOT return more time bins
			if(this.timeBinsView.collection.selectedStartDate != null && this.timeBinsView.collection.selectedEndDate != null){
				this.search.set({
									dtstart: this.timeBinsView.collection.selectedStartDate, 
									dtend: this.timeBinsView.collection.selectedEndDate,
									r_time: 0
								});
			} 
			//Otherwise use date values from the slider control
			else {
			
				var startDate = new Date(0);
				startDate.setFullYear( $('a#handle_valueAA').attr('aria-valuetext') );

				var endDate = new Date(0);
				endDate.setFullYear( $('a#handle_valueBB').attr('aria-valuetext') );

				this.search.set({
									dtstart: startDate.getTime()/1000.0, 
									dtend: endDate.getTime()/1000.0,
									r_time: 1
								});
			}

		} else { //Reset start & end dates so that time filter gets cleared
			this.search.set({
								dtstart: 0, 
								dtend: 0
							});
		}
		if ($('#database-search-text').val().indexOf("search ") < 0){
			this.search.set({
							q: $('#database-search-text').val()
							
						});
		} else {
			this.search.set({
							q: null
							
						});
		}
		this.search.set({ 
							content:$('#database-search-filter').val()
						});
		this.search.updateQuery();
	}, 
	showShareButton : function(collectionID){	
		$('#share-collection-modal').find('.modal-body').html("<p>Share your collection: <b></b></p><a target='blank' href='"+sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'collection/'+collectionID+"/view'>"+sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'collection/'+collectionID+"/view</a>");
					
		$('#share-collection-modal').modal('show');
		
		$('#share-collection-modal').find('#close-modal').mouseup(function(){
			$('#share-collection-modal').modal('hide');
		})

		return false;
	},
	goToEditor : function(collectionID, collectionTitle){
		var postdata={title:collectionTitle, collection_id:collectionID};
		$.post(sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +'playgrounds/'+ sessionStorage.getItem('playgroundId') +'/project',postdata, function(data){
					window.location= sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')  +'playground/'+  sessionStorage.getItem('playgroundShort') +'/project/'+data;
			});	
		return false;
	},
	deleteCollection : function(collectionID){
		
		var deleteURL = sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/collections/"
						+ collectionID;
		var theCollection = ZeegaBrowser.myCollections.get(collectionID);

		//DESTROYYYYYYYY
		theCollection.destroy({	
			 				url : deleteURL,
							success: function(model, response) { 
								ZeegaBrowser.myCollections.remove(theCollection);
								$('#browser-my-media').trigger('click');
								console.log("Deleted collection " + collectionID);		
			 				},
			 				error: function(model, response){
			 					
			 					console.log("Error deleting collection " + collectionID);		
			 					console.log(response);
			 				}
	 					});
	},
	//remove collection filter from view to the user
	//Does NOT perform search, just updating UI
	removeCollectionFilter : function(){

		//remove open in editor link
		$('#browser-open-in-editor').hide();

		//Hide collection tab
		$('#browser-collection-filter-tab').hide();
		
	
		//Clear the search object
		this.search.set({'collection':null});
		
		//Fade in the MyCollections that had been faded out for the filter
		$('#browser-my-collections-drawer .browser-results-collection').each(
			function(idx,collectionEl){
				$(collectionEl).fadeTo('fast', 1.0, function() {});
				$(collectionEl).removeClass('browser-add-item-to-collection-hover');
    			
		});
	},
	editCollectionTitle : function(value, settings, collectionID){
		//Look up collection model to update
		var collectionToUpdate = ZeegaBrowser.myCollections.get(collectionID);
		
		collectionToUpdate.isUpdate = true;
		var newTitle = value;

		//Save collection and hide form field on success
		collectionToUpdate.save({ title:newTitle }, 
				{
					success: function(model, response) { 
						
						//update collection title in UI if this collection is
						//the current collection filter
						if(model.id == ZeegaBrowser.search.get("collection")){
							ZeegaBrowser.clickedCollectionTitle = model.get("title");
							$('#database-search-text').val("search " + model.get("title"));
						}
				
	 				},
	 				error: function(model, response){
	 					
	 					console.log("Error updating collection title.");
	 					console.log(response);
	 				}
	 			});
		return value; //must return the value!!
	},
	showCollectionFilter: function(){
		
		$('#browser-open-in-editor').show();

		$('#browser-collection-filter-tab-text').editable(
			function(value, settings)
			{ 
				return ZeegaBrowser.editCollectionTitle(value, settings, ZeegaBrowser.search.get("collection"));
			},
			{
				indicator : 'Saving...',
				tooltip   : 'Click to edit...',
				indicator : '<img src="images/loading.gif">',
				select : false,
				onblur : 'submit',
				width : $('#browser-collection-filter-tab-text').attr("width") * 2,
				cssclass : 'browser-form'
		});

		//hide form, show text
		$( '#browser-collection-filter-title-form' ).hide();
		$('#browser-collection-filter-tab-text').show();

		//show the collection tab
		$('#browser-collection-filter-tab-text').text(ZeegaBrowser.clickedCollectionTitle);
		$('#browser-collection-filter-tab').show();
		$('#database-search-text').val("search " + ZeegaBrowser.clickedCollectionTitle);

		//select the right tab
		$('#browser-toggle-all-media-vs-my-media li').removeClass('browser-selected-toggle');
		$('#browser-toggle-all-media-vs-my-media li').addClass('browser-unselected-toggle');
		$('#browser-collection-filter-tab').addClass('browser-selected-toggle');

		
		

		//Highlight the collection in the MyCollections drawer
		$('#browser-my-collections-drawer .browser-results-collection').each(
			function(idx,collectionEl){
				
				if(ZeegaBrowser.clickedCollectionTitle != $(collectionEl).find('.title').text()){
					$(collectionEl).fadeTo('fast', 0.5, function() {});
					$(collectionEl).removeClass('browser-add-item-to-collection-hover');
    			} else {
    				if ($(collectionEl).css("opacity") != "1.0"){
    					$(collectionEl).fadeTo('fast', 1.0, function() {});
    				}
    				$(collectionEl).addClass('browser-add-item-to-collection-hover');

	    		} 
		});

		//When hovering on individual item --
		// expand item editing bar to remove item OR make an item the cover image of the collection
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
					if (otherImageEl.length ==0) {
						otherImageEl =theImageEl.prev(".browser-results-image"); 
					}
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
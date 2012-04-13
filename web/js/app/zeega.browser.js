//Adds a function to the javascript date object.
//Didn't really know where to put this so I put it here...(Catherine)
Date.prototype.getMonthAbbreviation = function() {
   return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][this.getMonth()]; 
}


this.zeegaBrowser = {
	// break up logical components of code into modules.
	module: function()
	{
		// Internal module cache.
		var modules = {};

		// Create a new module reference scaffold or load an existing module.
		return function(name) 
		{
			// If this module has already been created, return it.
			if (modules[name]) return modules[name];

			// Create a module and save it under this name
			return modules[name] = { Views: {} };
		};
	}(),

  // Keep active application instances namespaced under an app object.
  app: _.extend({
	
	carousel:null,
	myCollections : null,
	searchItemsView : null,
	searchCollectionsView : null,
	
	init : function()
	{
		var Collection = zeegaBrowser.module("collection");
		this.myCollections = new Collection.Collections()
		
		var Items = zeegaBrowser.module('items');
		this.items = new Items.MasterCollection();
		
/*
		//Load Search items
		var BrowserSearch = zeega.module("browserSearch");
		this.search = new BrowserSearch.Model();
		
		//attach items collection to items view and collections collection to collections view
		this.searchItemsView = new BrowserSearchItemsView({ collection: this.search.get("itemsCollection") });
		this.searchCollectionsView = new BrowserSearchCollectionsView({collection: this.search.get("collectionsCollection")});
		this.timeBinsView = new BrowserTimeBinsView({collection: this.search.get("timeBinsCollection") });
		this.search.updateQuery();
*/		
	},
	
	mycarousel_initCallback : function (carousel, state)
	{
		
		if (state == 'init') {zeegaBrowser.app.carousel = carousel;
		console.log('here comes the app');
		console.log(zeegaBrowser.app);
		}
	},
	
	renderResults : function()
	{
		this.searchItemsView.render();
		this.searchCollectionsView.render();
		this.timeBinsView.render();
		
		
		if (this.search.get("collection") != null){
			this.showCollectionFilter();
		} 
		//Hide results drawer's loading spinner
		$('#browser-results .browser-loading').hide();
		
	},

	// refresh the items collections
	refreshItems : function(){ this.items.refresh() },
	
	/* Resets the page count so that results are refreshed completely */
	resetPageCount : function(){ this.items.collection.search.set( 'page' , 1 ) },
	
	doCollectionSearch : function(collectionID)
	{
		/* For the moment - clear other filters like query & type */
		$('#database-search-text').val('');
		this.items.collection.search.set({'user':-2, 'collection':collectionID, content:'all'});
		this.doSearch();
	},
	
	doSearch : function()
	{
		
		if ( this.items.collection.search.get("page") == 1 )
		{
			//Empty items and collections from results drawer
			$('#browser-results #browser-results-items .browser-results-image, #browser-results #browser-results-items .browser-results-collection').remove();
		} 
		
		//Hide any previous results messages
		$('#browser-no-results-my-media-message').hide();
		$('#browser-no-items-results-message').hide();
		$('#browser-no-collections-results-message').hide();

		//Hide "load more results" link
		$('#browser-view-more-collection-results').hide();
		$('#browser-view-more-item-results').hide();

		//TimeBins
		if ($('#browser-time-filter').is(':visible'))
		{
			//Check if user has selected a particular bin. if so then
			//set search to NOT return more time bins
			if(this.timeBinsView.collection.selectedStartDate != null && this.timeBinsView.collection.selectedEndDate != null)
			{
				this.items.collection.search.set({
									dtstart: this.timeBinsView.collection.selectedStartDate, 
									dtend: this.timeBinsView.collection.selectedEndDate,
									r_time: 0
								});
			} 
			else
			{
				//Otherwise use date values from the slider control
				var startDate = new Date(0);
				startDate.setFullYear( $('a#handle_valueAA').attr('aria-valuetext') );

				var endDate = new Date(0);
				endDate.setFullYear( $('a#handle_valueBB').attr('aria-valuetext') );

				this.items.collection.search.set({
									dtstart: startDate.getTime()/1000.0, 
									dtend: endDate.getTime()/1000.0,
									r_time: 1
								});
			}

		}
		else
		{
			//Reset start & end dates so that time filter gets cleared
			this.items.collection.search.set({
								dtstart: 0, 
								dtend: 0
							});
		}
		
		if ($('#database-search-text').val().indexOf("search ") < 0)
			this.items.collection.search.set({ q: $('#database-search-text').val() });
		else
			this.items.collection.search.set({ q: null });
		
		this.items.collection.fetch();
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
		$.post(sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +'sites/'+ sessionStorage.getItem('siteId') +'/project',postdata, function(data){
					window.location= sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')  +'site/'+  sessionStorage.getItem('siteShort') +'/project/'+data;
			});	
		return false;
	},
	deleteCollection : function(collectionID){
		
		var deleteURL = sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/collections/"
						+ collectionID;
		var theCollection = zeegaBrowser.app.myCollections.collection.get(collectionID);

		//DESTROYYYYYYYY
		theCollection.destroy({	
			 				url : deleteURL,
							success: function(model, response) { 
								//Current tab is this collection they are deleting
								if (zeegaBrowser.app.clickedCollectionID == model.id){
									zeegaBrowser.app.removeCollectionFilter();
									$('#browser-collection-filter-tab').hide();
								}
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
	removeCollectionFilter : function()
	{

		//remove open in editor link
		$('#browser-open-in-editor').hide();

		//Hide collection tab
		$('#browser-collection-filter-tab').removeClass('.browser-selected-toggle');
		
		//Clear the search object
		this.items.collection.search.set({'collection':null});
		
		//Fade in the MyCollections that had been faded out for the filter
		$('#browser-my-collections-drawer .browser-results-collection').each(
			function(idx,collectionEl){
				$(collectionEl).fadeTo('fast', 1.0, function() {});
				$(collectionEl).removeClass('browser-add-item-to-collection-hover');
    			
		});
	},
	
	editCollectionTitle : function(value, settings, collectionID){
		//Look up collection model to update
		var collectionToUpdate = zeegaBrowser.app.myCollections.get(collectionID);
		
		collectionToUpdate.isUpdate = true;
		var newTitle = value;

		//Save collection and hide form field on success
		collectionToUpdate.save({ title:newTitle }, 
				{
					success: function(model, response) { 
						
						//update collection title in UI if this collection is
						//the current collection filter
						if(model.id == zeegaBrowser.app.items.collection.search.get("collection")){
							zeegaBrowser.app.clickedCollectionTitle = model.get("title");
							zeegaBrowser.app.clickedCollectionID = model.id;
							$('#database-search-text').val("search " + model.get("title"));
						}
						//Update title in itemsview if it's there
						var otherModel = zeegaBrowser.app.searchItemsView.collection.get(model.id);
						if(otherModel!=null) {
							otherModel.set({"title":model.get("title")});
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

		/* Commenting out because we don't want to edit title here
		TODO: Remove this
		$('#browser-collection-filter-tab-text').editable(
			function(value, settings)
			{ 
				return zeegaBrowser.app.editCollectionTitle(value, settings, zeegaBrowser.app.search.get("collection"));
			},
			{
				indicator : 'Saving...',
				tooltip   : 'Click to edit...',
				indicator : '<img src="images/loading.gif">',
				select : false,
				onblur : 'submit',
				width : $('#browser-collection-filter-tab-text').attr("width") * 2,
				cssclass : 'browser-form'
		});*/

		//hide form, show text
		$( '#browser-collection-filter-title-form' ).hide();
		$('#browser-collection-filter-tab-text').show();

		//show the collection tab
		$('#browser-collection-filter-tab-text').text(zeegaBrowser.app.clickedCollectionTitle);
		$('#browser-collection-filter-tab').show();
		$('#database-search-text').val("search " + zeegaBrowser.app.clickedCollectionTitle);

		
		//select the right tab
		$('#browser-toggle-all-media-vs-my-media li').removeClass('browser-selected-toggle');
		$('#browser-toggle-all-media-vs-my-media li').addClass('browser-unselected-toggle');
		$('#browser-collection-filter-tab').addClass('browser-selected-toggle');

		
		

		//Highlight the collection in the MyCollections drawer
		$('#browser-my-collections-drawer .browser-results-collection').each(
			function(idx,collectionEl){
				
				if(zeegaBrowser.app.clickedCollectionTitle != $(collectionEl).find('.title').text()){
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
		var collectionID = this.items.collection.search.get("collection");
		var theCollection = this.myCollections.collection.get(collectionID);
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
				var theItem = zeegaBrowser.app.searchItemsView.collection.get(itemID);
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
	

}, Backbone.Events)


};
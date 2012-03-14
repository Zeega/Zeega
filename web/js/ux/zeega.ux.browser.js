/*

	ux.js
	
	the stuff in here should primarily be jQuery stuff that needs to be done after the dom is loaded
	Creating buttons, hovers, tabs, and other stuff here


*/

//	stuff that has to happen after the js fully loads

function initUX()
{
	initHeaderUX();
}



$(document).ready(function() {


	// menu stuff
	$('.menu-toggle').click(function(){
		var menu = $(this).next();
		if( menu.hasClass('open') ) menu.removeClass('open');
		else menu.addClass('open');
		
		event.stopPropagation();
	});
	//clear menus on click
	$('html').bind("click", clearMenus);
	
	function clearMenus()
	{
		$('.menu-items').removeClass('open');
	}

	// filter database by type
	$('#search-filter li a').click(function(){
		
		zeegaBrowser.app.items.collection.search.set({ 
							content:$(this).data('search-filter')
						});
		zeegaBrowser.app.resetPageCount();
		zeegaBrowser.app.doSearch();
		
		clearMenus();
		return false;
	});

	//Click event for collection filter
	$('#browser-collection-filter-tab').click(function(){
		
		zeegaBrowser.app.doCollectionSearch(zeegaBrowser.app.clickedCollectionID);
		zeegaBrowser.app.showCollectionFilter();
		return false;
	});

	//Sets variable for Fancybox "more" view to false each time the page is reloaded
	sessionStorage.setItem('moreFancy', false);

	//set up fancybox lightbox plugin
	$(".fancymedia").fancybox({
		openEffect : 'fade',
    	closeEffect	: 'fade',
    	openSpeed : 'fast',
    	closeSpeed : 'fast',
		closeClick:false,
		nextClick:false,
		mouseWheel:false,
		fitToView:false,
		arrows:false,
		closeBtn:false,
		aspectRatio:true,
		scroll:'none',
				// Changing next gallery item
			nextEffect: 'none', // 'elastic', 'fade' or 'none'
			nextSpeed: 700,
			nextEasing: 'none',
			nextMethod: 'changeIn',

			// Changing previous gallery item
			prevEffect: 'none', // 'elastic', 'fade' or 'none'
			prevSpeed: 700,
			prevEasing: 'none',
			prevMethod: 'changeOut',
		keys: {
				next: [ 34, 39, 40], //  page down, right arrow, down arrow
				prev: [ 33, 37, 38], //  page up, left arrow, up arrow
				close: [27] // escape key
		},
		
    	helpers : {
    		title : false
    	},
    	beforeClose : function()
		{
			//set video src to null to prevent browser bug
			$('video').attr("src", null);
    	},
		
		/* This is where we decide which kind of content to put in the fancybox */    
    	beforeLoad : function()
		{
			$('#fancybox-document-cloud').remove();

			var elementID = $(this.element).attr('id');
			var itemsCollection = zeegaBrowser.app.items.collection;
			var thisModel = itemsCollection.get(elementID);
			var fancyView = null;

			var Fancybox = zeegaBrowser.module('fancybox');

			switch( thisModel.get("layer_type") )
			{
				case 'Image':
					fancyView = new Fancybox.Views.Image({ model : thisModel });
					fancyView.render(this);
					break;
				case 'Video':
					fancyView = new FancyBoxVideoView({model:thisModel});
					fancyView.render(this);
					break;
				case 'Audio':
					fancyView = new FancyBoxAudioView({model:thisModel});
					fancyView.render(this);
					break;
				case 'Youtube':
					fancyView = new FancyBoxYouTubeView({model:thisModel});
					fancyView.render(this);
					break;
				case 'Tweet':
					fancyView = new FancyBoxTweetView({model:thisModel});
					fancyView.render(this);
					break;
				case 'DocumentCloud':
					fancyView = new FancyBoxDocCloudView({model:thisModel});
					fancyView.render(this);
					break;
			}
        },
        
	});
	
	//Collection playback and editor connection
	$('#collection-player-button').click(function(){
		zeegaBrowser.app.showShareButton(zeegaBrowser.app.items.collection.search.get("collection"));
		return false;
	
	}); 

	$('#collection-to-editor-button, #browser-open-in-editor').click(function(){
		zeegaBrowser.app.goToEditor(zeegaBrowser.app.items.collection.search.get("collection"), zeegaBrowser.app.clickedCollectionTitle);
		return false;
	});
	$( '#database-search-text' ).bind('focus', function(e){
	   
	     $(this).val('');
	   
	 });
	$( '#database-search-text' ).bind('keypress', function(e){
	   if ( e.keyCode == 13 ) {
	     e.preventDefault();
	     zeegaBrowser.app.resetPageCount();
	     zeegaBrowser.app.doSearch();
	   }
	 });
	 $( '#database-search-filter' ).bind('change', function(e){
	 	zeegaBrowser.app.resetPageCount();
	     zeegaBrowser.app.doSearch();
	 });

	
	$('#browser-open-timeline').click( function(){
		$('#browser-right-sidebar').show();		
		$(this).hide();
		$('#browser-close-timeline').show();
		
		
		//Reset page count & Do initial search
		zeegaBrowser.app.resetPageCount();
		zeegaBrowser.app.doSearch();
		
		return false;
	});
	$('#browser-close-timeline').click( function(){
		$('#browser-right-sidebar').hide();		
		$(this).hide();
		$('#browser-open-timeline').show();
		

		//Do full search to reset
		zeegaBrowser.app.resetPageCount();
		zeegaBrowser.app.doSearch();

		return false;
	});

	//Switches the results drawer between items and collections
	$('#browser-toggle-items-vs-collections span').click(function(){

		$(this).closest('span').removeClass('browser-unselected-toggle');
		$(this).closest('span').addClass('browser-selected-toggle');
		$(this).siblings().removeClass('browser-selected-toggle');
		$(this).siblings().addClass('browser-unselected-toggle');

		
		if ($(this).attr('id') == 'browser-collection-count'){
			$('#browser-results-collections').show();
			$('#browser-results-items').hide();
		} else {
			$('#browser-results-collections').hide();
			$('#browser-results-items').show();
		}
		zeegaBrowser.app.renderResults();
		return false;
	});

	//makes call to server to load All Media vs. My Media
	$('#browser-my-media, #browser-all-media').click(function(e){
		
		$('#browser-toggle-all-media-vs-my-media li').removeClass('browser-selected-toggle');
		$('#browser-toggle-all-media-vs-my-media li').addClass('browser-unselected-toggle');
		$(this).addClass('browser-selected-toggle');
	
		if ($(this).attr('id') == "browser-my-media"){
			zeegaBrowser.app.items.collection.search.set({user:-1});
			$('#database-search-text').val("search my stuff");

		}else if ($(this).attr('id') == "browser-all-media"){
			$('#database-search-text').val("search everything");
			zeegaBrowser.app.items.collection.search.set({user:-2});
		} 

		//Clear any collection filter on page
		zeegaBrowser.app.removeCollectionFilter();

		//reset page count
		zeegaBrowser.app.resetPageCount();

		zeegaBrowser.app.doSearch();
	});
	
	$('#browser-collection-filter-tab-edit-icon, #browser-collection-filter-edit-menu').hover(
		function(){
			//calculate position dynamically based on text position
			$('#browser-collection-filter-edit-menu').css("left", $('#browser-collection-filter-tab-text').width() + 15);
			$('#browser-collection-filter-edit-menu').show();
		}, 
		function(){
			$('#browser-collection-filter-edit-menu').hide();
		}
	);
	
	

	$('#browser-create-new-collection').droppable({
			accept : '.browser-results-image, .browser-results-collection',
			hoverClass : 'browser-create-new-collection-hover',
			tolerance : 'pointer',

			//this happens when you drop an item onto a collection
			drop : function( event, ui )
			{
				
				ui.draggable.draggable('option','revert',false);
				
				$(this).effect("highlight", {}, 3000);

				if(zeegaBrowser.app.draggedItem.id)
				{
					//var newGuy = new BrowserCollection();
					var Collection = zeegaBrowser.module('collection');
					var newGuy = new Collection.CollectionModel()
					newGuy.addNewItemID(zeegaBrowser.app.draggedItem.id);
					console.log(newGuy)
				
					newGuy.save({
						title:'New collection ' + Math.floor(Math.random()*1000)}, 
						{
							success: function(model, response)
							{ 
								zeegaBrowser.app.draggedItem = null;
					
								//Update newGuy
								model.set({id:response.collections.id});
								model.set({thumbnail_url:response.collections.thumbnail_url});
								model.set({child_items_count:response.collections.child_items_count});
								zeegaBrowser.app.myCollectionsView.collection.add(model, {at: 0});
		 					},
			 				error: function(model, response)
							{
			 					zeegaBrowser.app.draggedItem = null;
			 					console.log("Error creating a new collection.");
			 					console.log(response);
			 				}
		 			});
				
				}
				else
				{
					console.log('Error: failure to recognize dragged item');
					console.log(zeegaBrowser.app);
				}
			}
	});
		
	$('#browser-delete-collection').click(function() {
		zeegaBrowser.app.deleteCollection(zeegaBrowser.app.items.collection.search.get("collection"));
		return false;
	});
	$('#browser-rename-collection').click(function() {
		alert('implement in modal window');//Commenting out
		//using jeditable framework - pretend like user clicked on the title element
		//see zeegaBrowser.app.showCollectionFilter for definition of behavior
		//$('#browser-collection-filter-tab-text').trigger('click');
	});
	
	//Load the next page of results into the results drawer
	$('#browser-view-more-item-results, #browser-view-more-collection-results').click(function(){
	 	zeegaBrowser.app.items.collection.search.set({page: zeegaBrowser.app.items.collection.search.get("page")++ });
	 	zeegaBrowser.app.doSearch();
	 	return false;
	 });
	 
	 
	 
	 
	
	 window.addEventListener('focus', function(){
		zeegaBrowser.app.refreshItems();
		console.log('infocus refresh database')
	});
	
	
	
});
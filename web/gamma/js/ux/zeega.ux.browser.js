/*

	ux.js
	
	the stuff in here should primarily be jQuery stuff that needs to be done after the dom is loaded
	Creating buttons, hovers, tabs, and other stuff here


*/

//	stuff that has to happen after the js fully loads

function initUX(){
	initHeaderUX();

	

}



$(document).ready(function() {

	

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
		
    	helpers : {
    		title : false,
    		buttons	: {}
    	},
    	
		
		/* This is where we decide which kind of content to put in the fancybox */    
    	beforeLoad : function() {
    
            var elementID = $(this.element).attr('id');
           	var itemsCollection = ZeegaBrowser.search.get("itemsCollection");
           	var thisModel = itemsCollection.get(elementID);
			var fancyView = null;

			switch(thisModel.get("source")){
				case 'Image':
					fancyView = new BrowserFancyBoxImageView({model:thisModel});
           			fancyView.render(this);
           			break;
           		case 'Video':
           			fancyView = new BrowserFancyBoxVideoView({model:thisModel});
           			fancyView.render(this);
           			break;
           		case 'Audio':
           			fancyView = new BrowserFancyBoxAudioView({model:thisModel});
           			fancyView.render(this);
           			break;
           		case 'Youtube':
           			fancyView = new BrowserFancyBoxYouTubeView({model:thisModel});
           			fancyView.render(this);
           			break;
			}
        },
        
	});
	
	//Collection playback and editor connection
	$('#collection-player-button').click(function(){
		ZeegaBrowser.showShareButton(ZeegaBrowser.search.get("collection"));
		return false;
	
	}); 

	$('#collection-to-editor-button').click(function(){
		ZeegaBrowser.goToEditor(ZeegaBrowser.search.get("collection"), ZeegaBrowser.clickedCollectionTitle);
		return false;
	});

	$( '#database-search-text' ).click(function(){
			$(this).val('');
	});
	$( '#database-search-text' ).bind('keypress', function(e){
	   if ( e.keyCode == 13 ) {
	     e.preventDefault();
	     ZeegaBrowser.resetPageCount();
	     ZeegaBrowser.doSearch();
	   }
	 });
	 $( '#database-search-filter' ).bind('change', function(e){
	 	ZeegaBrowser.resetPageCount();
	     ZeegaBrowser.doSearch();
	 });

	$('#browser-remove-collection-filter').click(function(e){
		ZeegaBrowser.removeCollectionFilter();
		ZeegaBrowser.resetPageCount();
		ZeegaBrowser.doSearch();
		return false;
	});

	
	$('#browser-open-timeline').click( function(){
		$('#browser-right-sidebar').show();		
		$(this).hide();
		$('#browser-close-timeline').show();
		
		
		//Reset page count & Do initial search
		ZeegaBrowser.resetPageCount();
		ZeegaBrowser.doSearch();
		
		return false;
	});
	$('#browser-close-timeline').click( function(){
		$('#browser-right-sidebar').hide();		
		$(this).hide();
		$('#browser-open-timeline').show();
		

		//Do full search to reset
		ZeegaBrowser.resetPageCount();
		ZeegaBrowser.doSearch();

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
		ZeegaBrowser.renderResults();
		return false;
	});

	//makes call to server to load All Media vs. My Media
	$('#browser-my-media, #browser-all-media').click(function(e){
		
		$('#browser-toggle-all-media-vs-my-media li').removeClass('browser-selected-toggle');
		$('#browser-toggle-all-media-vs-my-media li').addClass('browser-unselected-toggle');
		$(this).addClass('browser-selected-toggle');
	
		if ($(this).attr('id') == "browser-my-media"){
			ZeegaBrowser.search.set({user:-1});
			$('#database-search-text').val("search my media");

		}else if ($(this).attr('id') == "browser-all-media"){
			$('#database-search-text').val("search all media");
			ZeegaBrowser.search.set({user:-2});
		} 

		//Clear any collection filter on page
		ZeegaBrowser.removeCollectionFilter();

		//reset page count
		ZeegaBrowser.resetPageCount();

		ZeegaBrowser.doSearch();
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

				if(ZeegaBrowser.draggedItem.id){
				var newGuy = new BrowserCollection();

				newGuy.addNewItemID(ZeegaBrowser.draggedItem.id);
				
				newGuy.save({ title:'New collection ' + Math.floor(Math.random()*1000)}, 
							{
								success: function(model, response) { 
									ZeegaBrowser.draggedItem = null;
									
									//Update newGuy
									model.set({id:response.collections.id});
									model.set({thumbnail_url:response.collections.thumbnail_url});
									model.set({child_items_count:response.collections.child_items_count});
									ZeegaBrowser.myCollectionsView.collection.add(model, {at: 0});
				 				},
				 				error: function(model, response){
				 					ZeegaBrowser.draggedItem = null;
				 					console.log("Error creating a new collection.");
				 					console.log(response);
				 				}
				 			});
				
				
				}
				else{
					console.log('Error: failure to recognize dragged item');
					console.log(ZeegaBrowser);
				
				}
			}
		});
	$('#browser-delete-collection').click(function() {
		ZeegaBrowser.deleteCollection(ZeegaBrowser.search.get("collection"));
		return false;
	});
	$('#browser-rename-collection').click(function() {
		//using jeditable framework - pretend like user clicked on the title element
		//see ZeegaBrowser.showCollectionFilter for definition of behavior
		$('#browser-collection-filter-tab-text').trigger('click');
	});
	
	//Load the next page of results into the results drawer
	$('#browser-view-more-item-results, #browser-view-more-collection-results').click(function(){
	 	ZeegaBrowser.search.set({page: ZeegaBrowser.search.get("page") + 1 });
	 	ZeegaBrowser.doSearch();
	 	return false;
	 });
});
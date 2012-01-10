/*

	ux.js
	
	the stuff in here should primarily be jQuery stuff that needs to be done after the dom is loaded
	Creating buttons, hovers, tabs, and other stuff here


*/

//	stuff that has to happen after the js fully loads

function initUX(){
	initHeaderUX();

	

}


function shareButton()
{	
	$('#share-collection-modal').find('.modal-body').html("<p>Share your collection: <b></b></p><a target='blank' href='"+sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'collection/'+ZeegaBrowser.search.get("collection")+"/view'>"+sessionStorage.getItem('hostname')+sessionStorage.getItem('directory')+'collection/'+ZeegaBrowser.search.get("collection")+"/view</a>");
				
	$('#share-collection-modal').modal('show');
	
	//$('#project-link').attr('href','')
	
	$('#share-collection-modal').find('#close-modal').mouseup(function(){
		$('#share-collection-modal').modal('hide');
	})

	return false;
}


$(document).ready(function() {

	

	//set up fancybox lightbox plugin
	$(".fancymedia").fancybox({
		openEffect : 'fade',
    	closeEffect	: 'fade',
    	openSpeed : 'fast',
    	closeSpeed : 'fast',
    	openEasing : 'none',
    	closeEasing : 'none',
		closeClick:false,
		nextClick:false,
		mouseWheel:false,
		fitToView:true,
		arrows:true,
		closeBtn:false,
		autoSize:true,
    	helpers : {
    		title : {
    			type : 'inside'
    		}
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
	
	
	shareButton();
	
	return false;
	
	
	
	}); 
	
	
	
	$('#collection-to-editor-button').click(function(){
					var postdata={title:ZeegaBrowser.clickedCollectionTitle};
					$.post(sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') +'playgrounds/'+ sessionStorage.getItem('playgroundId') +'/project',postdata, function(data){
								window.location= sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')  +'playground/'+  sessionStorage.getItem('playgroundShort') +'/project/'+data;
						});
					return false;
			});

	$( '#database-search-text' ).click(function(){
			$(this).val('');
	});
	$( '#database-search-text' ).bind('keypress', function(e){
	   if ( e.keyCode == 13 ) {
	     e.preventDefault();
	     ZeegaBrowser.doSearch();
	   }
	 });
	 $( '#database-search-filter' ).bind('change', function(e){
	     ZeegaBrowser.doSearch();
	 });

	$('#browser-remove-collection-filter').click(function(e){
		ZeegaBrowser.removeCollectionFilter();
		ZeegaBrowser.doSearch();
		return false;
	});

	
	$('#browser-open-timeline').click( function(){
		$('#browser-right-sidebar').show();		
		$(this).hide();
		$('#browser-close-timeline').show();
		
		
		//Do initial search
		ZeegaBrowser.doSearch();
		
		return false;
	});
	$('#browser-close-timeline').click( function(){
		$('#browser-right-sidebar').hide();		
		$(this).hide();
		$('#browser-open-timeline').show();
		

		//Do search to reset
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
	$('#browser-toggle-all-media-vs-my-media li').click(function(e){
		
		$(this).closest('li').removeClass('browser-unselected-toggle');
		$(this).closest('li').addClass('browser-selected-toggle');
		$(this).siblings().removeClass('browser-selected-toggle');
		$(this).siblings().addClass('browser-unselected-toggle');

		if ($(this).attr('id') == "browser-my-media"){
			ZeegaBrowser.search.set({user:-1});

		}else {

			ZeegaBrowser.search.set({user:-2});
		}
		
		//Clear any collection filter on page
		ZeegaBrowser.removeCollectionFilter();

		ZeegaBrowser.doSearch();
	});
	
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
					
					collectionToUpdate.isUpdate = true;

					//Save collection and hide form field on success
					collectionToUpdate.save({ title:$('#browser-update-collection-title').val() }, 
							{
								success: function(model, response) { 
									
									
									$( '#browser-collection-filter-title-form' ).hide();
									$('#browser-collection-filter-title').text(model.get("title")).show();


									
				 				},
				 				error: function(model, response){
				 					
				 					console.log("Error updating collection title.");
				 					console.log(response);
				 				}
				 			});
			   }
			 });
			
		});
});
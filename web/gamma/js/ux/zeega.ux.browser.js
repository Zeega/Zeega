/*

	ux.js
	
	the stuff in here should primarily be jQuery stuff that needs to be done after the dom is loaded
	Creating buttons, hovers, tabs, and other stuff here


*/

//	stuff that has to happen after the js fully loads

function initUX(){
	initHeaderUX();

	

}
//Toggles filters on and off, temporary until we figure out exactly how this'll look
function toggleFilterDrawer(){


	if( $('#browser-right-sidebar').css('position') == 'absolute') {
		$('#browser-right-sidebar').css('position', 'relative');
		$('#browser-right-sidebar').css('float', 'right');
		$('#browser-right-sidebar').css('width', '530px');
		$('#browser-right-sidebar').css('height', '400px');
		$('#browser-toggle-items-vs-collections').css('right', '');
		$('#browser-toggle-items-vs-collections').css('left', '297px');
	}
	else{
		$('#browser-right-sidebar').css('position', 'absolute');
		$('#browser-right-sidebar').css('float', 'none');
		$('#browser-right-sidebar').css('width', '48px');
		$('#browser-right-sidebar').css('height', '100px');
		$('#browser-toggle-items-vs-collections').css('right', '82px');
		$('#browser-toggle-items-vs-collections').css('left', '');
	}
		
}

$(document).ready(function() {

	//set up fancybox lightbox plugin
	$(".fancymedia").fancybox({
		closeClick:false,
		nextClick:false,
		mouseWheel:false,
		fitToView:true,
		arrows:false,
		closeBtn:false,
		
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
	

	$('#database-search-button, ').click(function(){
		ZeegaBrowser.doSearch();
	});
	$( '#browser-form-search' ).bind('keypress', function(e){
	   if ( e.keyCode == 13 ) {
	     e.preventDefault();
	     ZeegaBrowser.doSearch();
	   }
	 });
	 $( '#database-search-filter' ).bind('change', function(e){
	     ZeegaBrowser.doSearch();
	 });
	
	

	//For filters - testing visual stuff - disabled
	//$('.time, .space').click( toggleFilterDrawer);

	//Set up toggling between My Media/All Media and Items/Collections
	$('#browser-toggle-items-vs-collections li, #browser-toggle-all-media-vs-my-media li,').click(function(){
		$(this).closest('li').removeClass('browser-unselected-toggle');
		$(this).closest('li').addClass('browser-selected-toggle');
		$(this).siblings().removeClass('browser-selected-toggle');
		$(this).siblings().addClass('browser-unselected-toggle');

		return false;
	});

	//Switches the results drawer between items and collections
	$('#browser-toggle-items-vs-collections li').click(function(){
		$('#browser-results-collections').toggle();
		$('#browser-results-items').toggle();
		ZeegaBrowser.renderResults();
		return false;
	});

	//makes call to server to load All Media vs. My Media
	$('#browser-toggle-all-media-vs-my-media li').click(function(){
		

		if ($(this).text() == "My Media"){
			ZeegaBrowser.search.set({user:-1});
		}else {

			ZeegaBrowser.search.set({user:-2});
		}
		ZeegaBrowser.doSearch();
	});

	$('#browser-create-new-collection').droppable({
			accept : '.browser-results-image',
			hoverClass : 'browser-create-new-collection-hover',
			tolerance : 'pointer',

			//this happens when you drop an item onto a collection
			drop : function( event, ui )
			{
				
				ui.draggable.draggable('option','revert',false);
				

				$(this).effect("highlight", {}, 3000);

				
				var newGuy = new BrowserCollection();

				newGuy.addNewItemID(ZeegaBrowser.draggedItem.id);
				
				newGuy.save({ title:'New fake collection ' + Math.floor(Math.random()*1000)}, 
							{
								success: function(model, response) { 
									ZeegaBrowser.myCollectionsModel.add(model);
									ZeegaBrowser.myCollectionsView.render();
				 				},
				 				error: function(model, response){
				 					console.log("Error creating a new collection.");
				 					console.log(response);
				 				}
				 			});
				
				
				
			}
		});
});
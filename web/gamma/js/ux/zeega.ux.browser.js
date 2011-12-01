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
	$(".fancybox").fancybox({
		
    	helpers : {
    		title : {
    			type : 'inside'
    		}
    	},
		
		/* This adds a custom element for styling the image caption */    
    	beforeLoad : function() {
    
            var elementID = $(this.element).attr('id');
           	var itemsCollection = ZeegaBrowser.search.get("itemsCollection");
           	var thisModel = itemsCollection.get(elementID);

           	var fancyView = new BrowserFancyBoxImageView({model:thisModel});
           	fancyView.render(this);

       
        }
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
	
	

	//For filters - testing visual stuff
	$('.time, .space').click( toggleFilterDrawer);

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

});
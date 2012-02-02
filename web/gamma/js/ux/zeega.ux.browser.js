/*

	ux.js
	
	the stuff in here should primarily be jQuery stuff that needs to be done after the dom is loaded
	Creating buttons, hovers, tabs, and other stuff here


*/

//	stuff that has to happen after the js fully loads

function initUX(){
	initHeaderUX();

	

}

/*
These functions are an extension to the jcarousel plugin so that the carousel can add and remove elements
and reset its state properly (something that's not included in default implementation! to my great chagrin!)

Feel free to move this to a more sensible location. 

-- Catherine
*/
$.jcarousel.fn.extend({
    removeAndAnimate: function(i) {

            var e = this.get(i);

            var d = this.dimension(e);

            if (i < this.first) this.list.css(this.lt, $.jcarousel.intval(this.list.css(this.lt)) + d + 'px');

            e.remove();
            this.options.size--;

            var di = this.options.visible != null ? Math.ceil(this.clipping() / this.options.visible) : null;
            var li = this.list.children('li');
            var self = this;

            if (li.size() > 0) {
                var wh = 0, i = this.options.offset;
                li.each(function() {
                    self.format(this, i++);
                    wh += self.dimension(this, di);
                });

                this.list.css(this.wh, wh + 'px');            
            }

            this.scroll(0,true);
            this.buttons();

        },
     addAndAnimate: function(e) {

            //var e = this.get(i);

            var d = this.dimension(e);

            if (i < this.first) this.list.css(this.lt, $.jcarousel.intval(this.list.css(this.lt)) + d + 'px');

            this.list.prepend(e);
            this.options.size++;

            var di = this.options.visible != null ? Math.ceil(this.clipping() / this.options.visible) : null;
            var li = this.list.children('li');
            var self = this;

            if (li.size() > 0) {
                var wh = 0, i = this.options.offset;
                li.each(function() {
                    self.format(this, i++);
                    wh += self.dimension(this, di);
                });

                this.list.css(this.wh, wh + 'px');            
            }

            this.scroll(0,true);
            this.buttons();

        }
});

$(document).ready(function() {


	// menu stuff
	$('.menu-toggle').click(function(){
		console.log('menu clikc')
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
		
		ZeegaBrowser.search.set({ 
							content:$(this).data('search-filter')
						});
		ZeegaBrowser.resetPageCount();
		ZeegaBrowser.doSearch();
		
		clearMenus();
		return false;
	});

	//Click event for collection filter
	$('#browser-collection-filter-tab').click(function(){
		
		ZeegaBrowser.doCollectionSearch(ZeegaBrowser.clickedCollectionID);
		ZeegaBrowser.showCollectionFilter();
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
		keys: {
				next: [ 34, 39, 40], //  page down, right arrow, down arrow
				prev: [ 33, 37, 38], //  page up, left arrow, up arrow
				close: [27] // escape key
		},
		
    	helpers : {
    		title : false,
    		buttons	: {}
    	},
    	beforeClose : function() {
    			//set video src to null to prevent browser bug
    			$('video').attr("src", null);

    	},
		
		/* This is where we decide which kind of content to put in the fancybox */    
    	beforeLoad : function() {
    
            var elementID = $(this.element).attr('id');
           	var itemsCollection = ZeegaBrowser.search.get("itemsCollection");
           	var thisModel = itemsCollection.get(elementID);
			var fancyView = null;

			switch(thisModel.get("source")){
				case 'Image':
					fancyView = new FancyBoxImageView({model:thisModel});
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
			}
        },
        
	});
	
	//Collection playback and editor connection
	$('#collection-player-button').click(function(){
		ZeegaBrowser.showShareButton(ZeegaBrowser.search.get("collection"));
		return false;
	
	}); 

	$('#collection-to-editor-button, #browser-open-in-editor').click(function(){
		ZeegaBrowser.goToEditor(ZeegaBrowser.search.get("collection"), ZeegaBrowser.clickedCollectionTitle);
		return false;
	});
	$( '#database-search-text' ).bind('focus', function(e){
	   
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
			$('#database-search-text').val("search my stuff");

		}else if ($(this).attr('id') == "browser-all-media"){
			$('#database-search-text').val("search everything");
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
		alert('implement in modal window');//Commenting out
		//using jeditable framework - pretend like user clicked on the title element
		//see ZeegaBrowser.showCollectionFilter for definition of behavior
		//$('#browser-collection-filter-tab-text').trigger('click');
	});
	
	//Load the next page of results into the results drawer
	$('#browser-view-more-item-results, #browser-view-more-collection-results').click(function(){
	 	ZeegaBrowser.search.set({page: ZeegaBrowser.search.get("page") + 1 });
	 	ZeegaBrowser.doSearch();
	 	return false;
	 });
});
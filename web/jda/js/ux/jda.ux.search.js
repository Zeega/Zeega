
$(document).ready(function(){
	
	jda.app.visualSearch = VS.init({
      container : $('.visual_search'),
      query     : '',
      callbacks : {
      	loaded	: function(){

      	},
        search       : function(){	
        	jda.app.search({page:1});	
        },
        clearSearch : jda.app.clearSearchFilters,
        // These are the facets that will be autocompleted in an empty input.
		  facetMatches : function(callback) {
		    callback([
		      'tag', 'keyword', 'text'
			/*{ label: 'city',    category: 'location' },
		      { label: 'address', category: 'location' },
		      { label: 'country', category: 'location' },
		      { label: 'state',   category: 'location' },*/
		    ]);
		  },
        	// These are the values that match specific categories, autocompleted
		  // in a category's input field.  searchTerm can be used to filter the
		  // list on the server-side, prior to providing a list to the widget.
		  valueMatches : function(facet, searchTerm, callback) {
		    switch (facet) {
		    /*case 'account':
		        callback([
		          { value: '1-amanda', label: 'Amanda' },
		          { value: '2-aron',   label: 'Aron' },
		          { value: '3-eric',   label: 'Eric' },
		          { value: '4-jeremy', label: 'Jeremy' },
		          { value: '5-samuel', label: 'Samuel' },
		          { value: '6-scott',  label: 'Scott' }
		        ]);
		        break;*/
		      case 'tag':
		        callback([]);
		        break;
		      case 'keyword':
		        callback([]);
		        break;
		      case 'text':
		        callback([]);
		        break;
		     
		    }
		  }
      }
    });
	
	//IMPORTANT - updates Search UI box with the search query from URL
	jda.app.updateSearchUI(jda.app.itemViewCollection.getSearch());
	
	$("#search-bar").fadeTo('slow',1);

	$('#content').change(function(){
		$('#select-wrap-text').text( $('#content option[value=\''+$('#content').val()+'\']').text() );
		jda.app.search({ page:1});
		return false;
	});

	
	$('#search-filters a').click(function(){
		$(this).siblings().show();
		$(this).hide();
		jda.app.switchViewTo( $(this).data('goto-view') );
		
		return false;
	});
	
	//Infinite Scroll
    jda.app.killScroll = false; 
    $(window).scroll(function(){ 
            if  (jda.app.isLoading == false && $(window).scrollTop()+200 >= ($(document).height() - ($(window).height()))){ 
                    if (jda.app.killScroll == false) { // Keeps the loader from fetching more than once.
                            jda.app.killScroll = true; // IMPORTANT - Set killScroll to true, to make sure we do not trigger this code again before it's done running.
                         
                            jda.app.search({ page: jda.app.itemViewCollection.collection.search.page+1 });

                    }
            }
    });
	

	//Sets variable for Fancybox "more" view to false each time the page is reloaded
	sessionStorage.setItem('moreFancy', false);

	//set up fancybox lightbox plugin
	
	
	$(".list-fancymedia").fancybox({
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
    		title : false,
    		buttons: {
    			prev : $('zeega-fancybox-buttons').find('.zeega-btnPrev'),
				next : $('zeega-fancybox-buttons').find('.zeega-btnNext'),
    		}
    		
    	},
    	beforeClose : function() {

    			if (this.fancyView !=null){
    				this.fancyView.beforeClose();
    			}
    			//set video src to null to prevent browser bug
    			$('video').attr("src", null);

    	},
    	afterShow : function(){
    		this.fancyView.afterShow();
    	},

		/* This is where we decide which kind of content to put in the fancybox */    
    	beforeLoad : function() {
    		console.log('tryin ta lod');
    		$('#fancybox-document-cloud').remove();

    		
            var elementID = $(this.element).attr('id');
            console.log(elementID);
           	var thisModel = jda.app.itemViewCollection.collection.get(elementID);
			this.fancyView = null;

			switch(thisModel.get("media_type")){
				case 'Image':
					this.fancyView = new FancyBoxImageView({model:thisModel});
           			this.fancyView.render(this);
           			break;
           		case 'Video':
           			this.fancyView = new FancyBoxVideoView({model:thisModel});
           			this.fancyView.render(this);
           			break;
           		case 'Audio':
           			this.fancyView = new FancyBoxAudioView({model:thisModel});
           			this.fancyView.render(this);
           			break;
           		case 'Youtube':
           			this.fancyView = new FancyBoxYouTubeView({model:thisModel});
           			this.fancyView.render(this);
           			break;
           		case 'Tweet':
           			this.fancyView = new FancyBoxTweetView({model:thisModel});
           			this.fancyView.render(this);
           			break;
       			case 'Text':
	       			this.fancyView = new FancyBoxTestimonialView({model:thisModel});
	       			this.fancyView.render(this);
	       			break;
           		case 'Document':
           			this.fancyView = new FancyBoxDocCloudView({model:thisModel});
           			this.fancyView.render(this);
           			break;
           		case 'Website':
           			this.fancyView = new FancyBoxWebsiteView({model:thisModel});
           			this.fancyView.render(this);
           			break;
           		case 'PDF':
           			this.fancyView = new FancyBoxWebsiteView({model:thisModel});
           			this.fancyView.render(this);
           			break;
			}
        },
        
	});
	
	$(".map-fancymedia").fancybox({
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
    		title : false,
    		buttons: {}
    		
    	},
    	beforeClose : function() {

    			if (this.fancyView !=null){
    				this.fancyView.beforeClose();
    			}
    			//set video src to null to prevent browser bug
    			$('video').attr("src", null);

    	},
    	afterShow : function(){
    		this.fancyView.afterShow();
    	},

		/* This is where we decide which kind of content to put in the fancybox */    
    	beforeLoad : function() {
    	
    		$('#fancybox-document-cloud').remove();

    		
            var elementID = $(this.element).attr('id');
           	var thisModel = jda.app.mapViewCollection.collection.get(elementID);
			this.fancyView = null;

			switch(thisModel.get("media_type")){
				case 'Image':
					this.fancyView = new FancyBoxImageView({model:thisModel});
           			this.fancyView.render(this);
           			break;
           		case 'Video':
           			this.fancyView = new FancyBoxVideoView({model:thisModel});
           			this.fancyView.render(this);
           			break;
           		case 'Audio':
           			this.fancyView = new FancyBoxAudioView({model:thisModel});
           			this.fancyView.render(this);
           			break;
           		case 'Youtube':
           			this.fancyView = new FancyBoxYouTubeView({model:thisModel});
           			this.fancyView.render(this);
           			break;
           		case 'Tweet':
           			this.fancyView = new FancyBoxTweetView({model:thisModel});
           			this.fancyView.render(this);
           			break;
       			case 'Text':
	       			this.fancyView = new FancyBoxTestimonialView({model:thisModel});
	       			this.fancyView.render(this);
	       			break;
           		case 'Document':
           			this.fancyView = new FancyBoxDocCloudView({model:thisModel});
           			this.fancyView.render(this);
           			break;
           		case 'Website':
           			this.fancyView = new FancyBoxWebsiteView({model:thisModel});
           			this.fancyView.render(this);
           			break;
           		case 'PDF':
           			this.fancyView = new FancyBoxWebsiteView({model:thisModel});
           			this.fancyView.render(this);
           			break;
			}
        },
        
	});
	
});
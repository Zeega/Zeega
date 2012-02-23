
$(document).ready(function(){
	$('#search-bar').find('input').focus(function(){
		$(this).attr("placeholder", "");
	});
	$('#search-bar').find('input').keydown(function(e){
		// Bind searching to search field
		if (e.which == 13)
		{
			jda.app.search({ query:$(this).val(), content:$('#content').val() });
			return false;
		}
	});
	$('#content').change(function(){
		var test = $('#search-bar').find('input[value!="search the archive"]').val();
		jda.app.search({ query:$('#search-bar').find('input[value!="search the archive"]').val(), content:$(this).val() });
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
            if  ($(window).scrollTop()+200 >= ($(document).height() - ($(window).height()))){ 
                    if (jda.app.killScroll == false) { // Keeps the loader from fetching more than once.
                            jda.app.killScroll = true; // IMPORTANT - Set killScroll to true, to make sure we do not trigger this code again before it's done running.
                            var page = jda.app.itemViewCollection.collection.search.page;
                            jda.app.search({ 	query:$('#search-bar').find('input[value!="search the archive"]').val(), 
                            					content:$('#content').val(), 
                            					page: jda.app.itemViewCollection.collection.search.page+1 
                            				});

                    }
            }
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
    		title : false,
    		
    	},
    	beforeClose : function() {
    			//set video src to null to prevent browser bug
    			
    			$('video').attr("src", null);

    	},

		/* This is where we decide which kind of content to put in the fancybox */    
    	beforeLoad : function() {
    
    		$('#fancybox-document-cloud').remove();

    		
            var elementID = $(this.element).attr('id');
           	var thisModel = jda.app.itemViewCollection.collection.get(elementID);
			var fancyView = null;

			switch(thisModel.get("media_type")){
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
           		case 'Tweet':
           			fancyView = new FancyBoxTweetView({model:thisModel});
           			fancyView.render(this);
           			break;
       			case 'Testimonial':
	       			fancyView = new FancyBoxTestimonialView({model:thisModel});
	       			fancyView.render(this);
	       			break;
           		case 'DocumentCloud':
           			fancyView = new FancyBoxDocCloudView({model:thisModel});
           			fancyView.render(this);
           			break;
           		case 'Website':
           			fancyView = new FancyBoxWebsiteView({model:thisModel});
           			fancyView.render(this);
           			break;
           		case 'PDF':
           			fancyView = new FancyBoxWebsiteView({model:thisModel});
           			fancyView.render(this);
           			break;
			}
        },
        
	});
	
});
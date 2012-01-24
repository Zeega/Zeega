var FancyBoxView = Backbone.View.extend({
	
	initialize: function(){
		
		this.el = $("#fancybox-media-container-template").clone();
		this.el.attr('id', 'fancybox-media-container');

		//Load the item's tags so we can display and edit them
		this.model.loadTags();
		
	},
	moreView : function(theElement){
		sessionStorage.setItem('moreFancy', true);

		theElement.find('.fancybox-more-button').hide();
		theElement.find('.fancybox-less-button').show();
		theElement.find(".fancybox-media-item").addClass("fancybox-media-item-more");
		theElement.addClass("fancybox-media-container-more");
		theElement.find('.description').show();
		theElement.find('.tags').show();
	},
	lessView : function( theElement){
		sessionStorage.setItem('moreFancy', false);

		theElement.find('.fancybox-more-button').show();
		theElement.find('.fancybox-less-button').hide();
		theElement.find('.description').hide();
		theElement.find('.tags').hide();
		theElement.find(".fancybox-media-item").removeClass("fancybox-media-item-more");
		theElement.removeClass("fancybox-media-container-more");
	},
	render: function(obj)
	{
		this.el.find('.source a').attr('href', this.model.get('attribution_uri'));
		this.el.find('.title').text( this.model.get('title'));
		this.el.find('.creator').text( this.model.get('media_creator_username'));
		this.el.find('.description').text( this.model.get('description'));
		
		
		//Fancybox will remember if user was in MORE or LESS view
		if (sessionStorage.getItem('moreFancy') == "true"){
			this.moreView(this.el);
		} else {
			this.lessView(this.el);
		}


		var item = this.model;
		var theElement = this.el;
		var view = this;
		
		//MORE/LESS buttons
		this.el.find('.fancybox-more-button, .fancybox-less-button').click(function(e){
			
			//Fancybox will remember if user was in MORE or LESS view
			var fancyVar = sessionStorage.getItem('moreFancy');
			if (sessionStorage.getItem('moreFancy') == "true"){
				view.lessView(theElement);
				e.preventDefault();
			} else {
				view.moreView(theElement);
				e.preventDefault();
			}

		});
		//EDIT TITLE
		this.el.find('.title').editable(
			function(value, settings)
			{ 
				item.save({ title:value }, 
						{
							success: function(model, response) { 
								console.log("Updated item title for item " + item.id);
			 				},
			 				error: function(model, response){
			 					
			 					console.log("Error updating item title.");
			 					console.log(response);
			 				}
			 			});
				return value; //must return the value
			},
			{
				indicator : 'Saving...',
				tooltip   : 'Click to edit...',
				indicator : '<img src="images/loading.gif">',
				select : false,
				onblur : 'submit',
				width : 320,
				cssclass : 'fancybox-form'
		});
		//EDIT DESCRIPTION
		this.el.find('.description').editable(
			function(value, settings)
			{ 
				item.save({ description:value }, 
						{
							success: function(model, response) { 
								theElement.find('.description').text(item.get("description"));
								console.log("Updated item description for item " + item.id);
			 				},
			 				error: function(model, response){
			 					
			 					console.log("Error updating item description.");
			 					console.log(response);
			 				}
			 			});
				return value; //must return the value
			},
			{
				type 	: 'textarea',
				indicator : 'Saving...',
				tooltip   : 'Click to edit description...',
				indicator : '<img src="images/loading.gif">',
				select : false,
				onblur : 'submit',
				width : 250,
				cssclass : 'fancybox-form'
		});
		//EDIT CREATOR
		this.el.find('.creator').editable(
			function(value, settings)
			{ 
				item.save({ "media_creator_username":value }, 
						{
							success: function(model, response) { 
								console.log("Updated item creator for item " + item.id);
			 				},
			 				error: function(model, response){
			 					
			 					console.log("Error updating item creator.");
			 					console.log(response);
			 				}
			 			});
				return value; //must return the value
			},
			{
				indicator : 'Saving...',
				tooltip   : 'Click to edit...',
				indicator : '<img src="images/loading.gif">',
				select : false,
				onblur : 'submit',
				width : 200,
				cssclass : 'fancybox-form'
		});
		
		//DELETE button
		this.el.find('.fancybox-delete-button').click(function(e){
			var deleteURL = sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/items/"
						+ item.id;
			

			//DESTROYYYYYYYY
			item.destroy({	
				 				url : deleteURL,
								success: function(model, response) { 
									console.log("Deleted item " + item.id);	
									

									//close fancy box window
									jQuery.fancybox.close();
										
				 				},
				 				error: function(model, response){
				 					
				 					console.log("Error deleting item " + item.id);		
				 					console.log(response);
				 				}
		 					});
		 	e.preventDefault();
		});
		
		
		
		return this;
	},

});
// For displaying Images
var FancyBoxImageView = FancyBoxView.extend({
	
	initialize: function(){

		FancyBoxView.prototype.initialize.call(this); //This is like calling super()
		
	},
	/* Pass in the element that the user clicked on from fancybox. */
	render: function(obj)
	{
		
		//Call parent class to do captioning and metadata
		FancyBoxView.prototype.render.call(this, obj); //This is like calling super()
		
		//Fill in image-specific stuff
		var imageEl = $("#fancybox-image-template").clone();
		$(imageEl).attr('id', 'fancybox-image');
		var objSrc = $(obj.element).attr("href");
		$(imageEl).find('img').attr("src", objSrc);
		$(this.el).find('.fancybox-media-item').html(imageEl.html());

		//set fancybox content
		obj.content = this.el;
		return this;
	},

});
// For displaying HTML5 Video (not YouTube)
var FancyBoxVideoView = FancyBoxView.extend({
	
	initialize: function(){
		FancyBoxView.prototype.initialize.call(this); //This is like calling super()

	},
	/* Pass in the element that the user clicked on from fancybox. */
	render: function(obj)
	{
		
		FancyBoxView.prototype.render.call(this, obj); //This is like calling super()

		//Fill in video-specific stuff
		var videoEl = $("#fancybox-video-template").clone();
		$(videoEl).attr('id', 'fancybox-video');
		var objSrc = $(obj.element).attr("href");
		$(videoEl).find('video').attr("src", objSrc);
		$(this.el).find('.fancybox-media-item').html(videoEl.html());

		//set fancybox content
		obj.content = this.el;
		
		return this;
	},

});
// For displaying Audio
var FancyBoxAudioView = FancyBoxView.extend({
	
	initialize: function(){
		FancyBoxView.prototype.initialize.call(this); //This is like calling super()
		

	},
	/* Pass in the element that the user clicked on from fancybox.  */
	render: function(obj)
	{
		
		FancyBoxView.prototype.render.call(this, obj); //This is like calling super()
		
		//Fill in audio-specific stuff
		var audioEl = $("#fancybox-audio-template").clone();
		$(audioEl).attr('id', 'fancybox-audio');
		var objSrc = $(obj.element).attr("href");
		$(audioEl).find('audio').attr("src", objSrc);
		$(this.el).find('.fancybox-media-item').html(audioEl.html());

		//set fancybox content
		obj.content = this.el;
		
		return this;
	},

});

//For displaying YouTube
var FancyBoxYouTubeView = FancyBoxView.extend({
	
	initialize: function(){
		FancyBoxView.prototype.initialize.call(this); //This is like calling super()

	},
	/* Pass in the element that the user clicked on from fancybox. */
	render: function(obj)
	{
		
		FancyBoxView.prototype.render.call(this, obj); //This is like calling super()
		
		
		//Fill in youtube -specific stuff
		var youTubeEl = $("#fancybox-youtube-template").clone();
		$(youTubeEl).attr('id', 'fancybox-youtube');
		var youTubeSrc  = 'http://www.youtube.com/embed/' + $(obj.element).attr('href');
		$(youTubeEl).find('iframe').attr("src", youTubeSrc);
		$(this.el).find('.fancybox-media-item').html(youTubeEl.html());

		//set fancybox content
		obj.content = this.el;
		
		return this;
	},

});
var FancyBoxView = Backbone.View.extend({
	tagName:'div',
	initialize: function(){
		
		$(this.el).attr("id", "fancybox-media-container");
		var blanks = {
			sourceLink : this.model.get('attribution_uri'),
			title : this.model.get('title'),
			description : this.model.get('description'),
			creator : this.model.get('media_creator_username'),
		};
		
		//use template to clone the database items into
		var template = _.template( this.getTemplate() );
		
		//copy the cloned item into the el
		$(this.el).append( template( blanks ) );

		//Load the item's tags so we can display and edit them
		var theModel = this.model;
		var theElement = this.el;
		this.model.loadTags(
			this.renderTags(), 
			function(){
				console.log("Error loading tags for item " + theModel.id);
			
		});

		
	},
	moreView : function(theElement){
		sessionStorage.setItem('moreFancy', true);

		$(theElement).find('.fancybox-more-button').hide();
		$(theElement).find('.fancybox-less-button').show();
		$(theElement).find(".fancybox-media-item").addClass("fancybox-media-item-more");
		$(theElement).addClass("fancybox-media-container-more");
		$(theElement).find('.description').show();
		$(theElement).find('.tags').show();
		$(theElement).find('.addtags').show();
	},
	lessView : function( theElement){
		sessionStorage.setItem('moreFancy', false);

		$(theElement).find('.fancybox-more-button').show();
		$(theElement).find('.fancybox-less-button').hide();
		$(theElement).find('.description').hide();
		$(theElement).find('.tags').hide();
		$(theElement).find('.addtags').hide();
		$(theElement).find(".fancybox-media-item").removeClass("fancybox-media-item-more");
		$(theElement).removeClass("fancybox-media-container-more");
	},
	renderTags : function(){
		
		var tags = this.model.get("tags");
		for(var i=0;i<tags.length;i++){
			var tag = tags.at(i);
			var html = '<a class="fancybox-remove-tag" href=".">x</a><a class="tag" href=".">'+tag.get("tag_name")+'</a>';
			$(this.el).find('.tags').prepend(html);
		}
		//Show Tag Delete X's on Hover
		$(this.el).find('.tag').hover(
			function(){
				$(this).prev().show();
				$(this).addClass('tag-hover-class');
			},
			function(){
				$(this).prev().hide();
				$(this).removeClass('tag-hover-class');
			}
		);
		$(this.el).find('.fancybox-remove-tag').hover(
			function(){
				$(this).show();
				$(this).next().addClass('tag-hover-class');
			},
			function(){
				$(this).hide();
				$(this).next().removeClass('tag-hover-class');
			}
		);
			
	},
	render: function(obj)
	{
		
		/*
		THESE ARE SET UP IN INIT FUNCTION BC of tag loading - do we need to redo them here? Comment out for now.
		$(this.el).find('.source a').attr('href', this.model.get('attribution_uri'));
		$(this.el).find('.title').text( this.model.get('title'));
		$(this.el).find('.creator').text( this.model.get('media_creator_username'));
		$(this.el).find('.description').text( this.model.get('description'));
		*/
		//Fancybox will remember if user was in MORE or LESS view
		if (sessionStorage.getItem('moreFancy') == "true"){
			this.moreView(this.el);
		} else {
			this.lessView(this.el);
		}


		var item = this.model;
		var theElement = this.el;
		var view = this;
		
		//ADD TAG
		$(this.el).find('.newtag').editable(
			function(value, settings)
			{ 
				$(this).addClass('tag');
				$(this).removeClass('newtag');
				$(this).unbind("editable");
				/*item.save({ title:value }, 
						{
							success: function(model, response) { 
								console.log("Updated item title for item " + item.id);
			 				},
			 				error: function(model, response){
			 					
			 					console.log("Error updating item title.");
			 					console.log(response);
			 				}
			 			});*/
				return value; //must return the value
			},
			{
				indicator : 'Saving...',
				tooltip   : 'Click to add a tag.',
				indicator : '<img src="images/loading.gif">',
				select : true,
				onblur : 'submit',
				width : 200,
				cssclass : 'fancybox-form'
		});
		$(this.el).find('.addtags').click(function(e){
			$(theElement).find('.newtag').show();
			$(theElement).find('.newtag').trigger('click');
			
			e.preventDefault();
		});
		//MORE/LESS buttons
		$(this.el).find('.fancybox-more-button, .fancybox-less-button').click(function(e){
			
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
		$(this.el).find('.title').editable(
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
				width : 250,
				cssclass : 'fancybox-form'
		});
		//EDIT DESCRIPTION
		$(this.el).find('.description').editable(
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
		$(this.el).find('.creator').editable(
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
				width : 150,
				cssclass : 'fancybox-form'
		});
		
		//DELETE button
		$(this.el).find('.fancybox-delete-button').click(function(e){
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
	getTemplate : function()
	{
		
		var html =	'<div class="fancybox-media-item"></div>'+
					'<p class="title fancybox-editable"><%= title %></p>'+
					'<p><span class="creator fancybox-editable"><%= title %></span> <span class="source"><a href="<%= sourceLink %>" target="_blank">View Source</a></span></p>'+
					'<p class="description fancybox-editable"><%= description %></p>'+
					'<p class="tags"><a href="." class="fancybox-remove-tag">x</a><a href="." class="newtag">New tag 1, New tag 2</a></p>(<a href="." class="addtags fancybox-editable">add tag</a>)'+
					'<div class="fancybox-buttons" class="clearfix">'+
						'<p class="fancybox-more-button"><a href=".">more</a></p><p class="fancybox-less-button"><a href=".">less</a></p><p class="fancybox-delete-button"><a href=".">delete</a></p>'+
					'</div>';
								
		return html;
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
		var blanks = {
			src : $(obj.element).attr("href"),
			title : this.model.get('title'),
		};
		
		//use template to clone the database items into
		var template = _.template( this.getMediaTemplate() );
		
		//copy the cloned item into the el
		var imageHTML =  template( blanks ) ;

		$(this.el).find('.fancybox-media-item').html(imageHTML);

		//set fancybox content
		obj.content = $(this.el);
		return this;
	},
	getMediaTemplate : function()
	{
		
		var html =	'<div id="fancybox-image">'+
						'<img src="<%=src%>" title="<%=title%>" alt="<%=title%>"/>'+
					'</div>';
								
		return html;
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

		//Fill in media-specific stuff
		var blanks = {
			src : $(obj.element).attr("href"),
		};
		
		//use template to clone the database items into
		var template = _.template( this.getMediaTemplate() );
		
		//copy the cloned item into the el
		var mediaHTML =  template( blanks ) ;

		$(this.el).find('.fancybox-media-item').html(mediaHTML);

		//set fancybox content
		obj.content = $(this.el);
		
		return this;
	},
	getMediaTemplate : function()
	{
		
		var html =	'<div id="fancybox-video">'+
						'<video controls="true"  width="640px" preload><source src="<%=src%>"></video>'+
					'</div';
								
		return html;
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
		
		//Fill in media-specific stuff
		var blanks = {
			src : $(obj.element).attr("href"),
		};
		
		//use template to clone the database items into
		var template = _.template( this.getMediaTemplate() );
		
		//copy the cloned item into the el
		var mediaHTML =  template( blanks ) ;

		$(this.el).find('.fancybox-media-item').html(mediaHTML);

		//set fancybox content
		obj.content = $(this.el);
		
		return this;
	},
	getMediaTemplate : function()
	{
		
		var html =	'<div id="fancybox-audio">'+
					'<audio width="626px" controls="true" src="<%=src%>"></audio>'+
					'</div>';
								
		return html;
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
		
		//Fill in media-specific stuff
		var blanks = {
			src : 'http://www.youtube.com/embed/' + $(obj.element).attr("href"),
		};
		
		//use template to clone the database items into
		var template = _.template( this.getMediaTemplate() );
		
		//copy the cloned item into the el
		var mediaHTML =  template( blanks ) ;

		$(this.el).find('.fancybox-media-item').html(mediaHTML); 

		//set fancybox content
		obj.content = $(this.el);
		
		return this;
	},
	getMediaTemplate : function()
	{
		
		var html =	'<div id="fancybox-youtube">'+
					'<iframe class="youtube-player" type="text/html" width="626" height="385" src="<%=src%>" frameborder="0">'+
					'</iframe></div>';
								
		return html;
	},

});
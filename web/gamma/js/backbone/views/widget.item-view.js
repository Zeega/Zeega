//renders individual items in a search be they collection or image or audio or video type
var BookmarkletItemView = Backbone.View.extend({
    el : $("#item-view"),
    
	initialize: function()
	{
		console.log("yo yo");
    	//Load the item's tags so we can display and edit them
    	//this.model.loadTags();
    },
	render: function()
	{
		this.el.find('.title').text( this.model.get('title'));
		this.el.find('.description').text( this.model.get('description'));
		console.log(this.el.find('.item-image'));
		this.el.find('.item-image').attr("src", this.model.get('thumbnail_url'));
		console.log(this.el.find('.item-image'));
		
		//this.el.find('.tags').text( 'Dummy tag, Another fake tag, tag tag, false longer tag');
		
		var item = this.model;
		var theElement = this.el;
		var view = this;
		//EDIT TITLE
		this.el.find('.title').editable(
			function(value, settings)
			{ 
				item.save({ title:value }, 
				{
					success: function(model, response) 
					{ 
						console.log("Updated item title for item " + item.id);
					},
					error: function(model, response)
					{
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
		/*
		//MORE button
		this.el.find('.fancybox-more-button').click(function(e){
			
			if ($(this).find('a').text() == "more"){
				view.moreView(this, theElement);
				e.preventDefault();
			} else {
				view.lessView(this, theElement);
				e.preventDefault();
			}

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
		*/
		
		
		return this;

	},
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
	},
});
/*
var BrowserFancyBoxView = BrowserItemView.extend({
    
	initialize: function()
	{
		this.el = $("#fancybox-media-container-template").clone();

		//Load the item's tags so we can display and edit them
		this.model.loadTags();
	},
	moreView : function(theButton, theElement){
		Zeega.moreFancy = true;

		$(theButton).find('a').text("less");
		theElement.find(".fancybox-media-item").addClass("fancybox-media-item-more");
		theElement.addClass("fancybox-media-container-more");
		theElement.find('.description').show();
		theElement.find('.tags').show();
	},
	lessView : function(theButton, theElement){
		Zeega.moreFancy = false;

		$(theButton).find('a').text("more");
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
		//this.el.find('.tags').text( 'Dummy tag, Another fake tag, tag tag, false longer tag');
		
		//Fancybox will remember if user was in MORE or LESS view
		if (Zeega.moreFancy){
			this.moreView($(this).find('a'), this.el);
		} else {
			this.lessView($(this).find('a'), this.el);
		}


		var item = this.model;
		var theElement = this.el;
		var view = this;
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
		//MORE button
		this.el.find('.fancybox-more-button').click(function(e){
			
			if ($(this).find('a').text() == "more"){
				view.moreView(this, theElement);
				e.preventDefault();
			} else {
				view.lessView(this, theElement);
				e.preventDefault();
			}

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
 */



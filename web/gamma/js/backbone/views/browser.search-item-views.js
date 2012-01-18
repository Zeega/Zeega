//renders individual items in a search be they collection or image or audio or video type
var BrowserItemView = Backbone.View.extend({
	
	
	initialize : function() {
		
		
		
	},
	
	render: function()
	{
		
		

		return this;
	},
	
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
	
	
});
var BrowserCollectionView = BrowserItemView.extend({
	
	initialize : function() {

		this.model.bind('change',  this.render, this);

		this.el = $("#browser-results-collection-template").clone();
		this.el.removeAttr('id');

		var thisView = this;

		var modelID = this.model.id;
		var modelTitle = this.model.get('title');
		this.el.click(function(){
			ZeegaBrowser.clickedCollectionTitle = modelTitle;
			ZeegaBrowser.doCollectionSearch(modelID);
			
		});
		
		/*
			Collections are both draggable and droppable. You can drag a collection into
			another collection.

			TODO: Add permissions to this so that you can only add collections to your own collections??
		*/

	$(this.el).draggable({
			distance : 10,
			cursor : 'crosshair',
			appendTo : 'body',
			cursorAt : { 
				top : -5,
				left : -5
			},
			opacity : .75,
			//helper : 'clone',
			helper : function(){
				var drag = $(this).find('.browser-img-large')
					.clone()
					.css({
						'overflow':'hidden',
						'background':'white'
					});
				return drag;
			},
			
			//init the dragged item variable
			start : function(){
				$(this).draggable('option','revert',true);
				ZeegaBrowser.draggedItem = thisView.model;
			},
				
			/**	stuff that happens when the user drags the item into a node **/	
				
			stop : function(){
				ZeegaBrowser.draggedItem = null;
			}
			
		});

		$(this.el).droppable({
			accept : '.browser-results-image, .browser-results-collection',
			hoverClass : 'browser-add-item-to-collection-hover',
			tolerance : 'pointer',

			//this happens when you drop an item onto a collection
			drop : function( event, ui )
			{
				
				ui.draggable.draggable('option','revert',false);
				
				$(this).find('img').attr("src", ZeegaBrowser.draggedItem.get("thumbnail_url"));
				$(this).find('.browser-item-count').text('Adding item...');
				
				if(ZeegaBrowser.draggedItem.id){
					thisView.model.addNewItemID(ZeegaBrowser.draggedItem.id);
					
			
					thisView.model.save({ }, 
								{
									success: function(model, response) { 
										console.log(response.collections.child_items_count);
										ZeegaBrowser.draggedItem = null;
										//Update items count
										model.set({'child_items_count':response.collections.child_items_count }); 
										ZeegaBrowser.myCollectionsView.render();
					 				},
					 				error: function(model, response){
					 					ZeegaBrowser.draggedItem = null;
					 					console.log("Error updating a collection with a new item.");
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
	},
	render: function()
	{
		
		this.el.addClass('browser-results-collection');
		
		//this.el.attr('id', this.model.id);
		
		
		
		this.el.find('img.browser-img-large').attr('src', (this.model.get('thumbnail_url') == null ? '' : this.model.get('thumbnail_url')));
		this.el.find('img.browser-img-large').attr('title', this.model.get('title'));

		this.el.find('img.browser-img-large').attr('alt', (this.model.get('thumbnail_url') == null ? this.model.get('title').substring(0,17) + '...' : this.model.get('title')));
		
		
		this.el.find('.browser-item-count').text(this.model.get('child_items_count') + ' items');
		//this.el.find('.browser-item-count').text('232');
		
		this.el.find('.title').text(this.model.get('title'));


		//Only show collections drop down menu if user owns collection
		var collectionID = this.model.id;
		var collectionTitle = this.model.get("title");
		var thisCollection =ZeegaBrowser.myCollections.get(collectionID);
		if (thisCollection == null){
			this.el.find('.corner-triangle-for-menu').remove();
		} else {
			var theElement = this.el;

			this.el.find('.corner-triangle-for-menu, .browser-collection-edit-menu').hover(
				function(){
					
					//calculate position dynamically based on text position
					//theElement.find('.browser-collection-edit-menu').css("left", $(this).width() + 15);
					theElement.find('.browser-collection-edit-menu').show();
					return false;
				}, 
				function(){
					theElement.find('.browser-collection-edit-menu').hide();
				}
			);

			
			

			//SHARE LINK
			this.el.find('.collection-player-button').click(function(){
				ZeegaBrowser.showShareButton(collectionID);
				return false;
			}); 
			//GO TO EDITOR LINK
			this.el.find('.collection-to-editor-button').click(function(){
				ZeegaBrowser.goToEditor(collectionID, collectionTitle);
				return false;
			});
			//DELETE LINK
			this.el.find('.browser-delete-collection').click(function(){
				ZeegaBrowser.deleteCollection(collectionID);
				return false;
			});
			//RENAME LINK
			this.el.find('.title').editable(
				function(value, settings)
				{ 

					value = ZeegaBrowser.editCollectionTitle(value, settings, collectionID);

				},
				{
					indicator : 'Saving...',
					tooltip   : 'Click to edit...',
					indicator : '<img src="images/loading.gif">',
					select : true,
					onblur : 'submit',
					width : $(this).attr("width") * 2,
					cssclass : 'browser-form'
			}).click(function(e) {
				theElement.find('.browser-collection-edit-menu').hide();
				//stop from selecting the collection filter at the same click
				e.stopPropagation();
	         	
	     	});
			this.el.find('.browser-rename-collection').click(function(e) {
				//using jeditable framework - pretend like user clicked on the title element
				theElement.find('.title').trigger('click');
				//stop from selecting the collection filter at the same click
				e.stopPropagation();
			});
		}
		
		return this;
	},

});
var BrowserSingleItemView = BrowserItemView.extend({
	
	initialize : function() {
		
		//when item removes itself from collection this gets fired
		this.model.bind('destroy', this.remove, this);
		
		var theModel = this.model;
		this.el = $("#browser-results-image-template").clone();
		$(this.el).draggable({
			distance : 10,
			cursor : 'crosshair',
			appendTo : 'body',
			cursorAt : { 
				top : 25,
				left : 25
			},
			opacity : .75,
			helper : 'clone',
			/*helper : function(){
				var drag = $(this).find('.browser-img-large')
					.clone()
					.css({
						'overflow':'hidden',
						'background':'white'
					});
				return drag;
			},*/
			
			//init the dragged item variable
			start : function(){
				$(this).draggable('option','revert',true);
				ZeegaBrowser.draggedItem = theModel;
			},
				
			stop : function(){
				ZeegaBrowser.draggedItem = null;
			}
			
		});

		
	},
	remove : function() {
		$(this.el).remove();
	},
	render: function()
	{
		if(this.model.get('thumbnail_url')) var thumbnail_url=this.model.get('thumbnail_url').replace('s.jpg','t.jpg');
		else var thumbnail_url=sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'gamma/images/thumb.png';
		//render individual element
		this.el.addClass('browser-results-image');
		this.el.removeAttr('id');
		this.el.find('a:first').attr('id', this.model.get('id'));
		this.el.find('a:first').attr('title', this.model.get('title'));
		this.el.find('img').attr('src', thumbnail_url);
		
		
		//this.el.find('img').attr('src', (this.model.get('thumbnail_url') == null ? '' : this.model.get('thumbnail_url')));
		this.el.find('a:first').attr('href', this.model.get('uri'));
		this.el.find('img').attr('title', this.model.get('title'));
		this.el.find('img').attr('alt', (this.model.get('thumbnail_url') == null ? this.model.get('title').substring(0,17) + '...' : this.model.get('title')));
		
		return this;
	},


});



var BrowserFancyBoxView = BrowserItemView.extend({
	
	initialize: function(){
		
		this.el = $("#fancybox-media-container-template").clone();
		this.el.attr('id', 'fancybox-media-container');
	},
	
	render: function(obj)
	{
		
		
		this.el.find('.source a').attr('href', this.model.get('attribution_uri'));
		this.el.find('.title').text( this.model.get('title'));
		this.el.find('.creator').text( this.model.get('media_creator_username'));
		
		//DELETE button
		var item = this.model;
		this.el.find('.fancybox-delete-button').click(function(e){
			var deleteURL = sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/items/"
						+ item.id;
			

			//DESTROYYYYYYYY
			item.destroy({	
				 				url : deleteURL,
								success: function(model, response) { 
									console.log("Deleted item " + item.id);	
									ZeegaBrowser.searchItemsView.collection.remove(item);

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
var BrowserFancyBoxImageView = BrowserFancyBoxView.extend({
	
	initialize: function(){

		BrowserFancyBoxView.prototype.initialize.call(this); //This is like calling super()
		
	},
	/* Pass in the element that the user clicked on from fancybox. */
	render: function(obj)
	{
		
		//Call parent class to do captioning and metadata
		BrowserFancyBoxView.prototype.render.call(this, obj); //This is like calling super()
		
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
var BrowserFancyBoxVideoView = BrowserFancyBoxView.extend({
	
	initialize: function(){
		BrowserFancyBoxView.prototype.initialize.call(this); //This is like calling super()

	},
	/* Pass in the element that the user clicked on from fancybox. */
	render: function(obj)
	{
		
		BrowserFancyBoxView.prototype.render.call(this, obj); //This is like calling super()

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
var BrowserFancyBoxAudioView = BrowserFancyBoxView.extend({
	
	initialize: function(){
		BrowserFancyBoxView.prototype.initialize.call(this); //This is like calling super()
		

	},
	/* Pass in the element that the user clicked on from fancybox.  */
	render: function(obj)
	{
		
		BrowserFancyBoxView.prototype.render.call(this, obj); //This is like calling super()
		
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
var BrowserFancyBoxYouTubeView = BrowserFancyBoxView.extend({
	
	initialize: function(){
		BrowserFancyBoxView.prototype.initialize.call(this); //This is like calling super()

	},
	/* Pass in the element that the user clicked on from fancybox. */
	render: function(obj)
	{
		
		BrowserFancyBoxView.prototype.render.call(this, obj); //This is like calling super()
		
		
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



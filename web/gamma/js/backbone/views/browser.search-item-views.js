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
		
		
		
		this.el.find('img').attr('src', (this.model.get('thumbnail_url') == null ? '' : this.model.get('thumbnail_url')));
		this.el.find('img').attr('title', this.model.get('title'));

		this.el.find('img').attr('alt', (this.model.get('thumbnail_url') == null ? this.model.get('title').substring(0,17) + '...' : this.model.get('title')));
		
		this.el.find('.browser-item-count').text(this.model.get('child_items_count') + ' items');
		//this.el.find('.browser-item-count').text('232');
		
		this.el.find('.title').text(this.model.get('title'));
		
		

		
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

// This is a parent class that takes care of image captions for ALL fancybox views

var BrowserFancyBoxView = BrowserItemView.extend({
	
	initialize: function(){
		this.el =$("#browser-fancybox-caption-template").clone();
		this.el.removeAttr('id');
	},
	/* Pass in the element that the user clicked on from fancybox. Fancy box
	uses the object's title as the caption so set that to the element in 
	the template */
	render: function(obj)
	{
		
		this.el.find('.source a').attr('href', this.model.get('attribution_uri'));
		this.el.find('.title').text( this.model.get('title'));
		this.el.find('.creator').text( this.model.get('media_creator_username'));
		
		obj.title = this.el.html();
		
		return this;
	},

});
// For displaying Images
var BrowserFancyBoxImageView = BrowserFancyBoxView.extend({
	
	initialize: function(){

		BrowserFancyBoxView.prototype.initialize.call(this); //This is like calling super()
		//this.content = $("#browser-fancybox-image-template").clone();
		//this.content.removeAttr('id');
	},
	/* Pass in the element that the user clicked on from fancybox. */
	render: function(obj)
	{
		
		BrowserFancyBoxView.prototype.render.call(this, obj); //This is like calling super()
		
		//var theImage = $(this.content).find("img");
		//$(theImage).attr("src", $(obj.element).attr("href"));

		//set object's content
		//obj.content = this.content.html(); 

		return this;
	},

});
// For displaying HTML5 Video (not YouTube)
var BrowserFancyBoxVideoView = BrowserFancyBoxView.extend({
	
	initialize: function(){
		BrowserFancyBoxView.prototype.initialize.call(this); //This is like calling super()
		this.content = $("#browser-fancybox-video-template").clone();
		this.content.removeAttr('id');

	},
	/* Pass in the element that the user clicked on from fancybox. */
	render: function(obj)
	{
		
		BrowserFancyBoxView.prototype.render.call(this, obj); //This is like calling super()
		
		var videoSrc  = $(obj.element).attr('href');

		this.content.find('source').attr( 'src', videoSrc);

		//Right now video only seems to work with mp4s. Or, at least, does not work with divx.
		obj.content = this.content.html(); 
		
		return this;
	},

});
// For displaying Audio
var BrowserFancyBoxAudioView = BrowserFancyBoxView.extend({
	
	initialize: function(){
		BrowserFancyBoxView.prototype.initialize.call(this); //This is like calling super()
		this.content = $("#browser-fancybox-audio-template").clone();
		this.content.removeAttr('id');

	},
	/* Pass in the element that the user clicked on from fancybox.  */
	render: function(obj)
	{
		
		BrowserFancyBoxView.prototype.render.call(this, obj); //This is like calling super()
		
		var audioSrc  = $(obj.element).attr('href');

		this.content.find('audio').attr('src', audioSrc);

		obj.content = this.content.html(); 
		
		return this;
	},

});

//For displaying YouTube
var BrowserFancyBoxYouTubeView = BrowserFancyBoxView.extend({
	
	initialize: function(){
		BrowserFancyBoxView.prototype.initialize.call(this); //This is like calling super()
		this.content = $("#browser-fancybox-youtube-template").clone();
		this.content.removeAttr('id');

	},
	/* Pass in the element that the user clicked on from fancybox. */
	render: function(obj)
	{
		
		BrowserFancyBoxView.prototype.render.call(this, obj); //This is like calling super()
		
		var youTubeSrc  = 'http://www.youtube.com/embed/' + $(obj.element).attr('href');

		this.content.find('iframe').attr('src', youTubeSrc);

		obj.content = this.content.html(); 
		
		return this;
	},

});



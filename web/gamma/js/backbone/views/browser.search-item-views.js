//renders individual items in a search be they collection or image or audio or video type
var BrowserItemView = Backbone.View.extend({
	
	
	initialize : function() {
		
		//listens for changes to its model, re-rendering
		this.model.bind('change', this.render, this);
    	this.model.bind('destroy', this.remove, this);
    	
		
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
		this.el = $("#browser-results-collection-template").clone();
		var thisView = this;
		$(this.el).droppable({
			accept : '.browser-results-image',
			hoverClass : 'browser-create-new-collection-hover',
			tolerance : 'pointer',

			//this happens when you drop an item onto a collection
			drop : function( event, ui )
			{
				
				ui.draggable.draggable('option','revert',false);
				
			
				$(this).effect("highlight", {}, 3000);
				$(this).find('.browser-item-count').text('Adding item...');
				$(this).animate({ opacity: 0.75}, 1000, function() {
					    $(this).find('.browser-item-count').text('20 items');
					    $(this).css('opacity', '1');
					  });
			
				thisView.model.addNewItemID(ZeegaBrowser.draggedItem.id);
				
				thisView.model.save({ }, 
							{
								success: function(model, response) { 
							
									//this should take care of incrementing item count?
									ZeegaBrowser.myCollectionsView.render();
				 				},
				 				error: function(model, response){
				 					console.log("Error updating a collection with a new item.");
				 					console.log(response);
				 				}
				 			});
				
			}
		});
	},
	render: function()
	{
		
		this.el.addClass('browser-results-collection');
		this.el.removeAttr('id');

		this.el.find('img').attr('src', (this.model.get('thumb_url') == null ? '' : this.model.get('thumb_url')));
		this.el.find('img').attr('title', this.model.get('title'));

		this.el.find('img').attr('alt', (this.model.get('thumb_url') == null ? this.model.get('title').substring(0,17) + '...' : this.model.get('title')));
		this.el.find('.browser-item-count').text('NULL items');
		this.el.find('.title').text(this.model.get('title'));

		return this;
	},

});
var BrowserSingleItemView = BrowserItemView.extend({
	
	initialize : function() {
		
		var theModel = this.model;
		this.el = $("#browser-results-image-template").clone();
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
				ZeegaBrowser.draggedItem = theModel;
			},
				
			/**	stuff that happens when the user drags the item into a node **/	
				
			stop : function(){
				ZeegaBrowser.draggedItem = null;
			}
			
		});
	},
	render: function()
	{
		
		//render individual element
		this.el.addClass('browser-results-image');
		this.el.removeAttr('id');
		this.el.find('a').attr('id', this.model.get('id'));
		this.el.find('a').attr('title', this.model.get('title'));
		this.el.find('img').attr('src', (this.model.get('thumb_url') == null ? '' : this.model.get('thumb_url')));
		this.el.find('a').attr('href', this.model.get('item_url'));
		this.el.find('img').attr('title', this.model.get('title'));
		this.el.find('img').attr('alt', (this.model.get('thumb_url') == null ? this.model.get('title').substring(0,17) + '...' : this.model.get('title')));
		
		return this;
	},


});

// For displaying caption when viewing single image in FancyBox
var BrowserFancyBoxImageView = BrowserItemView.extend({
	
	initialize: function(){
		this.el =$("#browser-fancybox-caption-template").clone();
	},
	/* Pass in the element that the user clicked on from fancybox. Fancy box
	uses the object's title as the caption so set that to the element in 
	the template */
	render: function(obj)
	{
		
		
		this.el.removeAttr('id');
		this.el.find('a').attr('href', this.model.get('attribution_url'));
		this.el.find('.title').text( this.model.get('title'));
		this.el.find('.creator').text( this.model.get('creator'));
		
		obj.title = this.el.html();
		
		return this;
	},

});
// For displaying caption when viewing VIDEO in FancyBox
var BrowserFancyBoxVideoView = BrowserItemView.extend({
	
	initialize: function(){
		this.el =$("#browser-fancybox-caption-template").clone();
	},
	/* Pass in the element that the user clicked on from fancybox. Fancy box
	uses the object's title as the caption so set that to the element in 
	the template */
	render: function(obj)
	{
		
		
		this.el.removeAttr('id');
		//this.el.find('.fancymedia').attr('src', '');
		this.el.find('a').attr('href', this.model.get('attribution_url'));
		this.el.find('.title').text( this.model.get('title'));
		this.el.find('.creator').text( this.model.get('creator'));
		
		var source  = $(obj.element).attr('href');

		//Right now video only seems to work with mp4s. Or, at least, does not work with divx and youtube vids.
		obj.content = '<video controls="true" height="480px" width="640px" preload><source src="'+source+'"></video>'; 
		obj.title = this.el.html();
		
		return this;
	},

});
// For displaying caption when viewing AUDIO in FancyBox
var BrowserFancyBoxAudioView = BrowserItemView.extend({
	
	initialize: function(){
		this.el =$("#browser-fancybox-caption-template").clone();
	},
	/* Pass in the element that the user clicked on from fancybox. Fancy box
	uses the object's title as the caption so set that to the element in 
	the template */
	render: function(obj)
	{
		
		
		this.el.removeAttr('id');
		//this.el.find('.fancymedia').attr('src', '');
		this.el.find('a').attr('href', this.model.get('attribution_url'));
		this.el.find('.title').text( this.model.get('title'));
		this.el.find('.creator').text( this.model.get('creator'));
		
		var source  = $(obj.element).attr('href');
		
		obj.content = '<audio controls="true" src="'+source+'"></audio>'; 
		obj.title = this.el.html();
		
		return this;
	},

});


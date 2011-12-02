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
			hoverClass : 'node-item-hover',
			tolerance : 'pointer',

			//this happens when you drop an item onto a collection
			drop : function( event, ui )
			{
				
				//that.model.noteChange();
				
				ui.draggable.draggable('option','revert',false);
				//make the new layer model
				/*var settings = {
					url: Zeega.url_prefix + 'nodes/'+ that.model.id +'/layers',
					type: Zeega.draggedItem.get('content_type'),
					zIndex: Zeega.currentNode.get('layers').length+1,
					attr: {
						'item_id' : Zeega.draggedItem.id,
						'title' : Zeega.draggedItem.get('title'),
						'url' : Zeega.draggedItem.get('item_url')
					}
				};
				var newLayer = new Layer( settings );
				
				Zeega.addLayerToNode(that.model,newLayer);
				*/
				//flash the layers tab
			
				$(this).effect("highlight", {}, 3000);
				$(this).find('.browser-item-count').text('Adding item...');
				$(this).animate({ opacity: 0.75}, 1000, function() {
					    $(this).find('.browser-item-count').text('20 items');
					    $(this).css('opacity', '1');
					  });
			
				thisView.model.addNewItemID(ZeegaBrowser.draggedItem.id);
				
				thisView.model.save({ title:'New fake collection' + Math.floor(Math.random()*1000)}, 
							{
								success: function(model, response) { 
									ZeegaBrowser.myCollectionsModel.add(model);
									ZeegaBrowser.myCollectionsView.render();
				 				},
				 				error: function(model, response){
				 					console.log("Error creating a new collection.");
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

		this.el.find('img').attr('src', (this.model.get('thumb_url') == null ? '404.jpg' : this.model.get('thumb_url')));
		this.el.find('img').attr('title', this.model.get('title'));

		this.el.find('img').attr('alt', (this.model.get('thumb_url') == null ? this.model.get('title').substring(0,17) + '...' : this.model.get('title')));
		this.el.find('.browser-item-count').text('NULL items');
		this.el.find('.title').text(this.model.get('title'));

		return this;
	},

});
var BrowserSingleItemView = BrowserItemView.extend({
	
	initialize : function() {
		
		
	},
	render: function()
	{
		var theModel = this.model;
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
		return this;
	},


});
var BrowserImageView = BrowserSingleItemView.extend({
	
	initialize : function() {
		this.el = $("#browser-results-image-template").clone();
		
	},
	render: function()
	{

		/*
		This is like calling "super" - it calls the render method of the 
		parent object - in this case BrowserSingleItemView - so we can put 
		functionality for all item views in the parent class.
		*/
		BrowserSingleItemView.prototype.render.call(this);

		//Then render individual element
		this.el.addClass('browser-results-image');
		this.el.removeAttr('id');
		this.el.find('a').attr('id', this.model.get('id'));
		this.el.find('a').attr('title', this.model.get('title'));
		this.el.find('img').attr('src', (this.model.get('thumb_url') == null ? '404.jpg' : this.model.get('thumb_url')));
		this.el.find('a').attr('href', this.model.get('item_url'));
		this.el.find('img').attr('title', this.model.get('title'));
		this.el.find('img').attr('alt', (this.model.get('thumb_url') == null ? this.model.get('title').substring(0,17) + '...' : this.model.get('title')));
		
		return this;
	},

});
// For displaying caption when viewing single image in FancyBox
var BrowserFancyBoxImageView = BrowserSingleItemView.extend({
	
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
var BrowserAudioView = BrowserSingleItemView.extend({
	
	initialize : function() {
		this.el = $("#browser-results-image-template").clone();
		
	},
	render: function()
	{
		
		this.el.addClass('browser-results-image');
		this.el.removeAttr('id');
		$('#browser-results-items').append(this.el);
		
		return this;
	},

});
var BrowserVideoView = BrowserSingleItemView.extend({
	
	initialize : function() {
		this.el = $("#browser-results-image-template").clone();
		
	},
	render: function()
	{
		
		this.el.addClass('browser-results-image');
		this.el.removeAttr('id');
		$('#browser-results-items').append(this.el);
		
		return this;
	},

});

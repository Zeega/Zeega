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
	tagName:"li",

	initialize : function() {

		this.model.bind('change',  this.render, this);


	},
	render: function()
	{
		$(this.el).empty();
		var blanks = {
			src : this.model.get('thumbnail_url'),
			title : this.model.get('title'),
			count : this.model.get('child_items_count'),
			
		};
		
		//use template to clone the database items into
		var template = _.template( this.getTemplate() );
		
		$(this.el).append( template( blanks ) );
		$(this.el).addClass('browser-results-collection');

		//Only show collections drop down menu if user owns collection
		var collectionID = this.model.id;
		var collectionTitle = this.model.get("title");
		var thisCollection =ZeegaBrowser.myCollections.get(collectionID);
		if (thisCollection == null){
			$(this.el).find('.corner-triangle-for-menu').remove();
		} else {
			var theElement = this.el;
			var theModel = this.model;
			
			$(this.el).find('.menu-items li a').click(function(){
				
				
				switch( $(this).data('action') )
				{
					case 'settings':
						
						
						$('#collection-settings-modal').find('.collection-modal-title').text(theModel.get('title'));
						
						
						$('#collection-settings-modal').find('#close-modal').click(function(){
							
							$('#collection-settings-modal').modal('hide');
						});
						$('#collection-settings-modal').find('#collection-modal-delete').click(function(){
							//need to unbind or else previous events are still attached and data gets messed up
							$(this).unbind();
							
							ZeegaBrowser.deleteCollection(theModel.id);
							$('#collection-settings-modal').modal('hide');
							return false;
						});
						
						$('#collection-settings-modal').find('.collection-modal-title').editable(
							function(value, settings)
							{ 

								return ZeegaBrowser.editCollectionTitle(value, settings, collectionID);

							},
							{
								indicator : 'Saving...',
								tooltip   : 'Click to edit...',
								indicator : '<img src="images/loading.gif">',
								select : true,
								onblur : 'submit',
								width: '250px',
								cssclass : 'modal-form'
						}).click(function(e) {
							
							e.stopPropagation();
				         	
				     	});
						$('#collection-settings-modal').find('#collection-modal-rename-link').click(function(e) {
							$(this).unbind();
							//using jeditable framework - pretend like user clicked on the title element
							$('#collection-settings-modal').find('.collection-modal-title').trigger('click');
							//stop from selecting the collection filter at the same click
							e.stopPropagation();
						});
						$('#collection-settings-modal').modal('show');
						
						break;
					case 'open-in-editor' :
						ZeegaBrowser.goToEditor(collectionID, collectionTitle);
						break
				}
				
				
				event.stopPropagation();
				
			});

		}

		var thisView = this;

		var modelID = this.model.id;
		var modelTitle = this.model.get('title');
		$(this.el).click(function(){
			ZeegaBrowser.clickedCollectionTitle = modelTitle;
			ZeegaBrowser.clickedCollectionID = modelID;
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
				
				var theElement = this;
				var oldThumbnail = $(theElement).find('img').attr("src");
				var oldCount = thisView.model.get('child_items_count');
				
				$(theElement).find('img').attr("src", ZeegaBrowser.draggedItem.get("thumbnail_url")).hide().fadeIn('slow');
				$(theElement).find('.browser-item-count').text('Adding item...');

				if(ZeegaBrowser.draggedItem.id){
					thisView.model.addNewItemID(ZeegaBrowser.draggedItem.id);
					
			
					thisView.model.save({ }, 
								{
									success: function(model, response) { 
										$(theElement).find('img').attr("src", oldThumbnail).hide().fadeIn('slow');
										
										//Alert user they added an item that's already in the collection
										if (oldCount == model.get('child_items_count')){
											$(theElement).find('.duplicate-item').show().fadeOut(3000);
										}
										ZeegaBrowser.draggedItem = null;
					
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
		
		return this;
	},
	
	events : {
		
		"mouseenter .corner-triangle-for-menu, .menu-items"   : "openMenu",
  		"mouseleave .corner-triangle-for-menu, .menu-items"   : "closeMenu"
	},
	
	openMenu : function()
	{
		/*var menu = $(this.el).find('.menu-toggle').next();
		if( menu.hasClass('open') ) menu.removeClass('open');
		else menu.addClass('open');
		*/
		var menu = $(this.el).find('.menu-items');
		$(menu).css("top", "-119px");
		$(menu).css("left", "5px");
		$(menu).css("position", "relative");
		
		$(this.el).find('.menu-items').show();
	},
	closeMenu : function()
	{
		
		$(this.el).find('.menu-items').hide();
	},

	
	getTemplate : function()
	{
		
		
		var html =	
					'<a href="#"><img class="browser-img-large" src="<%= src %>" alt="<%= title %> -- <%= count %> items" title="<%= title %> -- <%= count %> items"></a>'+
					'<a href="#" class="corner-triangle-for-menu"><!--<span class="zicon zicon-gear orange"></span>--></a><ul class="menu-items">'+
					'<li><a href="#" data-action="settings">settings</a></li>'+
					'<li><a href="#" data-action="open-in-editor">open in editor</a></li>'+
					'</ul>'+
					'<p><span class="title"><%= title %></span><br><span class="browser-item-count"><%= count %> items</span><br/><span class="duplicate-item">Duplicate item</span></p>';
								
		return html;
	},

});
var BrowserSingleItemView = BrowserItemView.extend({
	tagName:'li',
	initialize : function() {
		
		//when item removes itself from collection this gets fired
		this.model.bind('destroy', this.remove, this);
		
		
		

		
	},
	remove : function() {
		$(this.el).remove();
	},
	render: function()
	{
		var blanks = {
			src : this.model.get('thumbnail_url'),
			title : this.model.get('title'),
			link : this.model.get('uri'),
			id 	: this.model.get('id'),
		};
		
		//use template to clone the database items into
		var template = _.template( this.getTemplate() );
		
		//copy the cloned item into the el
		$(this.el).append( template( blanks ) );
		$(this.el).addClass('browser-results-image');

		/*
		OLD - WHAT WAS THIS FOR? Can't remember so commenting it out
		if(this.model.get('thumbnail_url')) var thumbnail_url=this.model.get('thumbnail_url').replace('s.jpg','t.jpg');
		else var thumbnail_url=sessionStorage.getItem('hostname') + sessionStorage.getItem('directory')+'gamma/images/thumb.png';
		*/
		
		/*OLD WAY//render individual element
		this.el.addClass('browser-results-image');
		this.el.removeAttr('id');
		this.el.find('a:first').attr('id', this.model.get('id'));
		this.el.find('a:first').attr('title', this.model.get('title'));
		this.el.find('img').attr('src', thumbnail_url);
		
		
		//this.el.find('img').attr('src', (this.model.get('thumbnail_url') == null ? '' : this.model.get('thumbnail_url')));
		this.el.find('a:first').attr('href', this.model.get('uri'));
		this.el.find('img').attr('title', this.model.get('title'));
		this.el.find('img').attr('alt', (this.model.get('thumbnail_url') == null ? this.model.get('title').substring(0,17) + '...' : this.model.get('title')));
		*/
		var theModel = this.model;
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
			
			//init the dragged item variable
			start : function(){
				$(this).draggable('option','revert',true);
				ZeegaBrowser.draggedItem = theModel;
			},
				
			stop : function(){
				ZeegaBrowser.draggedItem = null;
			}
			
		});
		return this;
	},
	getTemplate : function()
	{
		
		var html =	'<a id="<%= id %>" class="fancymedia fancybox.image" rel="group" title="<%= title %>" href="<%= link %>">'+
					'<img class="browser-img-large" src="<%= src %>" alt="<%= title %>" title="<%= title %>"></a>'+
					'<div class="browser-results-image-edit"><a class="browser-remove-from-collection" href=".">remove</a> <a class="browser-change-thumbnail" href=".">make cover</a>'+
					'</div>';
								
		return html;
	},

});







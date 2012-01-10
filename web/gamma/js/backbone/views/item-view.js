
var ItemView = Backbone.View.extend({
	tagName : 'li',
	//className :'database-asset',
	
	initialize : function() {},
	
	render: function()                 
	{
		var _this = this;

		var blanks = {
			type : this.model.get('type').toLowerCase(),
			title : this.model.get('title'),
			creator : this.model.get('media_creator_username'),
			thumbUrl : this.model.get('thumbnail_url')
		};
		//use template to clone the database items into

		var template = _.template( this.getTemplate() );
		//copy the cloned item into the el
		$(this.el).append( template( blanks ) );
		$(this.el).addClass('database-asset').attr( 'id','item-'+this.model.id );
		
		//drag drop functionality
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
			helper : function()
			{
				var drag = $(this).find('.item-thumbnail')
					.clone()
					.css({
						'height':'75px',
						'width':'75px',
						'overflow':'hidden',
						'background':'white'
					});
				return drag;
			},
			
			//init the dragged item variable
			start : function(){
				$(this).draggable('option','revert',true);
				Zeega.draggedItem = _this.model;
			},
				
			/**	stuff _this happens when the user drags the item into a node **/	
				
			stop : function(){
				Zeega.draggedItem = null;
			}
			
		});
		
		return this;
	},
	
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
	
	//item events
	previewItem: function(){
		var _this = this;
		
		$('#asset-preview').fadeIn();
		
		$('#asset-preview-media').empty();

		//uglyness this should be more like layers?
		var media = null;
		switch (_this.model.get('content_type'))
		{
			case 'Image':
				media = $('<img>').attr('src', _this.model.get('item_url') );
				break;
			case 'Video':
				media = $('<video>').attr('controls','controls');
				var src = $('<source>').attr('src',_this.model.get('item_url')).attr('type','video/mp4');
				media.append(src);
				//do stuff
				break;
			case 'Audio':
				media = $('<video>').attr('controls','controls');
				var src = $('<source>').attr('src',_this.model.get('item_url')).attr('type','video/mp4');
				media.append(src);
				break;
		}
		$('#asset-preview-media').append(media);
		
		//this needs to test for the type of media and place the appropriate image/player etc in there
		
		
		var metaTitle = $('<div>').addClass('meta-title').html(_this.model.get('title'));
		var metaAuthor = $('<div>').addClass('meta-author').html('Author: '+ _this.model.get('creator'));
		var l = $('<a>').attr('href',_this.model.get('attribution_url')).attr('target','blank').html('View Source');
		var metaLink = $('<div>').addClass('meta-link').append(l);
		
		$('#asset-preview-meta')
			.empty()
			.append(metaTitle)
			.append(metaAuthor)
			.append(metaLink);
		
	},
	
	getTemplate : function()
	{
		//html = '<div id="database-asset-template" class="hidden">';
		var html =	'<span class="item-icon zicon zicon-<%= type %>"></span>' +
					'<img class="item-thumbnail" src="<%= thumbUrl %>" height="25" width="25"/>' +
					//'<div class="item-delete" style="color:red; position:absolute; z-index:10; right:5px; font-weight:bold; display:none"></div>' +
					'<div class="item-title"><%= title %></div>' +
					'<div class="item-meta"><%= creator %></div>';
					//'</div>';
		return html;
	}
});

var ItemViewCollection = Backbone.View.extend({
	
	el : $('#database-item-list'),
	
	initialize : function(){
		
		console.log('itemViewCollection init')
		
		_(this).bindAll('add');
		this._itemViews = [];
		this._itemBundles = [];
		this.collection.each(this.add);
		this.collection.bind('add',this.add)
		this.render();
	},
	
	add : function(item)
	{
		
		console.log('item added')
		//a database item is never 'new' right?
		//it has to exist before it can be interacted with.
		//database items are created in XM or other tools
		var itemView = new ItemView({ model : item });
		this._itemViews.push(itemView);
		if(this._rendered) $(this.el).append(itemView.render().el);
		
	},
	
	append : function(items)
	{
		console.log('appending!');
				
		items.each(this.add);
		items.bind('add',this.add)
		this.render();
		
		insertPager( _.size(this._itemViews), Database.page );
	},
	
	render : function()
	{
		console.log('viewCRender')
		var _this = this;
		this.el.empty();
		
		//add EACH model's view to the _this.el and render it
		_.each( this._itemViews, function( itemView ){
			_this.el.append( itemView.render().el )
		});
		
		this._rendered = true;
		
		return this;
	}
	
});
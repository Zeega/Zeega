
var ItemView = Backbone.View.extend({
	tagName : 'li',
	
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
	previewItem: function()
	{

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
	
	initialize : function()
	{
		
		_(this).bindAll('add');
		this._itemViews = [];
		this._itemBundles = [];
		this.collection.each(this.add);
		this.collection.bind('add',this.add)
		this.collection.bind('reset',this.resetCollection, this)
		this.render();
	},
	
	add : function(item)
	{
		
		//a database item is never 'new' right?
		//it has to exist before it can be interacted with.
		//database items are created in XM or other tools
		var itemView = new ItemView({ model : item });
		this._itemViews.push(itemView);
		if(this._rendered) $(this.el).append(itemView.render().el);
		
	},
	
	resetCollection : function()
	{
		this._rendered = false;
		this._itemViews = [];
		this.el.empty();
		
		this.collection.each(this.add);
		
		this.render();
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
		var _this = this;
		this.el.empty();
		
		if( this._itemViews.length )
		{
			//add EACH model's view to the _this.el and render it
			_.each( this._itemViews, function( itemView ){
				_this.el.append( itemView.render().el )
			});
		}else{
			_this.el.append( $('<li class="alert-message error" style="text-align:center">').html('No Results') );
		}
		this._rendered = true;
		
		return this;
	}
	
});
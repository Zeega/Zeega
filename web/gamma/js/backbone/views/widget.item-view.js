//renders individual items in a search be they collection or image or audio or video type
var BookmarkletItemView = Backbone.View.extend({
    el : $("#item-view"),
    
	initialize: function()
	{
    	//Load the item's tags so we can display and edit them
    	//this.model.loadTags();
    	_.bindAll(this, "render", "toolClick");
    	this.model.view = this;
    },
    events: {
         "click #add-item": "toolClick",
    },
    toolClick : function() {
        console.log("Tool clicked");
    },
	render: function()
	{
		var item = this.model;
		var theElement = this.el;
		var view = this;
        
		this.el.find('#add-item').text("yo");
		this.el.find('#widget-title').text( this.model.get('title'));
		this.el.find('#widget-creator').text( this.model.get('media_creator_username'));
		this.el.find('#widget-description').text( this.model.get('description'));
		this.el.find('.item-image').attr("src", this.model.get('thumbnail_url'));
		this.el.find('.creator').text(this.model.get('media_creator_username'));
		
		//this.el.find('.tags').text( 'Dummy tag, Another fake tag, tag tag, false longer tag');
		
		// move to events (didn't work for me)
		this.el.find('#add-item').click(function(){
			item.set({id : null});
			item.save({ }, 
			{
				success: function(model, response) { 
			        $('#add-item').fadeOut();
			 	    $('#message').html('Media successfuly added to your Zeega Collection');
			 	    ZeegaWidget.itemCollection.add(item);
			 	},
			 	error: function(model, response){
        		    $('#message').html('Unable to add Media to your Zeega Collection');
			 	}
			});
			
			//item.collection = ZeegaWidget.itemCollection;
			//item.save();
			//view.model.url = sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + "api/import/persist";
			//ZeegaWidget.itemCollection.url = sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + "api/import/persist";
			//console.log(ZeegaWidget.itemCollection.url);
			//console.log(view.model);
		    //item = ZeegaWidget.itemCollection.create(view.model);
		    /*
			$(this).fadeOut();
			console.log(item.url);
			item.url = sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + "api/import/persist";
			item.save();
			ZeegaWidget.
		 	$('#message').html('Media successfuly added to your Zeega Collection');
    		return false;
    		*/
    	});
		
		this.editableSetup = {
				type 	: 'textarea',
				indicator : 'Saving...',
				tooltip   : 'Click to edit description...',
				indicator : '<img src="images/loading.gif">',
				select : false,
				onblur : 'submit'
		};
		console.log(typeof(this.editableSetup));
		//EDIT TITLE
		this.el.find('#widget-title').editable(
			function(value, settings)
			{ 
			console.log(item);
				item.set({title: value},{silent: true});
				return value; //must return the value
			},
			{
				type 	: 'textarea',
				indicator : 'Saving...',
				tooltip   : 'Click to edit description...',
				indicator : '<img src="images/loading.gif">',
				select : false,
				onblur : 'submit',
				width : 200,
				cssclass : 'fancybox-form'
		});
		//EDIT DESCRIPTION
		this.el.find('#widget-description').editable(
			function(value, settings)
			{ 
				item.set({description: value},{silent: true});
				return value; //must return the value
			},
			{
				type 	: 'textarea',
				indicator : 'Saving...',
				tooltip   : 'Click to edit description...',
				indicator : '<img src="images/loading.gif">',
				select : false,
				onblur : 'submit',
				width : 400,
				cssclass : 'fancybox-form'
		});
		//EDIT CREATOR
		this.el.find('#widget-creator').editable(
			function(value, settings)
			{ 
				item.set({media_creator_username: value},{silent: true});
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
		
		
		return this;

	},
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
	},
	getTemplate : function()
	{
		//html = '<div id="database-asset-template" class="hidden">';
		var html =	'<span class="item-icon show-in-list-view zicon zicon-<%= type %>"></span>' +
					'<img class="item-thumbnail" src="<%= thumbUrl %>"/>' +
					//'<div class="item-delete" style="color:red; position:absolute; z-index:10; right:5px; font-weight:bold; display:none"></div>' +
					'<div class="item-title show-in-list-view"><%= title %></div>';
					//'<div class="item-meta"><%= creator %></div>';
					//'</div>';
		return html;
	}
	
});

var BookmarkletCollectionItemView = Backbone.View.extend({
	tagName : 'span',
	
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
		$(this.el)
			.addClass('widget-asset-list')
			.attr({
				'id':'item-'+this.model.id,
				'data-original-title' : this.model.get('title'),
				'data-content' : 'created by: ' + this.model.get('media_creator_username')
			});
		
		return this;
	},
	
	getTemplate : function()
	{
		//html = '<div id="database-asset-template" class="hidden">';
		return '<img style="border: solid 1px white;" title="<%= title %>" src="<%= thumbUrl %>" width="80px" height="80px"/>';
	}
});


var BrowserItemViewCollection = Backbone.View.extend({
	
	el : $('#collection'),
	
	initialize : function()
	{
		console.log('itemViewCollection init')
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
		var itemView = new BookmarkletCollectionItemView({ model : item });
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
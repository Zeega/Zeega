/*
	- presents item results of a search
	- items might be images, video or audio
	- this is a collection of BrowserSingleItemViews
*/
var BrowserSearchCollectionsView = Backbone.View.extend({
	el: $('#browser-results-collections'),
	_views : [],
	

	initialize : function() {
		
		//listens for changes to its model, re-rendering
		//this.model.bind('change', this.render, this);
    	//this.model.bind('destroy', this.remove, this);

    	//this.model.bind('add',   this.addItem, this);
      	//this.model.bind('all',   this.render, this);

      	//this.collecion.bind();
      	this.collection.bind('add',   this.addItem, this);
      	
		this.collection.bind('reset', this.resetViews, this);
      	//this.model.updateQuery();

    	// _(this).bindAll('add');
        //this._itemViews.bind('add', this.add);
	},
	resetViews: function(){
		
		_.each(this._views, function(thisView){
			// item removes itself
        	thisView.remove(); 
        	
		});
		this._views = [];
	},
	addItem: function(m)
    {
    	
    	var collectionView = new BrowserCollectionView({ model: m });

        // add the item view to the set of views
        this._views.push(collectionView);

    },
	render: function()
	{	
		var displayVar = $(this.el).css('display');
		if (displayVar == "none"){
			//Update counts in UI
			$('#browser-collection-count').text(this.collection.totalCollectionsCount  + " collections");
		} else {

			

			_.each(this._views, function(collectionView){
				// item draws itself
	        	var addThis = collectionView.render(); 
	        	$(this.el).append(addThis.el);

	        	
			}, this);
			
			//Show more results link (TODO: only if search yields more than 100 total items)
			if (this.collection.length > 100){
				$('#browser-show-more-results').show();
			}
			//If they are loading "My Media" with no filters and there is nothing there, show this message
			if (	ZeegaBrowser.search.get("user") == -1 && ZeegaBrowser.search.get("q") =="" 
					&& ZeegaBrowser.search.get("content") == "all" && this.collection.length == 0){
				$('#browser-no-results-my-media-message').show();
			} else if (this.collection.length == 0){
				$('#browser-no-collections-results-message').show();
			}
			//Update counts in UI
			$('#browser-collection-count').text(this.collection.totalCollectionsCount  + " collections");

			
		}
		return this;
	},
	
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
});


var BrowserSearchItemsView = Backbone.View.extend({
	
	el: $('#browser-results-items'),
	_views : [],
	initialize : function() {
		
		//listens for changes to its model, re-rendering
		//this.model.bind('change', this.render, this);
    	//this.model.bind('destroy', this.remove, this);

    	//this.model.bind('add',   this.addItem, this);
      	//this.model.bind('all',   this.render, this);

      	//this.collecion.bind();
      	this.collection.bind('add',   this.addItem, this);
      	this.collection.bind("add", function(item) {
  			//console.log("Added item  " + item.get("content_type") + "!");
		});
		this.collection.bind('reset', this.resetViews, this);
      	//this.model.updateQuery();

    	// _(this).bindAll('add');
        //this._itemViews.bind('add', this.add);
	},
	resetViews: function(){
		_.each(this._views, function(thisView){
			// item removes itself
        	thisView.remove(); 
        	
		});
		this._views = [];
	},
	addItem: function(m)
    {
    	var type = m.get("type");
    	var itemView =  new BrowserSingleItemView({ model: m });
        
        // add the item view to this collection of views
        this._views.push(itemView);

    },
	render: function()
	{	

		//If the items drawer isn't showing then only render the item count
		if ($(this.el).css("display") == "none"){
			//Update counts in UI
			$('#browser-item-count').text(this.collection.totalItemsCount  + " items");
		} else {
			
			
			

			//Item renders itself and then this viewcollection appends it to its parent el
			_.each(this._views, function(itemView){
				// item draws itself
	        	var addThis = itemView.render(); 
	        	$(this.el).append(addThis.el);

	        	
			}, this);
			
			
			//Show more results link (TODO: only if search yields more than 100 total items)
			if (this.collection.length > 100){
				$('#browser-show-more-results').show();
			}
			
			//If they are loading "My Media" with no filters and there is nothing there, show this message
			if (	ZeegaBrowser.search.get("user") == -1 && ZeegaBrowser.search.get("q") =="" 
					&& ZeegaBrowser.search.get("content") == "all" && this.collection.length == 0){
				$('#browser-no-results-my-media-message').show();
			} else if (this.collection.length == 0){
				$('#browser-no-items-results-message').show();
			}

			//Update counts in UI
			$('#browser-item-count').text(this.collection.totalItemsCount  + " items");

			
		}
		return this;
	},
	
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
	
	
});


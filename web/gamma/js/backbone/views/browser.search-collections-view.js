/*
	- presents item results of a search
	- items might be images, video or audio
	- this is a collection of BrowserSingleItemViews
*/
var BrowserSearchCollectionsView = Backbone.View.extend({
	el: $('#browser-results-collections'),
	_views : [],
	

	initialize : function() {
		
      	this.collection.bind('add',   this.addItem, this);
      	this.collection.bind('remove',   this.removeItem, this);
		this.collection.bind('reset', this.resetViews, this);
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
    removeItem: function(m)
    {
    	/*for (var i=0;i<this._views.length;i++){
    		var thisView = this._views[i];
    		if (thisView.model == m) {
	    		thisView.remove(); 
    			this._views.splice(i,1);
    	}
    	*/
    	
    },
	render: function()
	{	
		var displayVar = $(this.el).css('display');
		if (displayVar == "none"){
			//Update counts in UI
			$('#browser-collection-count').text(this.collection.totalCollectionsCount  + " collections");
		} else {

			
			for (var i=0;i<this._views.length;i++){
				var collectionView = this._views[i];
				var addThis = collectionView.render(); 
	        	var moreResultsElement = $(this.el).find('#browser-view-more-collection-results');
	        	$(addThis.el).insertBefore(moreResultsElement);
			}
			
			//Show more results link if not all showing
			if (this.collection.length < this.collection.totalCollectionsCount){
				$('#browser-view-more-collection-results').show();
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
		
		
      	this.collection.bind('add',   this.addItem, this);
      	this.collection.bind('destroy',   this.removeItem, this);
		this.collection.bind('reset', this.resetViews, this);
      	
	},
	removeItem: function(){
		$('#browser-item-count').text(this.collection.totalItemsCount  + " items");
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
    	var itemView;
    	if (type == "Collection"){
    		itemView = new BrowserCollectionView({ model: m });
    	} else {
    	 	itemView =  new BrowserSingleItemView({ model: m });
    	}
        
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
	        	$(addThis.el).insertBefore($(this.el).find('#browser-view-more-item-results'));

	        	
			}, this);
			
			
			//Show more results link if not all showing
			if (this.collection.length < this.collection.totalItemsCount){
				$('#browser-view-more-item-results').show();
			} 
			
			//If they are loading "Everything" with no filters and there is nothing there, show this message
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
});


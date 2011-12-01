/*
	- presents item results of a search
	- items might be images, video or audio
	- this is a collection of BrowserItemViews 
*/
var BrowserSearchCollectionsView = Backbone.View.extend({
	el: $('browser-results-collections'),
	_views : [],

	initialize : function() {
		
		//listens for changes to its model, re-rendering
		//this.model.bind('change', this.render, this);
    	//this.model.bind('destroy', this.remove, this);

    	//this.model.bind('add',   this.addItem, this);
      	//this.model.bind('all',   this.render, this);

      	//this.collecion.bind();
      	this.collection.bind('add',   this.addItem, this);
      	this.collection.bind("add", function(collection) {
  			//console.log("Added collection!");
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
    	
    	var collectionView = new BrowserCollectionView({ model: m });

        // add the item view to the set of views
        this._views.push(collectionView);

    },
	render: function()
	{	
		//Show results drawer's loading spinner
		$('#browser-results .browser-loading').show();
		
		//Empty items and collections from results drawer
		$('#browser-results #browser-results-collections').empty();

		//Hide any previous results messages
		$('#browser-no-results-my-media-message').hide();
		$('#browser-no-collections-results-message').hide();

		_.each(this._views, function(collectionView){
			// item draws itself
        	collectionView.render(); 
        	
		});
		
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
		$('#browser-collection-count').text(this.collection.length + " collections");

		//Hide results drawer's loading spinner
		$('#browser-results .browser-loading').hide();
		
		return this;
	},
	
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
});


var BrowserSearchItemsView = Backbone.View.extend({
	
	el: $('browser-results-collections'),
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
    	var itemView = null;

    	switch(type){    		

    		case 'image':
    		itemView = new BrowserImageView({ model: m });
    		break;

    		case 'audio':
    		itemView = new BrowserAudioView({ model: m });
    		break;

    		case 'video':
    		itemView = new BrowserVideoView({ model: m });
    		break;
    	}
        
        // add the item view to this collection of views
        this._views.push(itemView);

    },
	render: function()
	{	
		//Show results drawer's loading spinner
		$('#browser-results .browser-loading').show();
		
		//Empty items and collections from results drawer
		$('#browser-results #browser-results-items').empty();

		//Hide any previous results messages
		$('#browser-no-results-my-media-message').hide();
		$('#browser-no-items-results-message').hide();

		for (var i=0; i<this._views.length; i++){
			var itemView = this._views[i];
			itemView.render();
		}
		
		
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
		$('#browser-item-count').text(this.collection.length + " items");

		//Hide results drawer's loading spinner
		$('#browser-results .browser-loading').hide();
		
		return this;
	},
	
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
	
	
});


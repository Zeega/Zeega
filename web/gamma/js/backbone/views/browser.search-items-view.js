//presents results of a search
var BrowserSearchItemsView = Backbone.View.extend({
	
	// ??? tagName: 'browser-results',

	//Cache of item views
	itemViews: [],


	initialize : function() {
		
		//listens for changes to its model, re-rendering
		//this.model.bind('change', this.render, this);
    	this.model.bind('destroy', this.remove, this);

    	this.model.bind('add',   this.addItem, this);
      	//this.model.bind('all',   this.render, this);

      	//this.collecion.bind();
      	this.model.bind("add", function(item) {
  			console.log("Added item  " + item.get("itemType") + "!");
		});
      	this.model.updateQuery();

    	// _(this).bindAll('add');
        //this._itemViews.bind('add', this.add);
	},
	addItem: function(m)
    {
        var itemView = new BrowserSearchItemView({
            model: m
        });
        
        // cache the view
        this.itemViews.push(itemView);

   

    },
	render: function()
	{	
		//Show results drawer's loading spinner
		$('#browser-results .browser-loading').show();
		
		//Empty items and collections from results drawer
		$('#browser-results #browser-results-items').empty();
		$('#browser-results #browser-results-collections').empty();

		_.each(this.itemViews, function(itemView){
			// item draws iteself
        	itemView.render(); 
        	
		});
		
		//Show more results link (TODO: only if search yields more than 100)
		$('#browser-show-more-results').show();

		//Update counts in UI
		$('#browser-item-count').text(this.model.itemCount + " items");
		$('#browser-collection-count').text(this.model.collectionCount + " collections");

		//Hide results drawer's loading spinner
		$('#browser-results .browser-loading').hide();
		
		return this;
	},
	
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
	
	
});


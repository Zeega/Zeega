
var MyCollectionsView = Backbone.View.extend({
	collection : MyCollections,
	el: $('#browser-my-collections-drawer'),
	_views : [],
	
	initialize : function() {
		this.collection.bind('add',   this.addCollection, this);
		
	},
	addCollection : function(m){
		var collectionView = new BrowserCollectionView({ model: m });
        this._views[m.id] = collectionView;
	},
	
	render: function()
	{
		//draw the collections
		
		_.each(this._views, function(collectionView){
				// item draws itself
				
	        	var addThis = collectionView.render(); 
	        	$(this.el).prepend(addThis.el);

	        	
			}, this);

		//draw the search items
		return this;
	},
	
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
	
	
});


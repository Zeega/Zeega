
var MyCollectionsView = Backbone.View.extend({
	
	el: $('#browser-my-collections-drawer'),
	_views : [],
	
	initialize : function() {
		this.collection.bind('add',   this.addCollection, this);
		this.collection.bind('reset',   this.addCollections, this);
		this.collection.bind('remove',   this.refreshViews, this);
		
	},
	refreshViews : function(m){
		this._views = [];
		this.addCollections();	
	},
	addCollection : function(m){
		var collectionView = new BrowserCollectionView({ model: m });
        this._views[m.id] = collectionView;
        var addThis = collectionView.render(); 
	    $(this.el).prepend(addThis.el);
	    $('#browser-my-collections-count').text("("+this.collection.length+")");
       
	},
	addCollections : function(){
		var mainColl = this.collection;

		for (var i=0; i<this.collection.length; i++){
			var myBrowserCollection = this.collection.at(i);
			var collectionView = new BrowserCollectionView({ model: myBrowserCollection });
	        this._views[myBrowserCollection.id] = collectionView;
		}
		/*_.each(mainColl, function(myBrowserCollection){
				// item draws itself
				console.log('why dont i get here????');
				var collectionView = new BrowserCollectionView({ model: myBrowserCollection });
	        	this._views[myBrowserCollection.id] = collectionView;
	        	
			}, this);*/
		
       this.render();
	},
	
	render: function()
	{
		//draw the collections
		
		_.each(this._views, function(collectionView){
				// item draws itself
				
	        	var addThis = collectionView.render(); 
	        	$(this.el).prepend(addThis.el);

	        	
			}, this);

		
		$('#browser-my-collections-count').text("("+this.collection.length+")");

		return this;
	},
	
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
	
	
});


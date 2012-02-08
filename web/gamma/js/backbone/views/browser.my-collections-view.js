
var MyCollectionsView = Backbone.View.extend({
	
	el: $('#browser-my-collections-drawer'),
	_views : [],
	
	initialize : function() {
		this.collection.bind('add',   this.addCollection, this);
		this.collection.bind('reset',   this.addCollections, this);
		this.collection.bind('remove',   this.removeCollection, this);
		
	},
	removeCollection : function(m){
		
		var oldView = this._views[m.id];
		var carouselIdx = $(oldView.el).attr('jcarouselindex');

		//remove from carousel
		ZeegaBrowser.carousel.removeAndAnimate( carouselIdx );

		this._views[m.id] = null;
		$('#browser-my-collections-count').text("("+this.collection.length+")");
	},
	refreshViews : function(m){
		this._views = [];
		this.addCollections();	
	},
	addCollection : function(m){
		var collectionView = new BrowserCollectionView({ model: m });
        this._views[m.id] = collectionView;
        
        var addThis = collectionView.render(); 
        
       //Add to carousel
        ZeegaBrowser.carousel.addAndAnimate(addThis.el);

       
	    $('#browser-my-collections-count').text("("+this.collection.length+")");

       
	},
	addCollections : function(){
		$(this.el).empty();

		var mainColl = this.collection;

		for (var i=0; i<this.collection.length; i++){
			var myBrowserCollection = this.collection.at(i);
			var collectionView = new BrowserCollectionView({ model: myBrowserCollection });
	        this._views[myBrowserCollection.id] = collectionView;
		}
		
       this.render();
       ZeegaBrowser.carousel.buttons();
	},
	
	render: function()
	{
		
		_.each(this._views, function(collectionView){
				// item draws itself
				
	        	var addThis = collectionView.render(); 
	        	$(this.el).prepend(addThis.el);

	        	
			}, this);
		
		$('#browser-my-collections-count').text("("+this.collection.length+")");

		//launch jcarousel if hasn't been launched yet
		if (ZeegaBrowser.carousel ==null){
			$(this.el).jcarousel({ initCallback:   ZeegaBrowser.mycarousel_initCallback});
		}
		
		return this;
	},
	
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
	
	
});



var MyCollectionsView = Backbone.View.extend({
	collection : MyCollections,
	el: $('#browser-my-collections'),
	_views : [],
	
	initialize : function() {
		this.collection.bind('add',   this.addCollection, this);
		
	},
	addCollection : function(m){
		var collectionView = new BrowserCollectionView({ model: m });

        // add the view to the set 
        this._views.push(collectionView);
	},
	render: function()
	{
		//draw the collections
		/*for (var i=0; i<3;i++){
			var template = $("#browser-results-collection-template").clone();
			template.addClass('browser-results-collection');
			template.removeAttr('id');
			template.insertAfter($("#browser-create-new-collection"));
		}*/
		_.each(this._views, function(collectionView){
				// item draws itself
	        	var addThis = collectionView.render(); 
	        	$(this.el).append(addThis.el);

	        	
			}, this);
		//draw the search items
		return this;
	},
	
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
	
	
});


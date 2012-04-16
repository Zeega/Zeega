/*
	This is for the MyCollections part of the interface. 
	It's a collection of BrowserCollection objects. Yup, a collection of collections.
*/
(function(Collection) {

	Collection.Collections = Backbone.View.extend({
		
		el: $('#browser-my-collections-drawer'),
		_views : [],
	
		initialize : function()
		{
			this.collection = new Collection.Collection();
			
			this.collection.bind('add', this.addCollection, this);
			this.collection.bind('reset', this.addCollections, this);
			this.collection.bind('remove', this.removeCollection, this);
		},
		
		removeCollection : function(m)
		{
			console.log(this._views);
			console.log(m);
			console.log(this._views[m.id]);
			var oldView = this._views[m.id];
			var carouselIdx = $(oldView.el).attr('jcarouselindex');

			//remove from carousel
			zeegaBrowser.app.carousel.removeAndAnimate( carouselIdx );

			this._views[m.id] = null;
			$('#browser-my-collections-count').text("("+this.collection.length+")");
		},
		
		refreshViews : function(m)
		{
			this._views = [];
			this.addCollections();	
		},
		
		addCollection : function(m)
		{
			var collectionView = new Collection.Views.Collection({ model: m });
			this._views[m.id] = collectionView;
			var addThis = collectionView.render(); 
			//Add to carousel
			zeegaBrowser.app.carousel.addAndAnimate(addThis.el);
			$('#browser-my-collections-count').text("("+this.collection.length+")");
		},
		
		addCollections : function()
		{
			$(this.el).empty();

			var mainColl = this.collection;

			for ( var i = 0 ; i < this.collection.length ; i++ )
			{
				var myBrowserCollection = this.collection.at(i);
				var collectionView = new Collection.Views.Collection({ model: myBrowserCollection });
		        this._views[myBrowserCollection.id]=collectionView;
			}
		
	       this.render();
	       //zeegaBrowser.app.carousel.buttons();
		},
	
		render: function()
		{
			_.each(this._views, function(collectionView){
				// item draws itself
				//console.log(collectionView)
				var addThis = collectionView.render(); 
				$(this.el).prepend(addThis.el);
				}, this);
		
			$('#browser-my-collections-count').text("("+this.collection.length+")");

			//launch jcarousel if hasn't been launched yet
			if (zeegaBrowser.app.carousel == null) {
				$(this.el).jcarousel({ initCallback: zeegaBrowser.app.mycarousel_initCallback });
			console.log('loading jcariusel');
			}
			return this;
		}
	
	});

	Collection.Collection = Backbone.Collection.extend({
		
		model: Collection.Model, 
	
		initialize : function()
		{
			var _this = this;
			$('#browser-my-collections').spin();
			
			// BOOTSTRAP THIS
			this.fetch({
				success : function(response)
				{
					console.log('collections count: '+ _this.length);
					$('#browser-my-collections').spin(false);
				}
			});
			
		},
		
		url : function()
		{
			return sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/search?user=-1&r_items=0&r_collections=1&r_itemswithcollections=0"
		},
	
		parse: function(data)
		{
			return data.collections;
		},
	
		comparator : function(myCollection)
		{
		  return myCollection.get("date_created");
		}
		
	});

	/*
		Nothing's better than a collection-collection
	*/
	Collection.CollectionCollection = Backbone.Collection.extend({
		model : Collection.CollectionModel,
		totalCollectionsCount : 0,
		/*,
		url: function(){
			return Zeega.url_prefix+"search/items/"+ this.offset +"/100";
		}
		*/

	});
	

})(zeegaBrowser.module("collection"));

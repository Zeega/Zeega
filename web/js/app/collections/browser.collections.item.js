(function(Items) {

	Items.MasterCollection = Backbone.View.extend({

		el : $('#browser-results-items'),

		initialize : function()
		{
			this.collection = new Items.Collection();
			this.collection.on('reset',this.reset,this);
			this._childViews = [];
			
			$(this.el).spin('small');
			//this.render();
		},
		
		render : function()
		{
			
			var _this = this;
			this._isRendered = true;
			
			$('#browser-item-count').text("Displaying " + this.collection.length + " of " + this.collection.totalItemsCount + " items");

			if(this.collection.length)
			{
				_.each( _.toArray(this.collection), function(itemModel){
					
					var itemView = new Items.Views.Item({ model : itemModel });
					_this._childViews.push( itemView );
					$(_this.el).append( itemView.render().el );
				})
			}
			else $(this.el).html('<li class="alert alert-error">No results :(</li>') // remove?
			
			$(this.el).fadeTo(100,1);
			$(this.el).spin(false);
			
			return this;
		},
		
		reset : function()
		{
			
			if ( this._isRendered )
			{
				$(this.el).empty();
				this._childViews = [];
				this.render();
			}
			else this.render();
		},

		append : function(items)
		{
			console.log('appending!');

			items.each(this.add);
			items.bind('add',this.add)
			//this.render();

			insertPager( _.size(this._itemViews), Database.page );
		},
		
		search : function(search,reset)
		{
			var _this = this;
			$(this.el).fadeTo(1000,0.5);
			$(this.el).spin('small');
			
			this.collection.setSearch(search,reset);
			this.collection.fetch({	add: 		(_this.collection.search.get("page") > 0),
									success: 	_this.success, 
									error: 		_this.errorFunction
								});

		},
		
		refresh : function()
		{
			$(this.el).fadeTo(1000,0.5);
			$(this.el).spin('small');
			this.collection.fetch({	add: 		(_this.collection.search.get("page") > 0),
									success: 	_this.success, 
									error: 		_this.errorFunction
								});
		},
		
		getSearch : function(){ return this.collection.search },

		success : function(){
			if(zeegaBrowser.app.items.collection.search.get("page") > 0){
		  		zeegaBrowser.app.items.reset();
		  	}
		    zeegaBrowser.app.killScroll = false;
		},
		errorFunction: function(){
		    console.log('error doing search');
		    zeegaBrowser.app.killScroll = false;
		 }


	});

	Items.Collection = Backbone.Collection.extend({

		model : Items.Model,

		totalItemsCount : 0,

		returnedItemsCount : 0,

		initialize : function()
		{
			this.search = new Items.Search();
			
			console.log('defined? '+ typeof itemsJSON )
			if( typeof itemsJSON != 'undefined' )
			{

				//get bootstrapped data if it exists
				var itemsBS = jQuery.parseJSON(itemsJSON);
				console.log('items exist');
				console.log(itemsBS)
				this.totalItemsCount = itemsBS.items_and_collections_count;
				this.reset( itemsBS.items_and_collections );
			}
			else
			{
				//if bootstrap doesn't exist, then default to a search
				var _this = this;
				this.fetch({
					success : function(response)
					{
						console.log('items count: '+ response.length ) // + works
						if (_this.search.get("page") <= 0){
							_this.trigger('reset');
						}
					}
				});
			}
		},
		
		url : function(){ return this.search.getUrl() },
		
		setSearch : function(search, reset)
		{
			if(reset) this.search = search;
			else _.extend(this.search,search)
		},

		parse : function(response)
		{
			this.returnedItemsCount = response.returned_items_and_collections_count;
			this.totalItemsCount = response.items_and_collections_count;
			return response.items_and_collections;
		}


	});

})(zeegaBrowser.module("items"));

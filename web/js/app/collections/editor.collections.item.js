(function(Items) {

	Items.ViewCollection = Backbone.View.extend({

		el : $('#database-item-list'),

		initialize : function()
		{
			this.collection = new Items.Collection();
			this.collection.on('reset',this.reset,this);
			this._childViews = [];
			
			$(this.el).spin('small');
			this.render();
		},
		
		render : function()
		{
			var _this = this;
			this._isRendered = true;
			
			if(this.collection.length)
			{
				_.each( _.toArray(this.collection), function(itemModel){
					var itemView = new Items.Views.List({model:itemModel});
					_this._childViews.push( itemView );
					$(_this.el).append( itemView.render().el );
				})
			}
			else
			{
				$(this.el).html('<li class="alert alert-error">No results :(</li>')
			}
			
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
		},

		append : function(items)
		{
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
			this.collection.fetch();
		},
		
		refresh : function()
		{
			$(this.el).fadeTo(1000,0.5);
			$(this.el).spin('small');
			this.collection.fetch();
		},
		
		getSearch : function(){ return this.collection.search }



	});

	Items.Collection = Backbone.Collection.extend({

		page : 0,
		totalItemsCount : 0,
		
		base : function()
		{
			return zeega.app.url_prefix + "api/search?r_items=1&r_itemswithcollections=0&site="+sessionStorage.getItem('siteid')+"&page="+ this.page
		},
		
		search : {},

		initialize : function()
		{
			if( itemsJSON )
			{

				//get bootstrapped data if it exists
				var itemsBS = jQuery.parseJSON(itemsJSON);
				this.totalItemsCount = itemsBS.items_count;
				this.reset( itemsBS.items );
			}
			else
			{
				//if bootstrap doesn't exist, then default to a search
				console.log( 'items NOT bootstrapped. Do search. ')
				this.fetch();
			}
		},
		
		url: function()
		{
			var url = this.base();
			if( !_.isUndefined(this.search.query) ) url += '&q=' + this.search.query;
			if( !_.isUndefined(this.search.contentType) ) url += '&content=' + this.search.contentType;
			if( !_.isUndefined(this.search.collectionID) && this.search.collectionID != 'all' ) url += '&collection=' + this.search.collectionID;
			return url;
		},
		
		setSearch : function(search, reset)
		{
			if(reset) this.search = search;
			else _.extend(this.search,search)
		},

		parse : function(response)
		{
			this.totalItemsCount = response.items_count;
			return response.items;
		}


	});

})(zeega.module("items"));

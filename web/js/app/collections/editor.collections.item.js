(function(Items) {

	Items.ViewCollection = Backbone.View.extend({

		el : $('#database-item-list'),

		initialize : function()
		{
			console.log('itemViewCollection init')
			_(this).bindAll('add');
			this._itemViews = [];
			this._itemBundles = [];
			this.collection.each(this.add);
			this.collection.bind('add',this.add)
			this.collection.bind('reset',this.resetCollection, this)
			this.render();
		},

		add : function(item)
		{

			//a database item is never 'new' right?
			//it has to exist before it can be interacted with.
			//database items are created in XM or other tools
			var itemView = new ItemView({ model : item });
			this._itemViews.push(itemView);
			if(this._rendered) $(this.el).append(itemView.render().el);

		},

		resetCollection : function()
		{
			this._rendered = false;
			this._itemViews = [];
			this.el.empty();

			this.collection.each(this.add);

			this.render();
		},

		append : function(items)
		{
			console.log('appending!');

			items.each(this.add);
			items.bind('add',this.add)
			this.render();

			insertPager( _.size(this._itemViews), Database.page );
		},

		render : function()
		{
			var _this = this;
			this.el.empty();

			if( this._itemViews.length )
			{
				//add EACH model's view to the _this.el and render it
				_.each( this._itemViews, function( itemView ){
					_this.el.append( itemView.render().el )
				});
			}else{
				_this.el.append( $('<li class="alert-message error" style="text-align:center">').html('No Results') );
			}
			this._rendered = true;

			return this;
		}

	});




	Items.Collection = Backbone.Collection.extend({

		page : 0,
		contentType : null,
		collectionID : null,
		query : null,
		totalItemsCount : 0,

		initialize:function(){

			this.bind('destroy',   this.decrementItemsCount, this);	
		},
		url: function()
		{
			var url = Zeega.url_prefix + "api/search?site="+sessionStorage.getItem('siteid')+"&page="+ this.page;
			if( !_.isNull(this.query) && this.query != "" ) url += '&q=' + this.query;
			if( !_.isNull(this.contentType) ) url += '&content=' + this.contentType;
			if( !_.isNull(this.collectionID) && this.collectionID != 'all' ) url += '&collection=' + this.collectionID;
			return url;
		},
		decrementItemsCount : function(){
			this.totalItemsCount = this.totalItemsCount - 1;
		},
		resetQuery : function()
		{
			this.page = 0;
			this.contentType = null;
			this.collecitonID = null;
			this.query = null;
		},

		parse : function(response)
		{
			this.count = response.items_count;
			return response.items;
		}


	});
	

	Items.Router = Backbone.Router.extend({ /* ... */ });


})(zeega.module("items"));

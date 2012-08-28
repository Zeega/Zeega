(function(Items) {

	Items.Model = Backbone.Model.extend({
		defaults : {
			title : 'Untitled'
		},

		url: function()
		{
			return sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + "api/items/" + this.id;
		},

		initialize : function()
		{
			this.databaseView = new Items.Views.List({model:this});
		}
	});


	Items.Collection = Backbone.Collection.extend({


		model: Items.Model,
		page : 0,
		totalItemsCount : 0,
		
		_views : [],
		target : $('#database-item-list'),
		
		searchObject : {},
		
		base : function()
		{
			return zeega.app.url_prefix + "api/search?r_items=1&r_itemswithcollections=0&user=-1&site="+sessionStorage.getItem('siteid')+"&page="+ this.page
		},
		
		url: function()
		{
			var url = this.base();
			if( !_.isUndefined(this.searchObject.query) ) url += '&q=' + this.searchObject.query;
			if( !_.isUndefined(this.searchObject.contentType) ) url += '&content=' + this.searchObject.contentType;
			if( !_.isUndefined(this.searchObject.collectionID) && this.searchObject.collectionID != 'all' )
			{
			    url += '&collection=' + this.searchObject.collectionID;
			    // hammering - collection filtering should not be done by user_id nor site_id
			    url = url.replace("&user=-1","");
			    url = url.replace("&site="+sessionStorage.getItem('siteid'),"");
			}
			return url;
		},

		initialize : function()
		{
			this.itemCollectionView = new Items.Views.ItemTrayCollectionView({collection:this});
			//this.itemCollectionView.render();
			console.log('$$		items', this)

			this.on('preview_item',this.previewItem,this); // move this
		},
		
		search : function(search,reset)
		{
			var _this = this;
			$(this.el).fadeTo(1000,0.5);
			$(this.el).spin('small');
			
			this.setSearch(search,reset);
			this.fetch({
				success : function(collection,response)
				{
					_this.target.fadeTo(1000,1).spin(false).empty();
					_this.renderCollection();
				}
			})
		},
		
		///// move this ////////////
		previewItem : function(itemID)
		{
			var viewer = new Items.Views.Viewer({collection:this,start:itemID});
			$('body').append(viewer.render().el);
			viewer.renderItemView();
		},
		
		renderCollection : function()
		{
			var _this = this;
			_.each( _.toArray(this), function(itemModel){
				var itemView = new Items.Views.List({model:itemModel});
				_this._views.push( itemView );
				_this.target.append( itemView.render().el );
			})
		},
		
		refresh : function()
		{
			var _this = this;
			this.fetch({
				success : function(collection,response)
				{
					_this.target.empty();
					_this.renderCollection();
				}
			})
		},
		
		setSearch : function(search, reset)
		{
			if(reset) this.searchObject = search;
			else _.extend(this.searchObject,search);
		},

		parse : function(response)
		{
			this.totalItemsCount = response.items_count;
			return response.items;
		}
	});

})(zeega.module("items"));

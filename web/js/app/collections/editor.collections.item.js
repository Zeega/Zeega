(function(Items) {

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

		initialize : function()
		{
			this.target.spin('small');
			if( itemsJSON )
			{
				//get bootstrapped data if it exists
				var itemsBS = jQuery.parseJSON(itemsJSON);
				this.totalItemsCount = itemsBS.items_count;
				this.reset( itemsBS.items );
				this.target.spin(false);
			}
			else
			{
				//if bootstrap doesn't exist, then default to a search
				console.log( 'items NOT bootstrapped. Do search. ')
				this.fetch();
			}
			this.renderCollection();
			
			this.on('preview_item',this.previewItem,this);
		},
		
		previewItem : function(itemID)
		{
			console.log('view item::::',itemID)
			
			var viewer = new Items.Views.Viewer({collection:this,start:itemID});
			$('body').append(viewer.render().el);
			
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

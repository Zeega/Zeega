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

	Items.SearchModel = Backbone.Model.extend({
		defaults : {
			query : '',
			page : 0,
			content : '',
			collection : '',
			user : '1',
			site : sessionStorage.getItem('siteid')
		},

		initialize : function(){ this.on('change', this.onChange, this ) },

// this.items.search.reset().set({q:'foo'})
		
		onChange : function()
		{
			console.log('$$		onchange', this)
			if(this.get('query') == '') this.reset();
			this.trigger('search');
		},

		reset : function( options )
		{
			var options = _.extend({silent:true}, options);
			this.set(this.defaults,options);
			return this;
		}
	})


	Items.Collection = Backbone.Collection.extend({

		model: Items.Model,
		page : 0,
		totalItemsCount : 0,

		url: function()
		{
			var base = zeega.app.url_prefix + "api/search?r_items=1&r_itemswithcollections=0&user=-1&site="+sessionStorage.getItem('siteid')+"&page="+ this.page;
			var queryTemplate = '<% if( query ){ %>&q=<%= query %><% } %><% if(content){ %>&content=<%= content %><% } %><% if(collection){ %>&collection=<%= collection %><% } %>';
			var url = base + _.template( queryTemplate, this.search.toJSON() );
			return url;
		},

		initialize : function()
		{
			this.itemCollectionView = new Items.Views.ItemTrayCollectionView({collection:this});

			this.search = new Items.SearchModel();
			this.search.on('search', this.onSearch, this );
			this.on('reset', this.onSearchSuccess, this);

//this.search.reset().set({query:'new'});

			this.on('preview_item',this.previewItem,this); // move this
		},
		
		onSearch : function()
		{
			this.fetch();
		},
		
		refresh : function(){ this.fetch() },

		///// move this ////////////
		previewItem : function(itemID)
		{
			var viewer = new Items.Views.Viewer({collection:this,start:itemID});
			$('body').append(viewer.render().el);
			viewer.renderItemView();
		},

		parse : function(response)
		{
			this.totalItemsCount = response.items_count;
			return response.items;
		}
	});

})(zeega.module("items"));

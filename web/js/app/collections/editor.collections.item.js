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
			page : 1,
			content : '',
			collection : '',
			user : '1',
			site : sessionStorage.getItem('siteid'),
			add : false
		},

		initialize : function(){ this.on('change', this.onChange, this ) },

// this.items.search.reset().set({q:'foo'})
		
		onChange : function()
		{
			console.log('$$		onchange', this)
			//if(this.get('query') == '') this.reset();
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
		totalItemsCount : 0,

		url: function()
		{
			var base = zeega.app.url_prefix + "api/search?r_items=1&sort=id-desc&r_itemswithcollections=0&user=-1&site="+sessionStorage.getItem('siteid');
			var queryTemplate = '&page=<%= page %><% if( query ){ %>&q=<%= query %><% } %><% if(content){ %>&content=<%= content %><% } %><% if(collection){ %>&collection=<%= collection %><% } %>';
			var url = base + _.template( queryTemplate, this.search.toJSON() );
			
			//temp fix until queuing is set up
		
			if(this.search.get('collection')==''&&this.search.get('page')==1&&this.search.get('query')==''&&this.search.get('content')=='') url = url+"&data_source=db";
			
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
			var _this = this;
			this.fetch({add: this.search.get('add')}).success(function(){
				_this.trigger('reset');
			});
		},
		
		incrementPage : function()
		{
			if(this.length < this.totalItemsCount)
			{
				var pageNo = this.search.get('page');
				pageNo++;
				this.search.set({ page:pageNo, add:true });
			}
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

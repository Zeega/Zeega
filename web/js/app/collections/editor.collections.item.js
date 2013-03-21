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
			user : '-1',
			site : sessionStorage.getItem('siteid'),
			add : false
		},

		initialize : function(){ this.on('change', this.onChange, this ); },
		
		onChange : function()
		{
			this.trigger('search');
		},
		reset : function( options )
		{

			var user=this.get('user');
			var opts = _.extend({silent:true}, options);
			this.set(this.defaults,opts);
			this.set({'user':user});
			this.trigger('search');
			return this;
		}
	});


	Items.Collection = Backbone.Collection.extend({

		model: Items.Model,
		totalItemsCount : 0,

		url: function()
		{
			var base;
			if($("#collection-selector").val() == -1 ){
				
				base = zeega.app.url_prefix + "api/items/search?sort=date-desc&user=-1";
			}  else if($("#collection-selector").val() == 1 ) {

				base = zeega.app.url_prefix + "api/items/search?sort=date-desc";
			} else {
				
				base = zeega.app.url_prefix + "api/items/search?sort=date-desc&collection=" + $("#collection-selector").val();
			}

			if(_.isUndefined(this.search.get('content'))||this.search.get('content')===""){
				this.search.set({"content":"-project AND -Collection"});
			}
			
			if(this.search.get('query') === '') {
				base = base + "&data_source=db";
			}



			var queryTemplate = '&page=<%= page %><% if( query ){ %>&q=<%= query %><% } %><% if(content){ %>&type=<%= content %><% } %><% if(collection){ %>&collection=<%= collection %><% } %>';
			var url = base + _.template( queryTemplate, this.search.toJSON() );
			return url;
		},

		initialize : function()
		{
			this.itemCollectionView = new Items.Views.ItemTrayCollectionView({collection:this});
			this.search = new Items.SearchModel();
			this.search.on('search', this.onSearch, this );
			this.on('reset', this.onSearchSuccess, this);
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

		refresh : function(){ this.fetch(); },

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

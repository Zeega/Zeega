(function(Items) {

	Items.ViewCollection = Backbone.View.extend({
	
		el : $('#items-list'),
	
		initialize : function()
		{
			var _this = this;
			this.collection = new Items.Collection();
			this.collection.on( 'reset', this.reset, this)
			this._childViews = [];
		
			$('#spinner').spin('small');

		},
	
		render : function()
		{
			var _this = this;

			_this._isRendered = true;
			_.each( _.toArray(this.collection), function(item){
				var itemView = new Items.Views.List({model:item});
				_this._childViews.push( itemView );
				$(_this.el).append( itemView.render().el );
			})

			
			//$(this.el).fadeTo(100,1);
			//$("#results-count").fadeTo(100,1);
			$('#spinner').spin(false);
			$('#results-count').show();
			$(this.el).show();
			return this;
		},

		renderTags : function(tags){
			$("#related-tags ul").empty();
			if (tags.length > 0){
				_.each( _.toArray(tags), function(tag){
					var li = '<li><a href=".">'+tag.name+'</a></li>';
					$("#related-tags ul").append(li);
					$("#related-tags li").filter(":last").click(function(){
						jda.app.search({ 	
                            					tags: tag.name,
                            					page:1, 
                            				});
						return false;
					});
				})
				$("#related-tags").show();
			} else {
				$("#related-tags").hide();
			}
		},
		

		reset : function()
		{
			if ( this._isRendered )
			{
				_.each( this._childViews, function(view){ $(view.el).remove() })
				this._childViews = [];
				this.render();
			}
		},
		
		search : function(obj,reset)
		{
			var _this = this;
			//$("#results-count").fadeTo(1000,0.5);
			//$(this.el).fadeTo(1000,0.5);
			if (obj.page == 1) {$(this.el).hide();}
			$('#spinner').spin('small');
			$('#results-count').hide();
			$('#related-tags').hide();
			var hash = '';
			if( !_.isUndefined(obj.query) && obj.query.length > 0) hash += 'text/' + obj.query;
			if( !_.isUndefined(obj.tags) ) hash += 'tags/' + obj.tags;
			if( !_.isUndefined(obj.content) ) hash += '/content/' + obj.content;
			
			//update hash but don't fire a second action
			jda.app.router.navigate(hash,{trigger:false});
			
			this.collection.setSearch(obj,reset);
			this.collection.fetch({
				add : obj.page > 1 ? true : false,
				success : function(model, response){ 
					$('#results-count').text("Showing " + _this.collection.length + " of " + response["items_count"]+ " results");
					_this.renderTags(response.tags);
					_this.render();
					jda.app.killScroll = false; //to activate infinite scroll again
					
				}
			});
		},
		
		getSearch : function(){ return this.collection.search }
	
	})


	Items.Collection = Backbone.Collection.extend({
		
		model:Items.Model,
		base : 'http://dev.zeega.org/jdaapi/web/api/search?',
		search : {	page:1,
					r_itemswithcollections: 0,
					r_items:1,
					r_tags:1

							},
	
		url : function()
		{
			//constructs the search URL
			var url = this.base;
			if( !_.isUndefined(this.search.query) && this.search.query.length > 0) url += '&q=' + this.search.query;
			if( !_.isUndefined(this.search.tags) ) url += '&tags=' + this.search.tags;
			if( !_.isUndefined(this.search.content) ) url += '&content=' + this.search.content;
			if( !_.isUndefined(this.search.page) ) url += '&page=' + this.search.page;
			if( !_.isUndefined(this.search.r_items) ) url += '&r_items=' + this.search.r_items;
			if( !_.isUndefined(this.search.r_tags) ) url += '&r_tags=' + this.search.r_tags;
			if( !_.isUndefined(this.search.r_itemswithcollections) ) url += '&r_itemswithcollections=' + this.search.r_itemswithcollections;
			console.log('search url: '+ url);
			return url;
		},
	
		setSearch : function(obj, reset)
		{
			if(reset) this.search = obj;
			else _.extend(this.search,obj)
			console.log('set search: '+obj.query)
		},
	
		parse : function(response)
		{
			return response.items;
		}
	
	});

	Items.Router = Backbone.Router.extend({ /* ... */ });


})(jda.module("items"));

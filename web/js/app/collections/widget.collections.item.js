(function(Items) {

	Items.MasterCollection = Backbone.View.extend({

		el : $('#collection'),

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
					var itemView = new Items.Views.CollectionItem({model:itemModel});
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
		}

	});

	Items.Collection = Backbone.Collection.extend({

		totalItemsCount : 0,

		initialize : function()
		{
			//get bootstrapped data if it exists
			var itemsBS = jQuery.parseJSON(itemCollectionJSON);

			this.totalItemsCount = itemsBS.items_and_collections_count;
			this.reset( itemsBS.items_and_collections );
		}
		
	});

})(zeegaWidget.module("items"));

(function(Items) {

	// This will fetch the tutorial template and render it.
	Items.Collection.MapPopup = Backbone.View.extend({
		
		tagName : 'ul',
		className : 'discovery-map-list',


		initialize : function() {
			this.Items = jda.module("items");
			var thisListView = this;
			
			this._listItemViews = [];
			this.collection.each(function(item) { 
				var itemView = new thisListView.Items.Views.MapPopup(
					{model : item}
				);
				thisListView._listItemViews.push(itemView);
				$(thisListView.el).append( itemView.render().el );
			});
			this.render();
		},

		render : function() {
			var that = this;
			$(this.el).empty();
	
			var windowHeight = $(window).height();
			interfaceContentHeight = windowHeight - 115;
			$(this.el).width(380);
			$(this.el).height(interfaceContentHeight);
			_(this._listItemViews).each(function(itemView) {
				$(that.el).append(itemView.el);
			});
	
			return (this);
		},
			
		events : {
		},
		
	});
	
})(jda.module("items"));

(function(Items) {

	//renders individual items in a search be they collection or image or audio or video type
	Items.Views.CollectionItem = Backbone.View.extend({
		
	    tagName : 'span',

		initialize : function() {},

		render: function()                 
		{
			var _this = this;

			var blanks = {
				type : this.model.get("media_type").toLowerCase(),
				title : this.model.get('title'),
				creator : this.model.get('media_creator_username'),
				thumbUrl : this.model.get('thumbnail_url')
			};
			//use template to clone the database items into

			var template = _.template( this.getTemplate() );
			//copy the cloned item into the el
			$(this.el).append( template( blanks ) );
			$(this.el)
				.addClass('widget-asset-list')
				.attr({
					'id':'item-'+this.model.id,
					'data-original-title' : this.model.get('title'),
					'data-content' : 'created by: ' + this.model.get('media_creator_username')
				});

			return this;
		},

		getTemplate : function()
		{
			return '<img style="border: solid 1px white;" title="<%= title %>" src="<%= thumbUrl %>" width="80px" height="80px"/>';
		}
	
	});

})(zeegaWidget.module("items"));

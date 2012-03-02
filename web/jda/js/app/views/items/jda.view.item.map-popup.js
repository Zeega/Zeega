(function(Items) {

	// This will fetch the tutorial template and render it.
	Items.Views.MapPopup = Backbone.View.extend({
		
		tagName : 'li',
		className : 'map-popup-list-items',

		render: function(done)
		{
			var _this = this;
			template = this.getTemplate();
			var blanks = this.model.attributes;
		
			
			blanks.id=this.model.get("id").split('.')[1];
			$(this.el).html( _.template( template, blanks ));
			return this;
		},

		getTemplate : function()
		{
			html =
			'<a  class="map-fancymedia" id="<%= id %>" rel="group">'+
			'<div style="float:left;">'+
				'<img  src="<%= thumbnail_url %>" height="50" width="50"/>'+
			'</div>'+
			'<div class="span">'+
				'<%= title %>'+
			'</div>'+
			'</a>';

			return html;
		}		
	});

})(jda.module("items"));
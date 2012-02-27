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
			id = this.model.get("id").split('.')[1];
			$(this.el).html("<a class='fancymedia' id=" + id + ">" +  _.template( template, blanks ) + "</a>");
			return this;
		},

		events : {
			'mouseup' : 'openOverlay'
		},

		openOverlay : function()
		{
			console.log('clicked map popup item: '+ this.model.id )
			$(this.el).fancybox({
				content : '<i class="jdicon-'+this.model.get("type").toLowerCase()+'"></i>'+this.model.get('title')
			})
		},

		getTemplate : function()
		{
			html =

			'<div class="span1">'+
				'<img src="<%= thumbnail_url %>" height="50" width="50"/>'+
			'</div>'+
			'<div class="span3">'+
				'<%= title %>'+
			'</div>'

			return html;
		}		
	});

})(jda.module("items"));
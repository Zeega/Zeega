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
		
			
			//blanks.id=this.model.get("id").split('.')[1];
			$(this.el).html( _.template( template, blanks ));
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
			'<a id="<%= id %>" class="fancymedia" rel="group">'+
			'<div class="span1">'+
				'<img src="<%= thumbnail_url %>" height="50" width="50"/>'+
			'</div>'+
			'<div class="span3">'+
				'<%= title %>'+
			'</div>'+
			'</a>';

			return html;
		}		
	});

})(jda.module("items"));
(function(Items) {

	// This will fetch the tutorial template and render it.
	Items.Views.List = Backbone.View.extend({
		
		tagName : 'li',
		className : 'row',

		render: function(done)
		{
			var _this = this;

			var template;
			switch( this.model.get('type') )
			{
				case 'Image':
					template = this.getImageTemplate();
					break;
				case 'Document':
					template = this.getDocumentTemplate();
					break;
				case 'Website':
					template = this.getWebsiteTemplate();
					break;
				case 'Tweet':
					template = this.getTweetTemplate();
					break;
				default:
					template = this.getDefaultTemplate();
			}
			
			
			
			var blanks = this.model.attributes;
			
			$(this.el).html( _.template( template, blanks ) )
			
			return this;
		},
		
		events : {
			//'mouseup' : 'openOverlay'
		},
		
		openOverlay : function()
		{
			console.log('clicked item: '+ this.model.id )
			$(this.el).fancybox({
				content : '<i class="jdicon-'+this.model.get("type").toLowerCase()+'"></i>'+this.model.get('title')
			})
		},
		
		getImageTemplate : function()
		{
			html =

			'<a id="<%= id %>" class="fancymedia" rel="group"><div class="span2">'+
				'<img src="<%= thumbnail_url %>" height="100" width="100"/>'+
			'</div>'+
			'<div class="span7">'+
				'<%= title %>'+
			'</div>'+
			'<div class="span3">'+
				'<%= date_created.date %>'
			'</div></a>';
			
			return html;
		},
		getDocumentTemplate : function()
		{
			html = 
			
			'<div class="span2">'+
				'<i class="jdicon-document"></i>'+
			'</div>'+
			'<div class="span7">'+
				'<%= title %>'+
			'</div>'+
			'<div class="span3">'+
				'<%= date_created.date %>'
			'</div>';
			
			return html;
		},
		getWebsiteTemplate : function()
		{
			html = 
			
			'<div class="span2">'+
				'<i class="jdicon-website"></i>'+
			'</div>'+
			'<div class="span7">'+
				'<%= title %>'+
			'</div>'+
			'<div class="span3">'+
				'<%= date_created.date %>'
			'</div>';
			
			return html;
		},
		getTweetTemplate : function()
		{
			html = 
			
			'<div class="span2">'+
				'<i class="jdicon-twitter"></i>'+
			'</div>'+
			'<div class="span7">'+
				'<%= title %>'+
			'</div>'+
			'<div class="span3">'+
				'<%= date_created.date %>'
			'</div>';
			
			return html;
		},
		getDefaultTemplate : function()
		{
			html = 
			
			'<div class="span3">'+
				'<%= type %>'+
			'</div>'+
			'<div class="span6">'+
				'<%= title %>'+
			'</div>'+
			'<div class="span3">'+
				'<%= media_date_created.date %>'
			'</div>';
			
			return html;
		}
		
	});
	
})(jda.module("items"));
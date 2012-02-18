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
			if (this.model.get("date_created") != null){
				blanks["date"] = dateFormat(this.model.get("date_created").date, "ddd, mmm dS, yyyy<br/>h:MM:ss TT Z");
			}		
			if (this.model.get("media_date_created") != null){
				blanks["media_date"] = dateFormat(this.model.get("media_date_created").date, "ddd, mmm dS, yyyy<br/>h:MM:ss TT Z");
			} else {
				blanks["media_date"] = "n/a";
			}
			$(this.el).html( _.template( template, blanks ) )
			
			return this;
		},
		
		
		
		getImageTemplate : function()
		{
			html =

			'<a id="<%= id %>" class="fancymedia" rel="group">'+
			'<div class="span2">'+
				'<img src="<%= thumbnail_url %>" height="100" width="100"/>'+
			'</div>'+
			'<div class="span7 item-title">'+
				'<%= title %>'+
			'</div>'+
			'<div class="span3 item-date">'+
				'<%= date %>'
			'</div>'+
			'</a>';
			
			return html;
		},
		getDocumentTemplate : function()
		{
			html = 
			
			'<a id="<%= id %>" class="fancymedia" rel="group">'+
			'<div class="span2">'+
				'<i class="jdicon-document"></i>'+
			'</div>'+
			'<div class="span7 item-title">'+
				'<%= title %>'+
			'</div>'+
			'<div class="span3 item-date">'+
				'<%= date %>'
			'</div>'+
			'</a>';
			
			return html;
		},
		getWebsiteTemplate : function()
		{
			html = 

			'<a id="<%= id %>" class="fancymedia" rel="group">'+
			'<div class="span2">'+
				'<i class="jdicon-website"></i>'+
			'</div>'+
			'<div class="span7 item-title">'+
				'<%= title %>'+
			'</div>'+
			'<div class="span3 item-date">'+
				'<%= date %>'
			'</div>'+
			'</a>';
			
			return html;
		},
		getTweetTemplate : function()
		{
			html = 

			'<a id="<%= id %>" class="fancymedia" rel="group">'+
			'<div class="span2">'+
				'<i class="jdicon-twitter"></i>'+
			'</div>'+
			'<div class="span7 item-title">'+
				'<%= title %>'+
			'</div>'+
			'<div class="span3 item-date">'+
				'<%= date %>'
			'</div>'+
			'</a>';
			
			return html;
		},
		getDefaultTemplate : function()
		{
			html = 
			
			'<a id="<%= id %>" class="fancymedia" rel="group">'+
			'<div class="span3">'+
				'<%= type %>'+
			'</div>'+
			'<div class="span6">'+
				'<%= title %>'+
			'</div>'+
			'<div class="span3">'+
				'<%= media_date %>'
			'</div>'+
			'</a>';
			
			return html;
		}
		
	});
	
})(jda.module("items"));
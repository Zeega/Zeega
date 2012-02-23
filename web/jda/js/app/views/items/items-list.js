(function(Items) {

	// This will fetch the tutorial template and render it.
	Items.Views.List = Backbone.View.extend({
		
		tagName : 'li',
		className : 'row',

		render: function(done)
		{
			var _this = this;

			var template;
			switch( this.model.get('media_type') )
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
				case 'Text':
					template = this.getTestimonialTemplate();
					break;
				case 'Video':
					template = this.getVideoTemplate();
					break;
				
				case 'PDF':
					template = this.getPDFTemplate();
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
			if (this.model.get("text") != null){
				blanks["text"] = this.linkifyTweet(this.model.get("text").substring(0,255) + "...");

			}
			if (this.model.get("description") != null){
				blanks["description"] = this.model.get("description").substring(0,255) + "...";
			}
			if (this.model.get("title") == null || this.model.get("title") == "none" || this.model.get("title") == ""){
				blanks["title"] = "Untitled";
			}
			if (this.model.get("media_creator_realname") == null || this.model.get("media_creator_realname") == ""){
				blanks["author"] = this.model.get("media_creator_username");
			} else {
				blanks["author"] = this.model.get("media_creator_realname");	
			}
			

			$(this.el).html( _.template( template, blanks ) )
			
			return this;
		},
		
		/* formats tweet text, doesn't linkify bc tweet is already linked to fancybox */
		linkifyTweet : function(tweet){

			// urls
			var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	    	tweet = tweet.replace(exp,"<strong>$1</strong>"); 

	    	// users
	    	 tweet = tweet.replace(/(^|)@(\w+)/gi, function (s) {
	        	return '<strong>' + s + '</strong>';
	    	});

	    	// tags
	    	tweet = tweet.replace(/(^|)#(\w+)/gi, function (s) {
	        	return '<strong>' + s + '</strong>';
	     	});

	    	return tweet;
		},
		
		getImageTemplate : function()
		{
			html =

			'<a id="<%= id %>" class="fancymedia" rel="group">'+
			'<div class="span2">'+
				'<img src="<%= thumbnail_url %>" height="100" width="100"/>'+
			'</div>'+
			'<div class="span7">'+
				'<div class="item-title"><%= title %></div>'+
				'<div class="item-author">by <%= author %></div>'+
				
			'</div>'+
			'<div class="span3 item-date">'+
				'<%= date %>'
			'</div>'+
			'</a>';
			
			return html;
		},
		getVideoTemplate : function()
		{
			html =

			'<a id="<%= id %>" class="fancymedia" rel="group">'+
			'<div class="span2">'+
				'<img src="<%= thumbnail_url %>" height="100" width="100"/>'+
			'</div>'+
			'<div class="span7">'+
				'<div class="item-title"><%= title %></div>'+
				'<div class="item-source"><%= layer_type %></div>'+
				'<div class="item-author">by <%= author %></div>'+
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
				'<div class="item-author item-author-left"><%= author %></div>'+
			'</div>'+
			'<div class="span7">'+
				'<div class="item-title"><%= title %></div>'+
				'<div class="item-description"><%= description %></div>'+
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
				'<div class="item-title"><%= title %></div>'+
				
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
				'<div class="item-author item-author-left">by <%= author %></div>'+
			'</div>'+
			'<div class="span7 item-description">'+
				'<%= text %>'+
			'</div>'+
			'<div class="span3 item-date">'+
				'<%= date %>'
			'</div>'+
			'</a>';
			
			return html;
		},
		getTestimonialTemplate : function()
		{
			html = 

			'<a id="<%= id %>" class="fancymedia" rel="group">'+
			'<div class="span2">'+
				'<i class="jdicon-testimonial"></i>'+
				'<div class="item-author item-author-left"><%= author %></div>'+
			'</div>'+
			'<div class="span7 item-description">'+
				'<%= text %>'+
			'</div>'+
			'<div class="span3 item-date">'+
				'<%= date %>'
			'</div>'+
			'</a>';
			
			return html;
		},
		getPDFTemplate : function()
		{
			html = 

			'<a id="<%= id %>" class="fancymedia" rel="group">'+
			'<div class="span2">'+
				'<i class="jdicon-pdf"></i>'+
				'<div class="item-author item-author-left"><%= author %></div>'+
			'</div>'+
			'<div class="span7">'+
				'<div class="item-title"><%= title %></div>'+
				'<div class="item-description"><%= description %></div>'+
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
			'<div class="span2">'+
				'<i class="jdicon-document"></i>'+
				'<div class="item-author item-author-left"><%= author %></div>'+
			'</div>'+
			'<div class="span7">'+
				'<div class="item-title"><%= title %></div>'+
				'<div class="item-description"><%= description %></div>'+
			'</div>'+
			'<div class="span3 item-date">'+
				'<%= date %>'
			'</div>'+
			'</a>';
			
			return html;
		}
		
	});
	
})(jda.module("items"));
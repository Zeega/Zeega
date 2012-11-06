(function(Dashboard){

	Dashboard.Items = Dashboard.Items || {};
	
	
	Dashboard.Items.View =  Backbone.View.extend({
		
		tagName : 'tr',
		className : 'list-media',
		
		initialize: function () {
			var _this=this;
			this.el.id = this.model.id;
		},
		events : {
			'click':'previewItem'
		},
		previewItem: function()
		{
			this.model.trigger('preview_item',this.model.id);
			return false;
		},
		 
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
					template = this.getDefaultTemplate();
					break;
				case 'Website':
					template = this.getWebsiteTemplate();
					break;
				case 'Text':
					template = this.getTestimonialTemplate();
					break;
				case 'Video':
					template = this.getDefaultTemplate();
					break;
				case 'Audio':
					template = this.getDefaultTemplate();
					break;
				case 'PDF':
					template = this.getDefaultTemplate();
					break;
				case 'Collection':
					$(this.el).removeClass('list-fancymedia');
					template = this.getCollectionTemplate();
					break;
				
				default:
					template = this.getDefaultTemplate();
			}
			
			
		
			var blanks = this.model.attributes;
			
			if(_.isUndefined(this.model.get("display_name")))blanks.display_name="none";
				
			if (false&&!_.isUndefined(this.model.get("media_date_created"))&&!_.isNull(this.model.get("media_date_created"))){
				blanks["media_date"] = new Date(this.model.get("media_date_created").replace(" ", "T"));
				blanks["media_date"]=blanks["media_date"].format("mmmm dS, yyyy<br/>h:MM TT");
			} else {
				blanks["media_date"] = "n/a";
			}
			if (!_.isObject(this.model.get("text"))&&!_.isNull(this.model.get("text"))&&!_.isUndefined(this.model.get("text"))){
				var excerpt = this.model.get("text").replace(/\r\n/gi, '<br/>');
			}
			if (this.model.get("description") === null){
				blanks["description"] = " ";
			}
			if (this.model.get("description") !== null && this.model.get("description").length > 255){
				blanks["description"] = this.model.get("description").substring(0,255) + "...";
			}
			if (this.model.get("title") === null || this.model.get("title") == "none" || this.model.get("title") === ""){
				blanks["title"] = "";
			}

			blanks["author"] = this.model.get("media_creator_username");
			
			if (this.model.get("media_type") == "Text" && this.model.get('description').length < this.model.get('text').length){
				blanks["description"] = this.model.get('description') + '...';
			}
			
			if (this.model.get("media_type") == "Website"){
				var parts = this.model.get('attribution_uri').split('http');
				blanks["original_url"] = "http"+parts[2];
			}
			
			
			$(this.el).html( _.template( template, blanks ) );
			
			
			$(this.el).find('.zeega-item-thumbnail').append(new Items.Views.Thumb({model:this.model}).render().el);
			
			return this;
		},

		
		getImageTemplate : function()
		{
			html =


			'<td class="zeega-list-left-column">'+
				'<div class="zeega-item-thumbnail"></div>'+
			'</td>'+
			'<td class="zeega-list-middle-column">'+
				'<h3><%= title %></h3><p >by: <%= author %>'+
				'<p class="jda-item-description"><%= description %></p>'+
			'</td>'+
			'<td class="zeega-list-right-column jda-item-date">'+
				'<div style="position:relative; height:55px"><p class="jda-user-link bottom" style="margin:0px">via <a href="#" ><%= display_name %></a></p></div>'+
			'</td>';
			

			
			return html;
		},
		getDefaultTemplate : function()
		{
			html =


			'<td class="zeega-list-left-column">'+
				'<div class="zeega-item-thumbnail"></div>'+
			'</td>'+
			'<td class="zeega-list-middle-column">'+
				'<h3><%= title %></h3><p class="jda-item-author">by: <%= author %></p>'+
				'<p class="jda-item-description"><%= description %></p>'+
			'</td>'+
			'<td class="zeega-list-right-column jda-item-date">'+
			'<div style="position:relative; height:55px"><p class="jda-user-link bottom" style="margin:0px">via <a href="#" ><%= display_name %></a></p></div>'+
			'</td>';
			

			
			return html;
		},
		getDocumentTemplate : function()
		{
			html =
			


			'<td class="span2">'+
				'<i class="jdicon-document"></i>'+
				'<div class="item-author item-author-left"><%= author %></div>'+
			'</td>'+
			'<td class="jda-item-description">'+
				'<div class="jda-item-title"><%= title %></div>'+
				'<div><%= description %></div>'+
			'</td>'+
			'<td class="jda-item-date">'+
				''+
				'<div style="position:relative; height:55px"><p class="jda-user-link bottom" style="margin:0px">via <a href="#" ><%= display_name %></a></p></div>'+
			'</td>';

			
			return html;
		},
		getWebsiteTemplate : function()
		{
			html =

			'<td class="zeega-list-left-column">'+
				'<div class="zeega-item-thumbnail"></div>'+
			'</td>'+
			'<td class="zeega-list-middle-column">'+
				'<h3><%= title %></h3>'+
				'<p><%= original_url %></p>'+
				'<p class="jda-item-description"><%= description %></p>'+
			'</td>'+
			'<td class="zeega-list-right-column jda-item-date">'+
				''+
				'<div style="position:relative; height:55px"><p class="jda-user-link bottom" style="margin:0px">via <a href="#" ><%= display_name %></a></p></div>'+
			'</td>';
			
			
			return html;
		},

		getTestimonialTemplate : function()
		{
			html =
			'<td class="zeega-list-left-column">'+
				'<div class="zeega-item-thumbnail"></div>'+
			'</td>'+
			'<td class="zeega-list-middle-column">'+
				'<h3><%= title %></h3><p class="jda-item-author">Testimonial by: <%= author %></p>'+
				'<p class="jda-item-description"><%= description %></p>'+
			'</td>'+
			'<td class="zeega-list-right-column jda-item-date">'+
				'<div style="position:relative; height:55px"><p class="jda-user-link bottom" style="margin:0px">via <a href="#" ><%= display_name %></a></p></div>'+
			'</td>';
			return html;
		},
		
	
		
		getCollectionTemplate : function()
		{
			html =

				'<td class="zeega-list-left-column">'+
				'<div class="zeega-item-thumbnail"></div>'+
				'</td>'+
				'<td class="zeega-list-middle-column">'+
					'<h3><%= title %></h3><p>by <a href="#" class="jda-user-link"><%= display_name %></a></p>'+
					'<p class="jda-item-description"><%= description %></p>'+
				'</td>'+
				'<td class="zeega-list-right-column jda-item-date">'+
					''+
				'</td>';
				


			
			return html;
		},
		getDefaultTemplate : function()
		{
			html =
			

				'<td class="zeega-list-left-column">'+
					'<div class="zeega-item-thumbnail"></div>'+
				'</td>'+
				'<td class="zeega-list-middle-column">'+
					'<h3><%= title %></h3><p class="jda-item-author">by: <%= author %></p>'+
					'<p class="jda-item-description"><%= description %></p>'+
				'</td>'+
				'<td class="zeega-list-right-column jda-item-date">'+
					''+
					'<div style="position:relative; height:55px"><p class="jda-user-link bottom" style="margin:0px">via <a href="#" ><%= display_name %></a></p></div>'+
				'</td>';
				

			
			return html;
		}
		
	});

	Dashboard.Items.Model = Backbone.Model.extend();

	Dashboard.Items.Collection = Backbone.Collection.extend({
		initialize:function(options){
			_.extend(this,options);
		},
		url:function(){
			var url;
			if(this.type==='unmoderated') url = zeega.url_prefix+'api/items/unmoderated';
			else if(this.type==='rejected') url = zeega.url_prefix+'api/items/rejected';
			return url;
		},
		parse:function(response){
			return response.items;
		}

	});
	

	
	
})(zeega.dashboard.module("dashboard"));
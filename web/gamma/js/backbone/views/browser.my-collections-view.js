
var MyCollectionsView = Backbone.View.extend({
	model : MyCollections,
	
	initialize : function() {},
	
	render: function()
	{
		for (var i=0; i<3;i++){
			var template = $("#browser-my-collection-template").clone();
			template.addClass('browser-my-collection');
			template.removeAttr('id');
			template.insertAfter($("#browser-create-new-collection"));
		}
		//draw the search items
		return this;
	},
	
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
	
	//item events
	/*previewItem: function(){
		var that = this;
		
		$('#asset-preview').fadeIn();
		
		$('#asset-preview-media').empty();

		//uglyness this should be more like layers?
		var media = null;
		switch (that.model.get('content_type'))
		{
			case 'Image':
				media = $('<img>').attr('src', that.model.get('item_url') );
				break;
			case 'Video':
				media = $('<video>').attr('controls','controls');
				var src = $('<source>').attr('src',that.model.get('item_url')).attr('type','video/mp4');
				media.append(src);
				//do stuff
				break;
			case 'Audio':
				media = $('<video>').attr('controls','controls');
				var src = $('<source>').attr('src',that.model.get('item_url')).attr('type','video/mp4');
				media.append(src);
				break;
		}
		$('#asset-preview-media').append(media);
		
		//this needs to test for the type of media and place the appropriate image/player etc in there
		
		
		var metaTitle = $('<div>').addClass('meta-title').html(that.model.get('title'));
		var metaAuthor = $('<div>').addClass('meta-author').html('Author: '+ that.model.get('creator'));
		var l = $('<a>').attr('href',that.model.get('attribution_url')).attr('target','blank').html('View Source');
		var metaLink = $('<div>').addClass('meta-link').append(l);
		
		$('#asset-preview-meta')
			.empty()
			.append(metaTitle)
			.append(metaAuthor)
			.append(metaLink);
		
	},*/
});

var SearchItemViewCollection = Backbone.View.extend({
	
	initialize : function(){
		
		this.render();
	},
	
	
	render : function(){
		
		return this;
	}
	
});
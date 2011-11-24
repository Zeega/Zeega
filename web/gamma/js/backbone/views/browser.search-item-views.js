//renders individual items in a search be they collection or image or audio or video type
var BrowserItemView = Backbone.View.extend({
	
	
	initialize : function() {
		
		//listens for changes to its model, re-rendering
		this.model.bind('change', this.render, this);
    	this.model.bind('destroy', this.remove, this);
		
	},
	
	render: function()
	{
		
		

		return this;
	},
	
	events: {
		//"click" : "previewItem"
		//'dblclick' : "doubleClick",
		
	},
	
});
var BrowserCollectionView = BrowserItemView.extend({
	model: BrowserItem,
	initialize : function() {
		
		
	},
	render: function()
	{
		var template = $("#browser-results-collection-template").clone();
		template.addClass('browser-results-collection');
		template.removeAttr('id');

		$('#browser-results-collections').append(template);
		return this;
	},

});
var BrowserSingleItemView = BrowserItemView.extend({
	
	initialize : function() {
		
		
	},
	render: function()
	{

		return this;
	},

});
var BrowserImageView = BrowserSingleItemView.extend({
	
	initialize : function() {
		
		
	},
	render: function()
	{
		var template = $("#browser-results-image-template").clone();
		template.addClass('browser-results-image');
		template.removeAttr('id');
		template.find('img').attr('src', 'http://mlhplayground.org/em/web/images/thumbs/' + this.model.get('id') + '_s.jpg');
		template.find('a').attr('href', this.model.get('item_url'));
		template.find('img').attr('title', this.model.get('title'));
		template.find('img').attr('alt', this.model.get('title'));
		$('#browser-results-items').append(template);
		return this;
	},

});
var BrowserAudioView = BrowserSingleItemView.extend({
	
	initialize : function() {
		
		
	},
	render: function()
	{
		var template = $("#browser-results-image-template").clone();
		template.addClass('browser-results-image');
		template.removeAttr('id');
		$('#browser-results-items').append(template);
		return this;
	},

});
var BrowserVideoView = BrowserSingleItemView.extend({
	
	initialize : function() {
		
		
	},
	render: function()
	{
		var template = $("#browser-results-image-template").clone();
		template.addClass('browser-results-image');
		template.removeAttr('id');
		$('#browser-results-items').append(template);
		return this;
	},

});

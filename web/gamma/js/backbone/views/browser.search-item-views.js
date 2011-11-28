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
	
	initialize : function() {
		
		
	},
	render: function()
	{
		var template = $("#browser-results-collection-template").clone();
		template.addClass('browser-results-collection');
		template.removeAttr('id');

		template.find('img').attr('src', (this.model.get('thumb_url') == null ? '404.jpg' : this.model.get('thumb_url')));
		template.find('img').attr('title', this.model.get('title'));

		template.find('img').attr('alt', (this.model.get('thumb_url') == null ? this.model.get('title').substring(0,17) + '...' : this.model.get('title')));
		template.find('.browser-item-count').text('NULL items');
		template.find('.title').text(this.model.get('title'));

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
		template.find('a').attr('id', this.model.get('id'));
		template.find('a').attr('title', this.model.get('title'));
		template.find('img').attr('src', (this.model.get('thumb_url') == null ? '404.jpg' : this.model.get('thumb_url')));
		template.find('a').attr('href', this.model.get('item_url'));
		template.find('img').attr('title', this.model.get('title'));
		template.find('img').attr('alt', (this.model.get('thumb_url') == null ? this.model.get('title').substring(0,17) + '...' : this.model.get('title')));
		$('#browser-results-items').append(template);
		return this;
	},

});
// For displaying caption when viewing single image in FancyBox
var BrowserFancyBoxImageView = BrowserSingleItemView.extend({
	
	initialize: function(){
		
	},
	/* Pass in the element that the user clicked on from fancybox. Fancy box
	uses the object's title as the caption so set that to the element in 
	the template */
	render: function(obj)
	{
		
		var template = $("#browser-fancybox-caption-template").clone();
		template.removeAttr('id');
		template.find('a').attr('href', this.model.get('attribution_url'));
		template.find('.title').text( this.model.get('title'));
		template.find('.creator').text( this.model.get('creator'));
		
		obj.title = template.html();
		
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

var BrowserItem = Backbone.Model.extend({
	defaults : {
		title 	: 'Untitled',
		type	: 'image' //could be image, video or audio
		
	},
	
	initialize : function()
	{
	}

});

var BrowserItemCollection = Backbone.Collection.extend({
	model : BrowserItem,
	
	/*,
	url: function(){
		return Zeega.url_prefix+"search/items/"+ this.offset +"/100";
	}
	*/
	
});

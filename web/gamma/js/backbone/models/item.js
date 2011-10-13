var Item = Backbone.Model.extend({
	defaults : {
		title : 'Untitled'
	}
});

var ItemCollection = Backbone.Collection.extend({
	model : Item,
	
	/*,
	url: function(){
		return Zeega.url_prefix+"search/items/"+ this.offset +"/100";
	}
	*/
	
});

var Filter = Backbone.Model.extend({
	initialize : function() {
	}
});

var Search = Backbone.Model.extend({
	//This should hold the query/filters and the results
	//It will be associated with the discovery views (list, thumbs, tags, event).
	initialize : function() {
	}
});


var ItemCollection = Backbone.Collection.extend({
	model : Item
});

var FilterCollection = Backbone.Collection.extend({
	model : Filter
});

var Item = Backbone.Model.extend({
	initialize : function() {
	}
});

var Tag = Backbone.Model.extend({
	initialize : function() {
	},
});

var TagCollection = Backbone.Collection.extend({
	model : Tag
});
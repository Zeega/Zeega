(function(Frame){


	Frame.Collection = Backbone.Collection.extend({
		model: Frame.Model,
		url : function(){ return zeega.app.url_prefix+"sequences/"+ zeega.app.sequence.id +"/frames" },
		
		initialize : function()
		{}
	});

})(zeega.module("frame"));

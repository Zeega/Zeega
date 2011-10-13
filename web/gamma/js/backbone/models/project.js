var Project =  Backbone.Model.extend({

	url : function(){ return Zeega.url_prefix+"projects/"+this.id;},
	
	defaults :{},
	
	initialize: function(){	},
	

});

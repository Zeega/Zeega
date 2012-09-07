(function(Items){

	Items.Model = Backbone.Model.extend({

		url: function()
		{
			// http://dev.zeega.org/jda/web/api/items/703493
			return sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + "api/items/" + this.id;
		},

		initialize : function(){},

	});

})(zeega.module("items"));

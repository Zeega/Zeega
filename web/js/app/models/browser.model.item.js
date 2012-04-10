(function(Items){

	Items.Model = Backbone.Model.extend({
		defaults : {
			title : 'Untitled'
		},

		url: function()
		{
			return sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + "api/items/" + this.id;
		},

		initialize : function()
		{
		}
	});

})(zeegaBrowser.module("items"));

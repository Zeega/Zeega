(function(Items){

	Items.Model = Backbone.Model.extend({

		defaults : {
			title : 'Untitled'
		},

		url: function()
		{
			// http://dev.zeega.org/jda/web/api/items/703493
			return sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + "api/items/" + this.id;
		},

		initialize : function()
		{
			//var Tag = zeegaBrowser.module('tag');
			//this.tags = new Tag.Collection();
		},

		loadTags : function(successFunction, errorFunction)
		{
			this.tags.reset({silent:true});
			this.tags.item_id=this.id;
			this.tags.fetch({ 
				success:successFunction,
				error:errorFunction,
			});
		},

	});

})(zeegaWidget.module("items"));

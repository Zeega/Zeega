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
			var Tag = zeegaBrowser.module('tag');
			this.tags = new Tag.Collection();
			console.log(this)
		},

		loadTags : function()
		{
			this.tags.item_id = this.id;
			this.tags.fetch({ 
				success: function(response)
				{
					console.log('tags loaded')
				}
			});
			
		}

	});

})(zeegaBrowser.module("items"));

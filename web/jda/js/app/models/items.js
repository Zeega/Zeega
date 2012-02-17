(function(Items) {

	Items.Model = Backbone.Model.extend({
		defaults : {
			'media_creator_realname' : 'unknown',
			'media_creator_username' : 'unknown',
		},
		initialize : function()
		{
			this.tags=new Items.TagCollection();
		},

		loadTags : function(successFunction, errorFunction){
			this.tags.reset({silent:true});
			this.tags.item_id=this.id;
			this.tags.fetch({ 
				success:successFunction,
				error:errorFunction,
			});
		},
		url: function(){
		// http://dev.zeega.org/jda/web/api/items/703493
		return sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') + "api/items/"+ this.id;
		},
	});

})(jda.module("items"));

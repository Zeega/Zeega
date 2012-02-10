(function(Items) {

	Items.Model = Backbone.Model.extend({
		defaults : {
			'media_creator_realname' : 'unknown',
			'media_creator_username' : 'unknown',
		}
	});

})(jda.module("items"));

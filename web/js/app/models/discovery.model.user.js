(function(Users) {
	

	Users.Model = Backbone.Model.extend({

		type:'user',

		defaults : {
			
		},
		initialize : function()
		{
			var test = "hi";
			
		},

		
		
		url : function(){ 
			var url = zeega.discovery.app.apiLocation + 'api/users/' + this.id;
			console.log("Final url for getting user is: " + url);
			return url;
		},
	});

})(zeega.module("users"));

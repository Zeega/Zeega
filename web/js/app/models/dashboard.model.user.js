(function(Dashboard) {
	
	Dashboard.Users= Dashboard.Users || {};
	Dashboard.Users.Model = Backbone.Model.extend({

		type:'user',

		defaults : {
			
		},
		initialize : function()
		{
			
			
		},

		
		
		url : function(){ 
			var url;
			if (this.id >=0){
			 	url = sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') 
			 		+ "api/users/"+ this.id;
			}else{
				url = sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') 
			 		+ "api/users/-1";
			}
			console.log("Final url for getting user is: " + url);
			return url;
		},
	});

})(zeega.dashboard.module("dashboard"));

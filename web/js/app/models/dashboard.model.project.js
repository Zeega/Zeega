(function(Dashboard) {
	
	Dashboard.Project = Dashboard.Project || {};
	Dashboard.Project.Model = Backbone.Model.extend({

		type:'project',

		defaults : {
			
		},
		initialize : function()
		{
			
			
		},

		
		
		url : function(){ 
			var url = sessionStorage.getItem('hostname') + sessionStorage.getItem('directory') 
			 		+ "api/projects/" + this.id;
			
			console.log("Final url for getting project is: " + url);
			return url;
		},
	});

})(zeegaDashboard.module("dashboard"));

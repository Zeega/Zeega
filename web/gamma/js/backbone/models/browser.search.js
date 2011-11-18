var BrowserSearch =  Backbone.Model.extend({
	url : function(){return Zeega.url_prefix + "search/"},
	
	/*default search is to get all media associated with current user
	*/
	defaults :{ 

		'user_id' : -1 //sending -1 gets current user's stuff

	},
	
	//initialize does a default search for all 'My Media'
	initialize: function(){
		

	},

	//updates query and fetches results from DB
	updateQuery: function(){
		//do something
		this.fetch({

			success : function()
			{
				//render stuff here?
			}
		});
	}

});


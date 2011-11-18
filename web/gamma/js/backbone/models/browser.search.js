var BrowserSearch =  Backbone.Model.extend({
	url : function(){return Zeega.url_prefix + "search/"},
	
	//defaults :{ 'attr' : {} },
	
	//initialize does a default search for all 'My Media'
	initialize: function(){
		

	},

	//updates query and fetches results from DB
	updateQuery: function(){
		//do something
		this.fetch({

			success : function()
			{
				//did something
			}
		});
	}

});


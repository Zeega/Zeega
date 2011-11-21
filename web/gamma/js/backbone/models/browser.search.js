var BrowserSearch =  Backbone.Model.extend({
	url : function(){return Zeega.url_prefix + "search/"},
	
	/*default search is to get all media associated with current user
	*/
	defaults :{ 

		'user_id' : -1, //sending -1 gets current user's stuff
		'AllMediaVSMyMedia' : 'My Media'
	},
	
	//initialize does a default search for all 'My Media'
	initialize: function(){
		
		resultSet = new ItemCollection();
		resultSet.bind("add", function(item) {
  			alert("Added item  " + item.get("type") + "!");
		});

	},

	//updates query and fetches results from DB
	updateQuery: function(){

		for (var i=0;i<20;i++){
			var item = new Item();
		
			if (i%4 ==0)
			{
				item.set({type: "image"});
			}
			resultSet.add(item);
		}

		//do something
		this.fetch({

			success : function()
			{
				//render stuff here?
			}
		});
	}

});


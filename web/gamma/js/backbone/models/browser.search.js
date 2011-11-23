var BrowserSearch =  Backbone.Model.extend({

	
	url : function(){return Zeega.url_prefix + "app_dev.php/api/search"},

	defaults: {
    	
    	//Parameters you can send the server
    	"userID"				: 	-1, 
    	"allMediaVSMyMedia"		:   "My Media",

    	//Collections that hold search results
    	"itemsCollection"		: 	new BrowserItemCollection(), //holds results of type =image, video or audio
    	"collectionsCollection" 	: 	new BrowserCollectionCollection(), //holds results of type='collection'

    	//Models that hold distributions of results
    	"timeBinsModel"			:   [], //BrowserTimeBinsModel
    	"mapBinsModel"			: 	[] 	//BrowserMapBinsModel
  	}, 
	
	//initialize default search for all 'My Media'
	initialize: function(){
		
		
		
		
	},

	
	
	//updates query and then fetches results from DB
	updateQuery: function(){
		//reset resultSet
		
		//this is generating random data
		var randomNum =Math.floor(Math.random()*21);
		for (var i=0;i<randomNum;i++){
			
		
			if (i%4 ==0)
			{
				var item = new BrowserItem();
				var coll = this.get("itemsCollection");
				coll.add(item);
				
			} else {
				var item = new BrowserCollection();
				var coll = this.get("collectionsCollection");
				coll.add(item);
			}
			
		}

		//do something
		/*this.fetch({

			success : function()
			{
				//render stuff here?
			}
		});*/
	}

});


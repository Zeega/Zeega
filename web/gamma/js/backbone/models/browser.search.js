var BrowserSearch =  Backbone.Collection.extend({

	model :Item,
	url : function(){return Zeega.url_prefix + "search/"},
	
	userID:-1, 
	allMediaVSMyMedia:'My Media',

	itemCount : 0,
	collectionCount : 0,

	
	
	//initialize default search for all 'My Media'
	initialize: function(){
		
		
		
		
	},

	
	
	//updates query and then fetches results from DB
	updateQuery: function(){
		//reset resultSet
		
		//this is generating random data
		var randomNum =Math.floor(Math.random()*21);
		for (var i=0;i<randomNum;i++){
			var item = new Item();
		
			if (i%4 ==0)
			{
				item.set({itemType: "image"});
				this.itemCount++;
			} else {
				this.collectionCount++;
			}
			this.add(item);
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


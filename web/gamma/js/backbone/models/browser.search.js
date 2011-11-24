var BrowserSearch =  Backbone.Model.extend({

	
	url : function(){return Zeega.url_prefix + "app_dev.php/api/search"},

	defaults: {
    	
    	//Parameters you can send the server
    	"user"					: 	-1, //if userID is -1 then it'll search in current user's stuff
    	"q"						: 	null, //query string
    	"collection"			: 	null, //collection ID, only search within this collection
    	"page"					: 	1, //which page we are on
    	"limit"					:  	100, //how many results to send back

    	//Collections that hold search results
    	"itemsCollection"		: 	new BrowserItemCollection(), //holds results of type =image, video or audio
    	"collectionsCollection" : 	new BrowserCollectionCollection(), //holds results of type='collection'

    	//Models that hold distributions of results
    	"timeBinsModel"			:   [], //BrowserTimeBinsModel
    	"mapBinsModel"			: 	[] 	//BrowserMapBinsModel
  	}, 
	
	//initialize default search for all 'My Media'
	initialize: function(){
		
		
		
		
	},

	parse: function(data){

		var items = this.get("itemsCollection");
		var colls = this.get("collectionsCollection");

		items.reset();
		colls.reset();

		console.log('returned ' + data[0].count + ' items');
		
		if (data[0]['items'] != null){
			_.each(data[0]['items'], function(item){
				var type = item['content_type'];
				console.log('type is ' + type);
				this.get("itemsCollection").add(new BrowserItem(item));
			}, this)
		}
		
		
	},
	
	//updates query and then fetches results from DB
	updateQuery: function(){
		

		/*//this is generating random data
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
			
		}*/

		//do something
		this.fetch({
			data: 	{
						/*
						todo -- add this back in
						user: this.get("user"),
						q: this.get("q"),
						collection: this.get("collection")*/

					},

			success : function()
			{
				console.log('successful query - good work everyone');
				ZeegaBrowser.queryDone();
			}
		});
	}

});


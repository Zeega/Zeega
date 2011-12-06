var BrowserSearch =  Backbone.Model.extend({

	
	url : function(){

		var finalURL = Zeega.url_prefix + "app_dev.php/api/search?" 
					+ (this.get("q") != null ? "q=" + this.get("q") + "&" : "")
					+ (this.get("user") == -1 ? "user=" + this.get("user") + "&" : "")
					+ (this.get("content") != null ? "content=" + this.get("content") + "&": "");
		console.log("Final URL is: " + finalURL);
		return finalURL;

	},

	defaults: {
    	
    	//Parameters you can send the server
    	"user"					: 	-1, //if userID is -1 then it'll search in current user's stuff
    	"q"						: 	"", //query string
    	"content"				: 	"all", //All/image/video/audio
    	"collection"			: 	null, //collection ID, only search within this collection
    	"page"					: 	1, //which page we are on
    	"limit"					:  	100, //how many results to send back

    	//Collections that hold search results
    	"itemsCollection"		: 	new ItemCollection(), //holds results of type =image, video or audio
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

		if (data == null || data['items_count'] ==null){
			console.log('No search items returned. Something is null man.');
		} else {
			console.log('returned ' + data['items_count'] + ' items');
			console.log('returned ' + data['collections_count'] + ' collections');
		}

		//Assemble item data into BrowserItems
		if (data['items'] != null){
			_.each(data['items'], function(item){
				var type = item['content_type'];
				
				this.get("itemsCollection").add(new Item(item));
			}, this);
		}
		//Assemble collection data into BrowserCollections
		if (data['collections'] != null){
			_.each(data['collections'], function(collection){
			
				
				this.get("collectionsCollection").add(new BrowserCollection(collection));
			}, this);

		}
		
		
	},
	
	//updates query and then fetches results from DB
	updateQuery: function(){

		this.fetch({
			success : function()
			{
				console.log('successful query - good work everyone');
				ZeegaBrowser.renderResults();
			}
		});
	}

});


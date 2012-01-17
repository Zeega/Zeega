var BrowserSearch =  Backbone.Model.extend({

	
	url : function(){
		
		var isTimeSearch = this.get("dtstart") != 0 && this.get("dtend") != 0;
		var finalURL = sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/search?" 
					+ (this.get("page") > 1 ? "page=" + (this.get("page")) + "&" : "")
					+ (this.get("q") != null ? "q=" + encodeURIComponent(this.get("q")) + "&" : "")
					+ (this.get("user") == -1 ? "user=" + this.get("user") + "&" : "")
					+ (this.get("content") != null ? "content=" + this.get("content") + "&": "")
					+ (this.get("collection") != null ? "collection=" + this.get("collection") + "&": "")
					+ (isTimeSearch ? "dtstart=" + this.get("dtstart") + "&": "")
					+ (isTimeSearch ? "dtend=" + this.get("dtend") + "&": "")
					+ (isTimeSearch ? "dtintervals=" + this.get("dtintervals") + "&": "")
					+ (isTimeSearch ? "r_collections=" + this.get("r_collections") + "&": "")
					+ (isTimeSearch ? "r_items=" + this.get("r_items") + "&": "")
					+ (isTimeSearch ? "r_time=" + this.get("r_time") + "&": "");
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

    	//Time filter parameters
    	"dtstart"				: 0, //start date in seconds
    	"dtend"					: 0, //end date in seconds
    	"dtintervals"			: 5, //10 is really too many right now
    	"r_collections"			: 1, //return collections?
    	"r_items"				: 1, //return items?
    	"r_time"				: 1, //return time bins?

    	//Collections that hold search results
    	"itemsCollection"		: 	new ItemCollection(), //holds results of type =image, video or audio
    	"collectionsCollection" : 	new BrowserCollectionCollection(), //holds results of type='collection'

    	//Models that hold distributions of results
    	"timeBinsCollection"			:   new BrowserTimeBinCollection(), //BrowserTimeBinsModel
    	"mapBinsModel"			: 	[] 	//BrowserMapBinsModel, NOT IMPLEMENTED
  	}, 
	
	//initialize default search for all 'My Media'
	initialize: function(){
		
		
		
		
	},

	parse: function(data){

		var items = this.get("itemsCollection");
		var colls = this.get("collectionsCollection");
		var timeBins = this.get("timeBinsCollection");

		//Only reset items and collections if we are on page 1
		//Otherwise we want to add to the results because the user has loaded more results
		if (this.get("page") == 1){
			items.reset();
			colls.reset();
			
		}
		timeBins.reset();	
		

		if (data == null || data['items_count'] ==null){
			console.log('No search items returned. Something is null man.');
		} else {
			console.log('returned ' + data['returned_items_count'] + ' out of ' + data['items_count'] + ' total items');
			console.log('returned ' + data['returned_collections_count'] + ' out of ' + data['collections_count'] +' total collections');
		}

		//Assemble item data into BrowserItems
		if (data['items'] != null){
			this.get("itemsCollection").totalItemsCount = data['items_count'];
			_.each(data['items'], function(item){
				var type = item['content_type'];
				
				this.get("itemsCollection").add(new Item(item));
			}, this);
		}
		//Assemble collection data into BrowserCollections
		if (data['collections'] != null){
			this.get("collectionsCollection").totalCollectionsCount = data['collections_count'];
			_.each(data['collections'], function(collection){
			
				
				this.get("collectionsCollection").add(new BrowserCollection(collection));
			}, this);

		}
		//Assemble time bin data into TimeBinCollection
		if (data['time_distribution'] != null){
			_.each(data['time_distribution'], function(timeBin){
			
				
				this.get("timeBinsCollection").add(new BrowserTimeBin(timeBin));
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
	}, 

	getFormattedStartDate: function(){
		if (this.get("dtstart") == 0){
			return 0;
		} else {
			var d = new Date(this.get("dtstart") * 1000);
			return d.getFullYear();
		}
	},
	getFormattedEndDate: function(){
		if (this.get("dtend") == 0){
			return 0;
		} else {
			var d = new Date(this.get("dtend") * 1000);
			return d.getFullYear();
		}
	},

});


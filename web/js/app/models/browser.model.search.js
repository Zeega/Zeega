(function(Items){

	Items.Search = Backbone.Model.extend({
		
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
    	
	    	//What do you want back?
	    	"r_collections"			: false, //return collections?
	    	"r_itemswithcollections" : true, //return items and collections, mixed?
	    	"r_items"				: false, //return items?
	    	"r_time"				: true, //return time bins?

	  	},
	
		getUrl : function()
		{
			var isTimeSearch = this.get("dtstart") != 0 && this.get("dtend") != 0;
			var finalURL = sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/search?site="+sessionStorage.getItem('siteid')+"&" 
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
			//console.log("Final URL is: " + finalURL);
			return finalURL;

		}

		

/*
		parse: function(data)
		{
			var items = this.get("itemsCollection");
			var colls = this.get("collectionsCollection");
			var timeBins = this.get("timeBinsCollection");

			//Only reset items and collections if we are on page 1
			//Otherwise we want to add to the results because the user has loaded more results
			if (this.get("page") == 1)
			{
				items.reset();
				colls.reset();
			}
			timeBins.reset();	
		
			if (data == null || data['items_count'] ==null)
			{
				console.log('No search items returned. Something is null man.');
			}
			else
			{
				console.log('returned ' + data['returned_items_and_collections_count'] + ' out of ' + data['items_and_collections_count'] + ' total items and collections');
				console.log('returned ' + data['returned_items_count'] + ' out of ' + data['items_count'] + ' total items');
				console.log('returned ' + data['returned_collections_count'] + ' out of ' + data['collections_count'] +' total collections');
			}

			//Assemble item and collection data into objects
			if (data['items_and_collections'] != null){
				this.get("itemsCollection").totalItemsCount = data['items_and_collections_count'];
				_.each(data['items_and_collections'], function(item){
					var type = item['type'];
					if (type == "Collection"){
						this.get("itemsCollection").add(new BrowserCollection(item));
					}else {
						this.get("itemsCollection").add(new Item(item));
					}
				}, this);
			}
*/
			//	Assemble item data into BrowserItems
			/* THIS IS FOR WHEN ITEMS AND COLLECTIONS COME BACK SEPARATELY WHICH IS NOT THE CASE RIGHT NOW
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

			}*/
/*
			//Assemble time bin data into TimeBinCollection
			if (data['time_distribution'] != null){
				_.each(data['time_distribution'], function(timeBin){
			
				
					this.get("timeBinsCollection").add(new BrowserTimeBin(timeBin));
				}, this);
				this.get("timeBinsCollection").min_date = data['time_distribution_info']['min_date'];
				this.get("timeBinsCollection").max_date = data['time_distribution_info']['max_date'];
			}
		
		}
*/
	});
	
})(zeegaBrowser.module("items"));


(function(Items){

	Items.Search = Backbone.Model.extend({
		
		defaults: {
    	
	    	//Parameters you can send the server
	    	//"user"					: 	-1, //if userID is -1 then it'll search in current user's stuff
	    	"q"						: 	"", //query string
	    	"content"				: 	"all", //All/image/video/audio
	    	"collection"			: 	null, //collection ID, only search within this collection
	    	"page"					: 	0, //which page we are on, page count starts at 0
	    	"limit"					:  	100, //how many results to send back

	    	//Time filter parameters
	    	"dtstart"				: 0, //start date in seconds
	    	"dtend"					: 0, //end date in seconds
	    	"dtintervals"			: 5, //10 is really too many right now
    	
	    	//What do you want back?
	    	"r_collections"			: false, //return collections?
	    	"r_itemswithcollections" : 0, //return items and collections, mixed?
	    	"r_items"				: 1, //return items?
	    	"r_time"				: false, //return time bins?
	  	},
	
		getUrl : function()
		{
			var isTimeSearch = this.get("dtstart") != 0 && this.get("dtend") != 0;
			var finalURL = sessionStorage.getItem('hostname')+sessionStorage.getItem('directory') + "api/search?site="+sessionStorage.getItem('siteid')+"&" 
						+ "r_items=" + this.get("r_items") + "&"
						+ "r_itemswithcollections=" + this.get("r_itemswithcollections") + "&"
						+ (sessionStorage.getItem('site') != null ? "site=" + sessionStorage.getItem('site') : "")
						+ (this.get("page") > 0 ? "page=" + (this.get("page")) + "&" : "")
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

		}
	});
	
})(zeegaBrowser.module("items"));


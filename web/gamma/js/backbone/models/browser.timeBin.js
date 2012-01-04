var BrowserTimeBin = Backbone.Model.extend({
	

	initialize: function(){
		
		if (this.get("start_date")) { 
			var d = new Date(this.get("start_date") * 1000);

			this.set({"start_date" : d.getFullYear()}); 
		}
		if (this.get("end_date")) { 
			var d = new Date(this.get("end_date") * 1000);

			this.set({"end_date" : d.getFullYear()});
		}
		
		
	}
});

var BrowserTimeBinCollection = Backbone.Collection.extend({
	model : BrowserTimeBin,
	
	/*,
	url: function(){
		return Zeega.url_prefix+"search/items/"+ this.offset +"/100";
	}
	*/
	
});

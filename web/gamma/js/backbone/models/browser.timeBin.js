var BrowserTimeBin = Backbone.Model.extend({
	

	initialize: function(){
		
		if (this.get("start_date")) { 
			var d = new Date(this.get("start_date") * 1000);

			this.set({"formatted_start_date" : d.getMonthAbbreviation() + " " + d.getFullYear()}); 
		}
		if (this.get("end_date")) { 
			var d = new Date(this.get("end_date") * 1000);

			this.set({"formatted_end_date" : d.getMonthAbbreviation() + " " + d.getFullYear()});
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
